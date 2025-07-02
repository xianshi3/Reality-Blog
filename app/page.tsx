/**
 * 博客首页
 * 展示文章列表、侧边栏、推荐、标签、AI 对话等功能。
 * 
 * 使用服务端 Supabase 客户端，通过 cookies 传递鉴权信息，保证 SSR 和中间件的会话识别。
 */

import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import MainContent from "../components/MainContent";
import RightSidebar from "../components/RightSidebar";
import Footer from "../components/Footer";
import AIChat from "../components/AIChat";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import type { Article } from "../types/article";

export default async function Home() {
  // 在服务端组件中通过 cookies 创建 Supabase 客户端实例
  const supabase = createServerComponentClient({ cookies });

  // 从 Supabase 查询文章表，按时间倒序排序
  const { data: articlesRaw, error, status } = await supabase
    .from("articles")
    .select("*")
    .order("date", { ascending: false });

  // 数据获取失败时，返回错误提示页面
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 text-red-700 p-6 rounded shadow">
          <h2 className="font-bold text-lg mb-2">数据获取失败</h2>
          <p>状态码：{status}</p>
          <p>错误信息：{error.message}</p>
        </div>
      </div>
    );
  }

  // 格式化文章数据，生成访问链接
  const articles: Article[] = (articlesRaw ?? []).map((item) => ({
    ...item,
    link: `/article/${item.id}`,
  }));

  // 当前年份，用于页脚显示
  const currentYear = new Date().getFullYear();

  // 侧边栏标签和推荐内容
  const tags = [
    ".NET",
    "Java",
    "Vue",
    "JavaScript",
    "React",
    "Tailwind",
    "Next.js",
  ];
  const recommends = [
    "测试  深入理解 React",
    "测试  Vite 与 Webpack 对比",
    "测试  使用 Tailwind 构建博客",
  ];

  // 渲染首页布局，包含头部、主体、侧边栏、AI 聊天和页脚
  return (
    <div className="home-container pt-16 bg-gray-100 min-h-screen">
      {/* 页面头部导航 */}
      <Header />
      {/* 主要内容区：左侧边栏、主内容、右侧边栏 */}
      <main className="container mx-auto flex flex-col lg:flex-row w-full max-w-6xl px-4 gap-6 py-8">
        <LeftSidebar articles={articles} />
        <MainContent articles={articles} />
        <RightSidebar tags={tags} recommends={recommends} />
      </main>
      {/* AI 聊天窗口固定左下角 */}
      <div className="fixed bottom-4 left-4 z-50 w-[350px] max-w-[90vw] pointer-events-auto">
        <AIChat />
      </div>
      {/* 页脚，显示当前年份 */}
      <Footer currentYear={currentYear} />
    </div>
  );
}
