import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/motionsites-results/travel-hero',
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
