import { NextConfig as NextJSNextConfig } from 'next';
import { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
interface WebpackOptions {
  isServer: boolean;
}

interface MyNextConfig extends NextJSNextConfig {
  webpack: (config: Configuration, options: WebpackOptions) => Configuration;
}

const nextConfig: MyNextConfig = {
  webpack: (config: Configuration, { isServer }: WebpackOptions): Configuration => {
    if (!config.resolve) {
      config.resolve = { fallback: { fs: false, net: false, tls: false } };
    } else {
      config.resolve.fallback = { fs: false, net: false, tls: false };
    }
    return config;
  },
};

export default nextConfig;
