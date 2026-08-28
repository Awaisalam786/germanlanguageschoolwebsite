import { supabase } from '../src/lib/supabaseClient';

export default async function sitemap() {
  const baseUrl = 'https://germanlearningschool.com';

  const staticRoutes = [
    '',
    '/courses',
    '/about',
    '/contact',
    '/faq',
    '/blog',
    '/teachers',
    '/gallery',
    '/testimonials',
    '/howItWorks',
    '/enroll',
    '/translator',
    '/practice-tests',
    '/practice-tests/noun-builder',
    '/founder',
    '/books'
  ].map((route) => ({
    url: `${baseUrl}${route}`
  }));

  let blogRoutes = [];
  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, created_at, updated_at')
      .eq('status', 'Published');

    if (posts) {
      blogRoutes = posts.map((post) => {
        const routeObj = { url: `${baseUrl}/blog/${post.slug}` };
        if (post.updated_at) routeObj.lastModified = post.updated_at;
        else if (post.created_at) routeObj.lastModified = post.created_at;
        return routeObj;
      });
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return [...staticRoutes, ...blogRoutes];
}
