import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

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

    let htmlContent = await response.text();
    console.log('[serve-test] HTML loaded, length:', htmlContent.length);

    // Auto-inject the score submission script so the user doesn't have to edit HTML manually
    const autoSubmitScript = `
    <script>
      // Auto-submit script injected by German Learning School platform
      (function() {
        let scoreSent = false;

        function sendScoreToPlatform() {
          if (scoreSent) return;
          try {
             const finalScoreEl = document.getElementById('finalScore');
             if (finalScoreEl && window.parent) {
                 const scoreText = finalScoreEl.textContent; // e.g., "45 / 50"
                 const parts = scoreText.split('/');
                 if (parts.length === 2) {
                     const score = parseInt(parts[0].trim());
                     const total = parseInt(parts[1].trim());
                     if (!isNaN(score) && !isNaN(total)) {
                       window.parent.postMessage({
                           type: 'PRACTICE_TEST_COMPLETE',
                           score: score,
                           totalMarks: total,
                           answers: null
                       }, '*');
                       scoreSent = true;
                       console.log('Score automatically sent to platform:', score, '/', total);
                     }
                 }
             }
          } catch(e) {
             console.error('Error auto-submitting score:', e);
          }
        }

        // Method 1: Intercept finishTest if it exists (Standard template)
        if (typeof window.finishTest === 'function') {
          const originalFinishTest = window.finishTest;
          window.finishTest = function() {
            originalFinishTest.apply(this, arguments);
            sendScoreToPlatform();
          };
        }

        // Method 2: Watch the DOM for the result screen to appear as a fallback
        window.addEventListener('load', () => {
          const observer = new MutationObserver(() => {
            const resultScreen = document.getElementById('resultScreen');
            if (resultScreen && !resultScreen.classList.contains('hidden')) {
               sendScoreToPlatform();
            }
          });
          observer.observe(document.body, { childList: true, subtree: true, attributes: true });
        });
      })();
    </script>
    </body>
    `;
    
    // Inject before </body> if it exists, otherwise just append
    if (htmlContent.includes('</body>')) {
      htmlContent = htmlContent.replace('</body>', autoSubmitScript);
    } else {
      htmlContent += autoSubmitScript;
    }

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
