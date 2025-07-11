import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabaseServer";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const supabase = await createServerSupabase();

  const { data: article, error } = await supabase
    .from("articles")
    .select("likes")
    .eq("id", id)
    .single();

  if (error || !article) {
    return NextResponse.json({ error: "文章未找到" }, { status: 404 });
  }

  return NextResponse.json({ likes: article.likes ?? 0 });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const supabase = await createServerSupabase();

  const { data: article, error: fetchError } = await supabase
    .from("articles")
    .select("likes")
    .eq("id", id)
    .single();

  if (fetchError || !article) {
    return NextResponse.json({ error: "文章未找到" }, { status: 404 });
  }

  const newLikes = (article.likes ?? 0) + 1;

  const { error: updateError } = await supabase
    .from("articles")
    .update({ likes: newLikes })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "更新点赞失败" }, { status: 500 });
  }

  return NextResponse.json({ likes: newLikes });
}
