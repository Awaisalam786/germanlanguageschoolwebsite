import { supabase } from '../../../src/lib/supabaseClient';
import BlogPostClient from '../../../src/views/BlogPost';
import { notFound } from 'next/navigation';

export const revalidate = 60; // Revalidate cache every 60 seconds

export async function generateMetadata({ params }) {
  const { data } = await supabase.from('blog_posts').select('*').eq('slug', params.slug).single();
  if (!data) return { title: 'Post Not Found' };
  
  return {
    title: data.meta_title || data.title,
    description: data.meta_description || data.summary,
    alternates: {
      canonical: `/blog/${params.slug}`,
    },
    openGraph: {
      title: data.meta_title || data.title,
      description: data.meta_description || data.summary,
      images: data.image ? [data.image] : [],
    }
  };
}

export default async function BlogPostPage({ params }) {
  const { data: post } = await supabase.from('blog_posts').select('*').eq('slug', params.slug).single();
  
  if (!post) {
    notFound();
  }

  // Fetch related posts (same category, published, excluding current)
  const { data: related } = await supabase.from('blog_posts')
    .select('*')
    .eq('category', post.category)
    .eq('status', 'Published')
    .neq('id', post.id)
    .order('created_at', { ascending: false })
    .limit(3);

  return <BlogPostClient post={post} relatedPosts={related || []} />;
}
