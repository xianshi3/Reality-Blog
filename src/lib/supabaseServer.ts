import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookieEncoding: 'base64url',
    cookies: {
      getAll() {
        return cookieStore.getAll().map(cookie => ({
          name: cookie.name,
          value: cookie.value,
        }));
      },
      setAll(_cookiesToSet: { name: string; value: string; options?: any }[]) {
        // SSR 环境无法设置 cookie，这里留空即可
      },
    },
  });
}