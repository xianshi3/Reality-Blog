import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { access_token, refresh_token } = await req.json();

  // 设置 Supabase 服务端会话
  await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  return NextResponse.json({ message: 'Cookie 设置成功' });
}
