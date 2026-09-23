import { supabase } from '../../src/lib/supabaseClient';
import Blog from '../../src/views/Blog';
import SchemaMarkup from '../../src/components/SchemaMarkup';

export const revalidate = 60; // Revalidate cache every 60 seconds so new/edited posts show without a full redeploy

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://germanlearningschool.com/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://germanlearningschool.com/blog" }
  ]
};

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'Published')
    .order('created_at', { ascending: false });

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <Blog initialPosts={posts || []} />
    </>
  );
}
