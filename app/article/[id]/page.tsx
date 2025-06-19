import { supabase } from "../../../lib/supabaseClient";
import type { Article } from "../../../types/article";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 text-red-700 p-6 rounded shadow animate-fadeInUp" style={{ animation: 'fadeInUp 0.8s' }}>
          <h2 className="font-bold text-lg mb-2">文章未找到</h2>
          <p>{error?.message}</p>
        </div>
      </div>
    );
  }

  const article: Article = {
    ...data,
    link: `/article/${data.id}`,
    tags: data.tags ? data.tags.split(",") : [],
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="home-container pt-16">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <div className="bg-white dark:bg-[#23272f] rounded-xl shadow-lg p-8 animate-fadeInUp" style={{ animation: 'fadeInUp 0.8s' }}>
          <h1 className="article-title text-3xl mb-4 animate-fadeInUp" style={{ animation: 'fadeInUp 1s' }}>
            {article.title}
          </h1>
          <div className="article-meta mb-2">{article.date} · {article.category}</div>
          <div className="article-summary mb-4">{article.summary}</div>
          <article className="prose text-gray-800 dark:text-gray-200 mb-6 animate-fadeInUp" style={{ animation: 'fadeInUp 1.2s' }}>
            {article.content}
          </article>
          {article.tags && article.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-sm mr-2 px-3 py-1 rounded-full animate-scaleUp"
                  style={{ animation: 'scaleUp 0.5s' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer currentYear={currentYear} />
    </div>
  );
}