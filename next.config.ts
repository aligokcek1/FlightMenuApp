import type { Configuration as WebpackConfig } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config: WebpackConfig) => {
    return config;
  },
};

export default nextConfig;
