import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    return config;
  },
};

export default config;
