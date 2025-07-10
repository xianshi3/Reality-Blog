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
        <div className="about-card">
          <div className="about-author">
            <div className="emoji">🧑‍💻</div>
            <div className="about-name">
              <p className="name">Reality</p>
              <p className="role">全栈开发者 · 技术爱好者</p>
            </div>
          </div>
          <p className="about-description">
            👋 你好，我是 Reality，一名热爱技术与生活的开发者，喜欢构建有趣的产品与工具。
            本博客记录我的开发笔记、AI 尝试与一些碎碎念，欢迎常来看看！
          </p>
        </div>
      </div>

    </section>
  );
}