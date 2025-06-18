/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@gdevelopers/ui"],
  experimental: {
    serverActions: true,
    typedRoutes: true,
  },
  images: {
    domains: ["images.unsplash.com"],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig; 