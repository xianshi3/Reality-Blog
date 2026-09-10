// 从环境变量动态读取 Supabase 域名，避免硬编码，方便 fork 与多环境部署
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHost = "";
if (supabaseUrl) {
  try {
    supabaseHost = new URL(supabaseUrl).hostname;
  } catch {
    supabaseHost = "";
  }
}

const nextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
