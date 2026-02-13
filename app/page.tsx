import { headers } from 'next/headers';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import MainContent from '@/components/MainContent';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';
import AIChat from '@/components/AIChat';
import ErrorDisplay from '@/components/ErrorDisplay';
import { createServerSupabase } from '@/lib/supabaseServer';
import type { Article } from '@/types/article';

// 每页显示的文章数量
const PAGE_SIZE = 4;

/**
 * 博客首页组件（SSR）
 * 加载指定页码的文章数据，并渲染完整页面结构
 */
export default async function Home() {
  // 从请求头中获取完整 URL（用于获取 query 参数）
  const headersList = await headers();
  const fullUrl = headersList.get('x-url') || 'http://localhost/';
  const url = new URL(fullUrl);
  const pageParam = url.searchParams.get('page');

  // 当前页码，默认为第1页
  const page = parseInt(pageParam ?? '1', 10);

  // Supabase 查询文章的起止索引
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // 创建服务端 Supabase 客户端
  const supabase = await createServerSupabase();

  // 从 Supabase 拉取文章数据（按时间降序）
  const { data: articlesRaw, error, status, count } = await supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .order('date', { ascending: false })
    .range(from, to);

  // 错误处理：返回错误组件
  if (error) {
    return <ErrorDisplay status={status} message={error.message} />;
  }

  // 格式化文章数据，附加链接
  const articles: Article[] = (articlesRaw ?? []).map((item) => ({
    ...item,
    link: `/article/${item.id}`,
  }));

  // 计算总页数
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  // 渲染完整页面结构
  return (
    <div className="home-container pt-14 bg-gray-100">
      {/* 顶部导航栏 */}
      <Header />

      {/* 主体区域：左侧栏 + 文章内容 + 右侧栏 */}
      <main className="container-home">
        <LeftSidebar className="w-60 flex-shrink-0" articles={articles} />
        <MainContent
          className="flex-1 min-w-0"
          articles={articles}
          currentPage={page}
          totalPages={totalPages}
        />
        <RightSidebar
          className="w-60 flex-shrink-0"
          articles={articles}
        />
      </main>

      {/* 底部固定 AI 聊天组件 */}
      <div className="fixed bottom-4 left-4 right-4 sm:right-auto z-50 max-w-[350px] w-full sm:w-[350px]">
        <AIChat />
      </div>

      {/* 页面底部 Footer */}
      <Footer currentYear={new Date().getFullYear()} />
    </div>
  );
}
