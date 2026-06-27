/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Supabase Storage public bucket (replace project ref via env when deploying)
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
      // Placeholder photography used in seed data — swap for your own photos in production
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  experimental: {
    // Smaller client bundles for these icon/animation libs
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
