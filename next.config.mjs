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
    ],
  },
};

export default nextConfig;
