/** @type {import('next').NextConfig} */
const nextConfig = {
  // No output:'export' — Vercel runs Next.js natively (SSR + static hybrid)
  reactStrictMode: true,
  images: {
    domains: [],
  },
};
export default nextConfig;
