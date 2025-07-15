import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import MainContent from "@/components/MainContent";
import RightSidebar from "@/components/RightSidebar";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";

import { createServerSupabase } from "@/lib/supabaseServer";
import ErrorDisplay from "@/components/ErrorDisplay";
import { TAGS, RECOMMENDED_ARTICLES } from "@/constants/sidebar";

import type { Article } from "@/types/article";

export default async function Home() {
  // 获取 Supabase 客户端
  const supabase = await createServerSupabase();

  // 获取文章数据
  const { data: articlesRaw, error, status } = await supabase
    .from("articles")
    .select("*")
    .order("date", { ascending: false });

  // 出错时显示错误信息
  if (error) {
    return <ErrorDisplay status={status} message={error.message} />;
  }

  // 处理文章数据，添加跳转链接
  const articles: Article[] = (articlesRaw ?? []).map((item) => ({
    ...item,
    link: `/article/${item.id}`,
  }));

  const currentYear = new Date().getFullYear();

  return (
    <div className="home-container pt-14 bg-gray-100">
      <Header />

      {/* 三栏布局 */}
      <main className="container mx-auto flex flex-col lg:flex-row w-full max-w-6xl px-3 gap-6 py-10">
        <LeftSidebar className="w-60 flex-shrink-0" articles={articles} />
        <MainContent className="flex-1 min-w-0" articles={articles} />
        <RightSidebar className="w-60 flex-shrink-0" tags={TAGS} recommends={RECOMMENDED_ARTICLES} />
      </main>

      {/* AI 聊天组件 */}
      <div className="fixed bottom-4 left-4 z-50 w-[350px] max-w-[90vw] pointer-events-auto">
        <AIChat />
      </div>

      <Footer currentYear={currentYear} />
    </div>
  );
}
