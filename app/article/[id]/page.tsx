import type { Article } from '../../../types/article';
import Footer from '../../../components/Footer';
import LikeButton from '../../../components/LikeButton';
import ReadingProgress from '../../../components/ReadingProgress';
import { createServerSupabase } from '../../../lib/supabaseServer';
import ArticleContent from '@/components/ArticleContent';
import ArticleToc from '@/components/ArticleToc';
import AIChat from '../../../components/AIChat';
import ReturnHome from '../../../components/ReturnHome';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen home-container">
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
    tags: data.tags ? data.tags.split(',') : [],
  };

  const currentYear = new Date().getFullYear();
  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '未知日期';

  return (
    <div className="article-page-container">
      <ReadingProgress />
      <ReturnHome />

      <div className="article-container">
        <main className="article-page-main">
          <article className="article-content">
            <h1 className="article-page-title">{article.title}</h1>

            <div className="article-page-meta">
              <span>{formattedDate}</span>
              <span>·</span>
              <span>{article.category}</span>
            </div>

            {article.summary && <div className="article-page-summary">{article.summary}</div>}

            <ArticleContent content={article.content ?? ''} />

            <div className="tag-like-container">
              <div className="tag-list">
                {article.tags?.map((tag) => (
                  <span key={tag} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>

              <LikeButton articleId={article.id} initialLikes={article.likes ?? 0} />
            </div>
          </article>
        </main>
      </div>

      <aside className="article-toc">
        <ArticleToc />
      </aside>

      <div className="fixed-ai-chat">
        <AIChat />
      </div>

      <Footer currentYear={currentYear} />
    </div>
  );
}
