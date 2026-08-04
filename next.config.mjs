/** @type {import('next').NextConfig} */
const nextConfig = {
  // No output:'export' — Vercel runs Next.js natively (SSR + static hybrid)
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ivjiedgkpdhuejhoiulx.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
export default nextConfig;
