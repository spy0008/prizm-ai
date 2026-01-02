/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false,  
  },
  transpilePackages: ['@prisma/client'],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;
