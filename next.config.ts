/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/adapter-pg'],
  },
  // Prisma Turbopack fix
  transpilePackages: ['@prisma/client'],
};

module.exports = nextConfig;
