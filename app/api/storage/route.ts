import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabaseServer';

export async function DELETE(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const { name } = await req.json();

    const { error } = await supabase.storage
      .from('article-images')
      .remove([name]);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
