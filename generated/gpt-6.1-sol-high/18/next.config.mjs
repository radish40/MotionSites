/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/motionsites-results/18',
  trailingSlash: true,
  poweredByHeader: false,
  experimental: { cpus: 2 },
};
export default nextConfig;
