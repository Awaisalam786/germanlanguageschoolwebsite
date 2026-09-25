// Server-side check: does an admin-managed listing page (/teachers, /gallery,
// /books, /testimonials) have at least one genuine, publicly rendered record?
//
// Used by those routes' generateMetadata (noindex while empty) and by
// app/sitemap.js (URL left out while empty). Both re-run on the routes'
// existing ISR revalidation, so a page becomes indexable and returns to the
// sitemap on its own once real content is added in Admin — no deploy needed.
//
// "Genuine" uses the same rules as the public UI:
// - teachers: rows minus the seed sample names (withoutSampleTeachers)
// - testimonials: rows minus the seed sample ids (withoutSampleTestimonials)
// - gallery: rows with an image url (the page renders item.url)
// - books: any row (the page renders every row; there is no seed data)
import { supabase } from './supabaseClient';
import { withoutSampleTeachers, withoutSampleTestimonials } from './sampleContent';

const CHECKS = {
  '/teachers': async () => {
    const { data, error } = await supabase.from('teachers').select('id, name');
    if (error) throw error;
    return withoutSampleTeachers(data).length > 0;
  },
  '/testimonials': async () => {
    const { data, error } = await supabase.from('testimonials').select('id');
    if (error) throw error;
    return withoutSampleTestimonials(data).length > 0;
  },
  '/gallery': async () => {
    const { data, error } = await supabase.from('gallery').select('id, url');
    if (error) throw error;
    return (data || []).some((item) => Boolean(item?.url));
  },
  '/books': async () => {
    const { data, error } = await supabase.from('books').select('id');
    if (error) throw error;
    return (data || []).length > 0;
  },
};

export const CONTENT_GATED_ROUTES = Object.keys(CHECKS);

// true = genuine content, false = confirmed empty, null = could not check.
// On null callers keep the previous behaviour (indexable, in the sitemap), so
// a temporary Supabase error never de-indexes a page that has content.
export async function hasGenuineContent(route) {
  try {
    return await CHECKS[route]();
  } catch (error) {
    console.error(`Content check failed for ${route}:`, error?.message || error);
    return null;
  }
}

// Adds robots noindex,follow only when the page is confirmed empty. Every
// other field (title, description, canonical, Open Graph, Twitter) is passed
// through unchanged.
export async function withEmptyPageNoindex(route, metadata) {
  const hasContent = await hasGenuineContent(route);
  if (hasContent !== false) return metadata;
  return { ...metadata, robots: { index: false, follow: true } };
}
