import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vibz.s3.eu-central-1.amazonaws.com',
        port: '',
        pathname: '/logo/**',
      },
       {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/public/**',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
