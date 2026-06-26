/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,   // required for static export (no image server)
  },
};
export default nextConfig;
