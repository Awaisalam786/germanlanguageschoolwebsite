// Shared Open Graph helper for App Router metadata.
//
// Why this exists: Next.js does not deep-merge `openGraph` between a layout
// and its children. A route that defines no `openGraph` of its own inherits
// the parent's object unchanged, which is how inner pages used to end up
// with og:url pointing at the homepage. Wrapping a route's metadata with
// `withPageOpenGraph` gives it its own Open Graph block whose URL is derived
// from the route's canonical URL (single source of truth), and whose
// title/description mirror the route's existing <title> and meta description.
//
// Default share image: app/opengraph-image.png (App Router file convention).
// Next.js only applies that file automatically to routes that do not define
// their own `openGraph` object, so routes that do (every route wrapped here)
// reference the same generated file explicitly. A route can still pass its
// own `openGraph.images` to override it.

export const SITE_NAME = 'German Learning School';

export const DEFAULT_OG_IMAGE = {
  url: '/opengraph-image.png',
  width: 1200,
  height: 630,
  alt: 'German Learning School – Learn German Online in Pakistan (A1–B2, Goethe, ÖSD, telc, TestDaF)',
};

// Must stay in sync with `title.template` in app/layout.jsx.
const TITLE_TEMPLATE = (title) => `${title} | ${SITE_NAME}`;

function resolveTitle(title) {
  if (!title) return undefined;
  if (typeof title === 'string') return TITLE_TEMPLATE(title);
  return title.absolute ?? (title.default ? title.default : undefined);
}

// Also builds the route's Twitter card for the same reason: `twitter` is not
// deep-merged either, so routes without their own block inherited the
// homepage's twitter:title/description from app/layout.jsx.
export function withPageOpenGraph(metadata) {
  const canonical = metadata?.alternates?.canonical;
  if (!canonical) {
    throw new Error('withPageOpenGraph: metadata.alternates.canonical is required to derive og:url');
  }

  const title = resolveTitle(metadata.title);
  const { description } = metadata;

  return {
    ...metadata,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
      ...metadata.twitter,
    },
    openGraph: {
      title,
      description,
      // Relative canonicals are resolved against metadataBase (app/layout.jsx),
      // so og:url always matches the page's canonical URL.
      url: canonical,
      siteName: SITE_NAME,
      locale: 'en_PK',
      type: 'website',
      images: [DEFAULT_OG_IMAGE],
      ...metadata.openGraph,
    },
  };
}
