import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import sharp from 'sharp';

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
    
    const { nounIds } = await request.json();
    if (!Array.isArray(nounIds) || nounIds.length === 0) return NextResponse.json({ error: 'No noun IDs' }, { status: 400 });
    
    const { data: nouns, error: fetchError } = await adminSupabase.from('noun_builder_nouns').select('*').in('id', nounIds);
    if (fetchError) return NextResponse.json({ error: 'Database fetch error' }, { status: 500 });
    
    const results = [];
    const sanitizeFilename = (str) => {
      const charMap = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss', 'Ä': 'Ae', 'Ö': 'Oe', 'Ü': 'Ue' };
      let s = str.replace(/[äöüßÄÖÜ]/g, m => charMap[m]);
      return s.toLowerCase().replace(/[^a-z0-9]/g, '');
    };
    
    for (const noun of nouns) {
      if (noun.image_url && noun.image_url.trim() !== '') {
        results.push({ id: noun.id, status: 'skipped', reason: 'exists' });
        continue;
      }
      try {
        const sq = encodeURIComponent(noun.english_meaning);
        const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=pageimages|imageinfo&generator=search&gsrsearch=filetype:bitmap|drawing ${sq}&gsrlimit=3&iiprop=url|extmetadata`;
        const searchRes = await fetch(apiUrl, { headers: { 'User-Agent': 'NounBuilder/1.0' } });
        const searchData = await searchRes.json();
        let bestImage = null;
        let extMetadata = null;
        let sourceUrl = null;
        if (searchData.query && searchData.query.pages) {
          const pages = Object.values(searchData.query.pages);
          for (const page of pages) {
             if (page.imageinfo && page.imageinfo.length > 0) {
                const info = page.imageinfo[0];
                extMetadata = info.extmetadata;
                if (extMetadata && extMetadata.LicenseShortName) {
                   const lic = extMetadata.LicenseShortName.value.toLowerCase();
                   if (lic.includes('cc-by') || lic.includes('cc0') || lic.includes('pd') || lic.includes('public domain')) {
                       bestImage = info.url;
                       sourceUrl = info.descriptionurl || `https://commons.wikimedia.org/wiki/File:`;
                       break;
                   }
                }
             }
          }
        }
        if (!bestImage) {
          await adminSupabase.from('noun_builder_nouns').update({ image_status: 'missing' }).eq('id', noun.id);
          results.push({ id: noun.id, status: 'missing' });
          continue;
        }
        // Wikimedia's servers reject/throttle requests without a descriptive
        // User-Agent (see https://meta.wikimedia.org/wiki/User-Agent_policy);
        // the search call above sends one, but this raw file download didn't.
        const imgRes = await fetch(bestImage, { headers: { 'User-Agent': 'NounBuilder/1.0 (germanlearningschool.com)' } });
        if (!imgRes.ok) {
          throw new Error(`Image download failed: HTTP ${imgRes.status} for ${bestImage}`);
        }
        const buffer = await imgRes.arrayBuffer();
        if (!buffer || buffer.byteLength === 0) {
          throw new Error(`Image download returned an empty body for ${bestImage}`);
        }
        const webpBuffer = await sharp(Buffer.from(buffer)).resize(800, 800, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
        let baseName = sanitizeFilename(noun.german_noun || 'noun');
        const filename = `${baseName}-${noun.id}.webp`;
        const { error: uploadError } = await adminSupabase.storage.from('noun-images').upload(filename, webpBuffer, { contentType: 'image/webp', upsert: true });
        if (uploadError) throw new Error(uploadError.message);
        const { data: publicUrlData } = adminSupabase.storage.from('noun-images').getPublicUrl(filename);
        const artist = extMetadata.Artist ? extMetadata.Artist.value.replace(/<[^>]*>?/gm, '').trim() : 'Unknown';
        const license = extMetadata.LicenseShortName ? extMetadata.LicenseShortName.value : 'Unknown License';
        const attribution = `Image by ${artist} (${license})`;
        await adminSupabase.from('noun_builder_nouns').update({
          image_url: publicUrlData.publicUrl,
          image_status: 'ready',
          image_source: 'Wikimedia Commons',
          image_source_url: sourceUrl,
          image_license: license,
          image_attribution: attribution,
          image_fetched_at: new Date().toISOString()
        }).eq('id', noun.id);
        results.push({ id: noun.id, status: 'ready' });
      } catch (err) {
        // Logged so the real cause shows up in Vercel's function logs instead
        // of every failure looking identical from the client's point of view.
        console.error(`[noun-builder/process-images] "${noun.german_noun}" (${noun.id}) failed:`, err?.message || err);
        await adminSupabase.from('noun_builder_nouns').update({ image_status: 'failed' }).eq('id', noun.id);
        results.push({ id: noun.id, status: 'failed', error: err?.message || 'Unknown error' });
      }
    }
    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error('[noun-builder/process-images] Top-level error:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Error' }, { status: 500 });
  }
}
