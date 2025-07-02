import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = await cookies(); // 这里加 await

  // 创建响应对象，后续写 cookie
  const response = NextResponse.json({ message: 'Cookie 设置成功' });

  const cookiesWrapper = {
    getAll() {
      return cookieStore.getAll().map(({ name, value }: { name: string; value: string }) => ({ name, value }));
    },
    setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
      for (const { name, value, options } of cookiesToSet) {
        response.cookies.set(name, value, options);
      }
    },
  };

  const { access_token, refresh_token } = await req.json();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookieEncoding: 'base64url',
    cookies: cookiesWrapper,
  });

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data.session) return NextResponse.json({ error: 'Session is missing' }, { status: 400 });

  // 这里不再手动 set cookie，交由 supabase 的 setAll 实现
  return response;
}