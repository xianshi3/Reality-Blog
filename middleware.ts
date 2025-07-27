import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 注入完整请求 URL 到 headers，供 Server Component 获取 searchParams
  res.headers.set('x-url', req.url);

  // Supabase 认证相关代码
  const cookieStore = {
    getAll() {
      return req.cookies.getAll().map(({ name, value }) => ({ name, value }));
    },
    setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
      for (const { name, value, options } of cookiesToSet) {
        res.cookies.set(name, value, options);
      }
    },
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookieEncoding: 'base64url',
    cookies: cookieStore,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/', '/admin/:path*'],
};
