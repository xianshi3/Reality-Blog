import { supabase } from "../../../lib/supabaseClient";
import type { Article } from "../../../types/article";
import Footer from "../../../components/Footer";
import LikeButton from "../../../components/LikeButton";
import ReadingProgress from "../../../components/ReadingProgress";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-red-100 text-red-700 p-6 rounded shadow animate-fadeInUp">
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 relative">
      {/* 阅读进度条 */}
      <ReadingProgress />

      {/* 返回首页按钮 */}
      <a
        href="/"
        className="fixed top-6 left-6 z-50 bg-white/90 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full shadow px-4 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition backdrop-blur-md"
        aria-label="返回首页"
      >
        <span className="text-lg">←</span>
        <span className="font-medium text-base">返回首页</span>
      </a>

      {/* 文章正文区域 */}
      <main className="flex-1 flex justify-center items-start py-20 px-6">
        <article
          className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-10
            border border-gray-200 dark:border-gray-700
            transition-transform duration-200 hover:scale-[1.02] hover:shadow-2xl"
        >
          {/* 标题 */}
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-8 text-gray-900 dark:text-white">
            {article.title}
          </h1>

          {/* 文章元信息 */}
          <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-8 gap-3">
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.category}</span>
          </div>

          {/* 摘要 */}
          {article.summary && (
            <div className="mb-10 text-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl px-6 py-6 leading-relaxed">
              {article.summary}
            </div>
          )}

          {/* 正文内容 */}
          <div className="prose prose-lg prose-blue dark:prose-invert max-w-none mb-12">
            {article.content}
          </div>

          {/* 标签与点赞 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm px-4 py-1.5 rounded-full font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <LikeButton articleId={article.id} />
            </div>
          </div>
        </article>
      </main>

      {/* 页脚 */}
      <Footer currentYear={currentYear} />
    </div>
  );
}
