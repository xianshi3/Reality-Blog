import { NextResponse } from "next/server";
import { ZhipuAI } from "zhipuai";
import { createServerSupabase, createServerSupabaseAdmin } from "@/lib/supabaseServer";
import { getClientIp, isRateLimited } from "@/lib/rateLimit";

export const runtime = "nodejs";

const client = new ZhipuAI({
  apiKey: process.env.ZHIPU_API_KEY!,
});

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const MAX_CONTENT_CHARS = 4000;

/** 粗略去除 Markdown 语法，仅保留纯文本用于喂给模型 */
function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/\*([^*]*)\*/g, "$1")
    .replace(/~~([^~]*)~~/g, "$1")
    .replace(/[>#|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const ip = getClientIp(req);
  if (await isRateLimited(`summary:${ip}`, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX)) {
    return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 });
  }

  try {
    // 公开读取文章（RLS 允许匿名 SELECT）；用 * 兼容尚未迁移 ai_summary 列的库
    const supabase = await createServerSupabase();
    const { data: article, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !article) {
      return NextResponse.json({ error: "文章未找到" }, { status: 404 });
    }

    // 命中缓存：直接返回，避免重复调用模型
    if (article.ai_summary) {
      return NextResponse.json({ summary: article.ai_summary, cached: true });
    }

    const text = stripMarkdown(article.content ?? "").slice(0, MAX_CONTENT_CHARS);
    if (!text) {
      return NextResponse.json({ error: "文章内容为空，无法生成" }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "glm-4-flash",
      messages: [
        {
          role: "system",
          content:
            "你是文章摘要助手。请用一句话（不超过 40 个汉字）概括文章核心内容，直接输出摘要本身，不要任何前缀、解释、引号或标点包裹。",
        },
        {
          role: "user",
          content: `标题：${article.title}\n\n正文：\n${text}`,
        },
      ],
    });

    const summary = completion.choices?.[0]?.message?.content?.trim() ?? "";
    if (!summary) {
      return NextResponse.json({ error: "生成失败，请稍后再试" }, { status: 502 });
    }

    // 写回缓存（写操作统一走 service role），失败不阻塞返回
    try {
      const admin = createServerSupabaseAdmin();
      await admin.from("articles").update({ ai_summary: summary }).eq("id", id);
    } catch {
      // 忽略缓存写入失败
    }

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("AI Summary API Error:", err);
    return NextResponse.json({ error: "AI 服务异常，请稍后再试" }, { status: 500 });
  }
}
