/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Product images are served from the WordPress uploads folder (with or without www).
    remotePatterns: ['aliandabi.com', 'www.aliandabi.com'].map((hostname) => ({
      protocol: 'https',
      hostname,
      pathname: '/wp-content/uploads/**',
    })),
  },
};

export default nextConfig;
