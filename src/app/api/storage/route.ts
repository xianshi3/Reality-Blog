import { NextResponse } from 'next/server';
import { createServerSupabaseAdmin, requireUser } from '@/lib/supabaseServer';

const VALID_NAME_RE = /^[\w.-]+$/;

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: '缺少文件' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !/^(jpg|jpeg|png|webp|gif)$/.test(fileExt)) {
      return NextResponse.json({ error: '不支持的文件类型' }, { status: 400 });
    }

    const fileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${fileExt}`;

    const supabase = createServerSupabaseAdmin();
    const { error } = await supabase.storage
      .from('article-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from('article-images').getPublicUrl(fileName);
    return NextResponse.json({ url: data.publicUrl, name: fileName });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  try {
    const supabase = createServerSupabaseAdmin();
    const { name } = await req.json();

    if (!name || typeof name !== 'string' || !VALID_NAME_RE.test(name)) {
      return NextResponse.json({ error: '无效的文件名' }, { status: 400 });
    }

    const { error } = await supabase.storage
      .from('article-images')
      .remove([name]);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
