// Server-side guard for blog HTML coming from the CMS (Supabase blog_posts.content).
//
// The post title is the page's only <h1> (rendered by src/views/BlogPost.jsx),
// so any <h1> inside the stored article body is demoted to <h2>. The editor
// only offers H2/H3, but pasted content can still carry an <h1>. Attributes
// and inner HTML are preserved; nothing else in the content is changed.
export function normalizeBlogContentHeadings(html) {
  if (typeof html !== 'string' || !/<h1[\s>]/i.test(html)) return html;
  return html
    .replace(/<h1(\s[^>]*)?>/gi, (_, attrs = '') => `<h2${attrs}>`)
    .replace(/<\/h1\s*>/gi, '</h2>');
}
