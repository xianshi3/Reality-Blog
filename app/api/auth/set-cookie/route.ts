import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// 处理 POST 请求，设置 Supabase 的 session 并写入 cookie
export async function POST(req: Request) {
  // 获取请求中的 cookie 存储
  const cookieStore = await cookies();

  // 创建响应对象，用于后续设置 cookie 和返回信息
  const response = NextResponse.json({ message: 'Cookie 设置成功' });

  // 封装 cookie 操作接口，供 Supabase 使用
  const cookiesWrapper = {
    // 获取所有 cookie
    getAll() {
      return cookieStore.getAll().map(({ name, value }: { name: string; value: string }) => ({ name, value }));
    },
    // 批量设置 cookie
    setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
      for (const { name, value, options } of cookiesToSet) {
        response.cookies.set(name, value, options);
      }
    },
  };

  // 从请求体中解析 access_token 和 refresh_token
  const { access_token, refresh_token } = await req.json();

  // 获取 Supabase 配置信息
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // 创建 Supabase 服务端客户端，并绑定 cookie 操作
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookieEncoding: 'base64url', // 指定 cookie 编码方式
    cookies: cookiesWrapper,
  });

  // 设置用户的 Supabase 会话（Session）
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  // 处理错误情况
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data.session) return NextResponse.json({ error: 'Session is missing' }, { status: 400 });

  // 返回设置了 cookie 的响应
  return response;
}
