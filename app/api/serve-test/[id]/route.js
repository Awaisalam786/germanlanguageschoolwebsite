import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    console.log('[serve-test] Received ID:', id);

    if (!id) {
      return new NextResponse('Test ID is required', { status: 400 });
    }

    // Use service role to fetch material without RLS restrictions
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // 1. Look up the material by ID to get the file_url
    const { data: material, error: dbError } = await supabase
      .from('practice_materials')
      .select('file_url, title, is_active')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    console.log('[serve-test] DB result:', material, 'Error:', dbError);

    if (dbError || !material) {
      console.error('[serve-test] Material not found or DB error:', dbError);
      return new NextResponse('Test not found or inactive', { status: 404 });
    }

    // 2. Fetch the actual HTML file content from Supabase Storage
    console.log('[serve-test] Fetching file from URL:', material.file_url);
    const response = await fetch(material.file_url);

    if (!response.ok) {
      console.error('[serve-test] Storage fetch failed, status:', response.status);
      return new NextResponse('Failed to load test file', { status: 502 });
    }

    const htmlContent = await response.text();
    console.log('[serve-test] HTML loaded, length:', htmlContent.length);

    // 3. Serve with correct Content-Type — browser renders quiz UI, not raw code
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('[serve-test] Unexpected error:', err);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
