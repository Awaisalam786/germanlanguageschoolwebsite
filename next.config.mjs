/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'owczimivgmivvmsqxpko.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Without this, Vercel's serverless bundler can fail to load sharp's
  // native binary at runtime (used by /api/noun-builder/process-images
  // to resize fetched images), causing that route to error out silently.
  serverExternalPackages: ['sharp'],
  // serverExternalPackages alone isn't always enough: Next's output file
  // tracing can still miss sharp's platform-specific native binary
  // (@img/sharp-linux-x64 etc.) when bundling this specific route for
  // Vercel's serverless functions, causing "Failed to load external
  // module sharp..." at runtime. Explicitly include it.
  outputFileTracingIncludes: {
    '/api/noun-builder/process-images': ['node_modules/sharp/**/*', 'node_modules/@img/**/*'],
  },
};

export default nextConfig;
