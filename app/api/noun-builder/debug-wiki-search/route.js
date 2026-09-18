import { NextResponse } from 'next/server';

// TEMPORARY diagnostic route — safe to delete once the Auto-Fetch Images
// license-matching issue is resolved. No auth, no DB access, just proxies
// a Wikimedia Commons search so we can see the raw response shape from a
// browser (cross-origin fetch to Wikimedia is blocked by CORS/CSP from the
// browser pane, but Vercel's server can reach it fine).
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || 'book';
  const WIKI_USER_AGENT = 'NounBuilderBot/1.0 (https://germanlearningschool.com; contact: admin@germanlearningschool.com)';
  const searchTerms = `filetype:bitmap OR filetype:drawing ${q}`;
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=pageimages|imageinfo&generator=search&gsrsearch=${encodeURIComponent(searchTerms)}&gsrlimit=5&iiprop=url|extmetadata`;
  try {
    const res = await fetch(apiUrl, { headers: { 'User-Agent': WIKI_USER_AGENT } });
    const rawText = await res.text();
    let parsed = null;
    try { parsed = JSON.parse(rawText); } catch {}
    const pages = parsed && parsed.query ? Object.values(parsed.query.pages) : [];
    const summary = pages.map(p => ({
      title: p.title,
      hasImageinfo: !!(p.imageinfo && p.imageinfo.length),
      license: p.imageinfo?.[0]?.extmetadata?.LicenseShortName?.value ?? null,
      imageUrl: p.imageinfo?.[0]?.url ?? null,
    }));
    return NextResponse.json({ status: res.status, ok: res.ok, summary, rawSnippet: rawText.slice(0, 500) });
  } catch (err) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
