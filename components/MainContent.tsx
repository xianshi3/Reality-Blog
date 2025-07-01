/**
 * 主内容区组件
 * 
 * @module MainContent
 */

import type { Article } from '../types/article';

/**
 * MainContent 组件
 * @param articles - 文章数组
 */
export default function MainContent({ articles }: { articles: Article[] }) {
  return (
    <section className="flex-1 space-y-8">
      {/* 最新文章区域 */}
      <div className="article-section">
        <h2 className="section-title">📝 最新文章</h2>
        <ul className="space-y-6">
          {articles.map((article, idx) => (
            <li className="article-item" key={article.link || idx}>
              <a href={article.link} className="block rounded p-4 transition">
                <h3 className="article-title font-bold text-lg">{article.title}</h3>
                <p className="article-meta text-gray-500 text-sm">
                  {article.date} · {article.category}
                </p>
                <p className="article-summary text-gray-700">{article.summary}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* 测试文章列表
      <div>
        <ArticleList />
      </div> */}

      {/* 关于我区域 */}
      <div className="article-section">
        <h2 className="section-title">👤 关于我</h2>
        <p className="about-para">
          👋 你好，我是 Reality，一名热爱技术与生活的全栈开发者。
        </p>
      </div>
    </section>
  );
}