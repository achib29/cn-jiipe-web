/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: [
      'ik.imagekit.io',
      '64.120.92.54',
    ],
  },
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
