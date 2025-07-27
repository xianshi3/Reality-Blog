import { headers } from 'next/headers';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import MainContent from '@/components/MainContent';
import RightSidebar from '@/components/RightSidebar';
import Footer from '@/components/Footer';
import AIChat from '@/components/AIChat';
import ErrorDisplay from '@/components/ErrorDisplay';
import { TAGS, RECOMMENDED_ARTICLES } from '@/constants/sidebar';
import { createServerSupabase } from '@/lib/supabaseServer';
import type { Article } from '@/types/article';

const PAGE_SIZE = 5;

export default async function Home() {
  // 从 headers 获取完整请求 URL，解析 query 参数
  const headersList = await headers();
  const fullUrl = headersList.get('x-url') || 'http://localhost/';
  const url = new URL(fullUrl);
  const pageParam = url.searchParams.get('page');

  const page = parseInt(pageParam ?? '1', 10);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createServerSupabase();

  const { data: articlesRaw, error, status, count } = await supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .order('date', { ascending: false })
    .range(from, to);

  if (error) {
    return <ErrorDisplay status={status} message={error.message} />;
  }

  const articles: Article[] = (articlesRaw ?? []).map((item) => ({
    ...item,
    link: `/article/${item.id}`,
  }));

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div className="home-container pt-14 bg-gray-100">
      <Header />
      <main className="container mx-auto flex flex-col lg:flex-row w-full max-w-6xl px-3 gap-6 py-10">
        <LeftSidebar className="w-60 flex-shrink-0" articles={articles} />
        <MainContent
          className="flex-1 min-w-0"
          articles={articles}
          currentPage={page}
          totalPages={totalPages}
        />
        <RightSidebar
          className="w-60 flex-shrink-0"
          tags={TAGS}
          recommends={RECOMMENDED_ARTICLES}
        />
      </main>
      <div className="fixed bottom-4 left-4 z-50 w-[350px] max-w-[90vw] pointer-events-auto">
        <AIChat />
      </div>
      <Footer currentYear={new Date().getFullYear()} />
    </div>
  );
}
