import { supabase } from '../../../src/lib/supabaseClient';
import BlogPostClient from '../../../src/views/BlogPost';
import SchemaMarkup from '../../../src/components/SchemaMarkup';
import { notFound } from 'next/navigation';
import { normalizeBlogContentHeadings } from '../../../src/lib/blogContent';
import { DEFAULT_OG_IMAGE, ORGANIZATION_REF, SITE_NAME } from '../../../src/lib/seo';

export const revalidate = 60; // Revalidate cache every 60 seconds

const isTeamAuthor = (author) => {
  const name = (author || '').trim();
  return !name || name === `${SITE_NAME} Team`;
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { data } = await supabase.from('blog_posts').select('*').eq('slug', resolvedParams.slug).single();
  if (!data) return { title: 'Post Not Found' };
  
  const title = data.meta_title || data.title;
  const description = data.meta_description || data.summary;
  const url = `https://germanlearningschool.com/blog/${resolvedParams.slug}`;
  const images = data.image ? [data.image] : [DEFAULT_OG_IMAGE];
  
  return {
    title: {
      absolute: `${title} | German Learning School`,
    },
    description,
    alternates: {
      canonical: `/blog/${resolvedParams.slug}`,
    },
    openGraph: {
      title: `${title} | German Learning School`,
      description,
      url,
      siteName: 'German Learning School',
      locale: 'en_PK',
      type: 'article',
      publishedTime: data.created_at,
      authors: [data.author || 'German Learning School Team'],
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | German Learning School`,
      description,
      images,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const { data: post } = await supabase.from('blog_posts').select('*').eq('slug', resolvedParams.slug).single();
  
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

  // If less than 3 in same category, backfill with recent published posts
  let relatedPosts = related || [];
  if (relatedPosts.length < 3) {
    const { data: fallbackPosts } = await supabase.from('blog_posts')
      .select('*')
      .eq('status', 'Published')
      .neq('id', post.id)
      .order('created_at', { ascending: false })
      .limit(3 - relatedPosts.length);
      
    if (fallbackPosts) {
      relatedPosts = [...relatedPosts, ...fallbackPosts];
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://germanlearningschool.com/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://germanlearningschool.com/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://germanlearningschool.com/blog/${post.slug}` }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.meta_description || post.summary,
    "image": post.image ? [post.image] : [],
    "datePublished": post.created_at,
    "dateModified": post.created_at,
    // "German Learning School Team" (the default byline) is the school itself,
    // not a person, so it points at the Organization entity.
    "author": isTeamAuthor(post.author)
      ? ORGANIZATION_REF
      : { "@type": "Person", "name": post.author.trim() },
    "publisher": {
      ...ORGANIZATION_REF,
      "logo": {
        "@type": "ImageObject",
        "url": "https://germanlearningschool.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://germanlearningschool.com/blog/${post.slug}`
    }
  };

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={articleSchema} />
      <BlogPostClient
        post={{ ...post, content: normalizeBlogContentHeadings(post.content) }}
        relatedPosts={relatedPosts}
      />
    </>
  );
}
