import { supabase } from '../../src/lib/supabaseClient';
import Blog from '../../src/views/Blog';

export const revalidate = 60; // Revalidate cache every 60 seconds so new/edited posts show without a full redeploy

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'Published')
    .order('created_at', { ascending: false });

  return <Blog initialPosts={posts || []} />;
}
