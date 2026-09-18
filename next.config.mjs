/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Without this, Vercel's serverless bundler can fail to load sharp's
  // native binary at runtime (used by /api/noun-builder/process-images
  // to resize fetched images), causing that route to error out silently.
  serverExternalPackages: ['sharp'],
};

export default nextConfig;
