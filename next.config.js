/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'https://en.jiipe.com/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

