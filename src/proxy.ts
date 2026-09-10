import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();

  // 仅在访问后台/登录页时才做鉴权，避免对公开页面发起不必要的网络请求
  const pathname = req.nextUrl.pathname;
  const needsAuth = pathname.startsWith('/admin') || pathname === '/login';
  if (!needsAuth) return res;

  const cookieStore = {
    getAll() {
      return req.cookies.getAll().map(({ name, value }) => ({ name, value }));
    },
    setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
      for (const { name, value, options } of cookiesToSet) {
        res.cookies.set(name, value, options);
      }
    },
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    return res;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookieEncoding: 'base64url',
    cookies: cookieStore,
  });

  // 使用 getUser() 向 Supabase 服务器验证 JWT 签名，邮箱信息可信
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // 若配置了 ADMIN_EMAIL，仅该邮箱可访问后台（防止其他注册用户越权）
  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin = !!user && !error && (!adminEmail || user.email === adminEmail);

  // 未登录访问后台 → 跳转登录页
  if (!isAdmin && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 已登录访问登录页 → 跳转后台
  if (isAdmin && pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    // 匹配所有路径，排除 API、Next 内部资源与静态文件
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|gif|css|js|txt|xml|webmanifest|woff2?)$).*)',
  ],
};
