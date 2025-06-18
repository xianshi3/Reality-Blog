'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Article {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
}

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * 从 Supabase 的 'articles' 表中获取文章列表，按日期降序排列
     * 如果获取成功则更新 articles 状态，否则设置错误信息
     * 适当处理加载状态和错误状态
     * @async
     * @function fetchArticles
     * @returns {Promise<void>} 获取操作完成时返回
     */
    async function fetchArticles() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, summary, date, category')
          .order('date', { ascending: false });
        if (error) {
          setError(error.message);
        } else {
          setArticles(data ?? []);
        }
      } catch (err: any) {
        setError(err.message || '未知错误');
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div className="text-red-500">加载失败：{error}</div>;
  if (articles.length === 0) return <div className="text-gray-500">暂无文章</div>;

  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {articles.map(article => (
        <li key={article.id} className="article-item">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">{article.category}</span>
              <span className="text-gray-400 text-xs">{new Date(article.date).toLocaleDateString()}</span>
            </div>
            <h2 className="article-title">{article.title}</h2>
            <p className="article-meta">
              {new Date(article.date).toLocaleDateString()} · {article.category}
            </p>
            <p className="article-summary">{article.summary}</p>
          </div>
          <div className="mt-auto flex justify-end">
            <a
              href={`/article/${article.id}`}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              阅读详情 &rarr;
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}