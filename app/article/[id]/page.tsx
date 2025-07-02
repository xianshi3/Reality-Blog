import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Article } from '../../../types/article';
import Footer from '../../../components/Footer';
import LikeButton from '../../../components/LikeButton';
import ReadingProgress from '../../../components/ReadingProgress';

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  const { id } = params;

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

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

  return (
    <div className="min-h-screen flex flex-col article-page-container relative">
      <ReadingProgress />

      <a href="/" className="return-home" aria-label="返回首页">
        <span className="text-lg">←</span>
        <span>返回首页</span>
      </a>

      <main className="article-container">
        <article className="article-content animate-fadeInUp">
          <h1 className="article-title">{article.title}</h1>

          <div className="article-meta">
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.category}</span>
          </div>

          {article.summary && (
            <div className="article-summary">{article.summary}</div>
          )}

          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: article.content ?? '' }}
          ></div>

          <div className="tag-like-container mt-10">
            <div>
              {article.tags &&
                article.tags.length > 0 &&
                article.tags.map((tag) => (
                  <span key={tag} className="tag">
                    #{tag}
                  </span>
                ))}
            </div>

            <LikeButton articleId={article.id} />
          </div>
        </article>
      </main>

      <Footer currentYear={currentYear} />
    </div>
  );
}
