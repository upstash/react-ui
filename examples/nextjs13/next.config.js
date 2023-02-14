/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["@upstash/react-ui"],
};

module.exports = nextConfig;
