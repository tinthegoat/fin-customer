/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
    basePath: '/stock',
  },
};

export default nextConfig;
