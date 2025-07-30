const nextConfig = {
  experimental: {
    serverActions: {
      // 这里可以根据需要配置，比如请求体大小限制等，也可以留空
      // 例子：
      // bodySizeLimit: "1mb",
      // allowedOrigins: ["https://example.com"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ivkxjxonuvzrarjxtnhk.supabase.co",  // 你的 Supabase 域名
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
