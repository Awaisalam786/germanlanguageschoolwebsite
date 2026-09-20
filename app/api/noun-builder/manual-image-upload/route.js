import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import sharp from 'sharp';

// Manual image upload — used when the Wikimedia auto-fetch pipeline can't
// find a match. Fetches a pre-generated original illustration from this same
// site's own /temp-icons/<germanNoun>.png (public static asset — no
// licensing concerns, created for this app), resizes/converts it exactly
// like the auto-fetch flow does, uploads to Supabase Storage, and updates
// the row. Fetching over HTTP (rather than reading public/ off the local
// filesystem) avoids the same serverless-bundling pitfalls we hit with sharp
// earlier. Only germanNoun is sent over the wire, so there's no large
// payload per request.
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const authClient = createServerClient(supabaseUrl, supabaseAnonKey, { cookies: { get(name) { return cookieStore.get(name)?.value; } } });
    const { data: { session }, error: authError } = await authClient.auth.getSession();

    if (authError || !session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { autoRefreshToken: false, persistSession: false } });

    const { germanNoun } = await request.json();
    if (!germanNoun) {
      return NextResponse.json({ error: 'germanNoun is required' }, { status: 400 });
    }

    const { data: noun, error: fetchError } = await adminSupabase
      .from('noun_builder_nouns')
      .select('*')
      .eq('german_noun', germanNoun)
      .maybeSingle();
    if (fetchError) return NextResponse.json({ error: 'Database fetch error: ' + fetchError.message }, { status: 500 });
    if (!noun) return NextResponse.json({ error: `No noun found matching "${germanNoun}"` }, { status: 404 });

    const iconUrl = `https://germanlearningschool.com/temp-icons/${encodeURIComponent(germanNoun)}.png`;
    const iconRes = await fetch(iconUrl);
    if (!iconRes.ok) {
      return NextResponse.json({ error: `No bundled icon found for "${germanNoun}" at ${iconUrl} (HTTP ${iconRes.status})` }, { status: 404 });
    }
    const inputBuffer = Buffer.from(await iconRes.arrayBuffer());

    const sanitizeFilename = (str) => {
      const charMap = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss', 'Ä': 'Ae', 'Ö': 'Oe', 'Ü': 'Ue' };
      let s = str.replace(/[äöüßÄÖÜ]/g, m => charMap[m]);
      return s.toLowerCase().replace(/[^a-z0-9]/g, '');
    };

    const webpBuffer = await sharp(inputBuffer).resize(800, 800, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();

    const baseName = sanitizeFilename(noun.german_noun || 'noun');
    const filename = `${baseName}-${noun.id}.webp`;
    const { error: uploadError } = await adminSupabase.storage.from('noun-images').upload(filename, webpBuffer, { contentType: 'image/webp', upsert: true });
    if (uploadError) return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 });

    const { data: publicUrlData } = adminSupabase.storage.from('noun-images').getPublicUrl(filename);

    await adminSupabase.from('noun_builder_nouns').update({
      image_url: publicUrlData.publicUrl,
      image_status: 'ready',
      image_source: 'Original illustration',
      image_source_url: null,
      image_license: 'Original artwork (Lucide icon on brand background)',
      image_attribution: 'Created for German Learning School',
      image_fetched_at: new Date().toISOString(),
    }).eq('id', noun.id);

    return NextResponse.json({ success: true, id: noun.id, url: publicUrlData.publicUrl });
  } catch (err) {
    console.error('[noun-builder/manual-image-upload] Error:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Error' }, { status: 500 });
  }
}
