/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/',
        permanent: false,
      },
      {
        source: '/admin/dashboard',
        destination: '/',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: '/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
