import { NextResponse } from "next/server";
import { createServerSupabase, createServerSupabaseAdmin } from "@/lib/supabaseServer";

// GET 方法：从 URL 解析 id
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").at(-2); // 获取路径中的 [id]

  if (!id) {
    return NextResponse.json({ error: "缺少文章 ID" }, { status: 400 });
  }

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

// POST 方法：解构 context 里的 params
// 优先使用数据库 RPC（increment_likes，SECURITY DEFINER）原子自增，
// 避免读改写竞态，同时允许匿名访客点赞；
// 若数据库尚未执行新增 SQL，则回退到旧的读改写方式。
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const supabase = await createServerSupabase();

  const { data: rpcLikes, error: rpcError } = await supabase.rpc(
    "increment_likes",
    { article_id: id }
  );

  if (rpcError) {
    const admin = createServerSupabaseAdmin();
    const { data: article, error: fetchError } = await admin
      .from("articles")
      .select("likes")
      .eq("id", id)
      .single();

    if (fetchError || !article) {
      return NextResponse.json({ error: "文章未找到" }, { status: 404 });
    }

    const newLikes = (article.likes ?? 0) + 1;

    const { error: updateError } = await admin
      .from("articles")
      .update({ likes: newLikes })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { error: "更新点赞失败，请确认已执行 schema.sql 中的 increment_likes 函数" },
        { status: 500 }
      );
    }

    return NextResponse.json({ likes: newLikes });
  }

  return NextResponse.json({ likes: rpcLikes });
}
