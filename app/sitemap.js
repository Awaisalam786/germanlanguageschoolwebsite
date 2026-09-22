import { supabase } from '../src/lib/supabaseClient';

export const revalidate = 3600; // Regenerate sitemap hourly so newly published blog posts get added automatically

export default async function sitemap() {
  const baseUrl = 'https://germanlearningschool.com';

  const staticRoutes = [
    '',
    '/courses',
    '/courses/german-a1',
    '/courses/german-a2',
    '/courses/german-b1',
    '/courses/german-b2',
    '/goethe-exam-preparation',
    '/telc-exam-preparation',
    '/testdaf-preparation',
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
    '/practice-tests/german-a1',
    '/practice-tests/german-a2',
    '/practice-tests/german-b1',
    '/practice-tests/german-b2',
    '/founder',
    '/books',
    '/resources'
  ].map((route) => ({
    url: `${baseUrl}${route}`
  }));

  let blogRoutes = [];
  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'Published');

    if (posts) {
      blogRoutes = posts.map((post) => {
        const routeObj = { url: `${baseUrl}/blog/${post.slug}` };
        const dateVal = post.updated_at || post.published_at || post.created_at;
        if (dateVal) routeObj.lastModified = new Date(dateVal);
        return routeObj;
      });
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return [...staticRoutes, ...blogRoutes];
}
