/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minio.venusoutlet.net',
      },
      {
        protocol: 'https',
        hostname: 'venusoutlet.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-0ec93d8f963a428d9a4f4be7e7f9494f.r2.dev',
      },
    ],
  },
};

export default nextConfig;
