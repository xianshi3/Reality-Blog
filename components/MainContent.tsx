import type { Article } from '../types/article';

export default function MainContent({ articles }: { articles: Article[] }) {
  return (
    <main className="space-y-8">
      {/* 最新文章区域 */}
      <section>
        <h2 className="section-title">📝 最新文章</h2>
        <ul className="space-y-8">
          {articles.map((article, idx) => (
            <li key={article.link ?? idx}>
              <article className="article-item">
                <a href={article.link} className="article-link" tabIndex={0}>
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-meta">
                    {article.date
                      ? new Date(article.date).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '未知日期'}{' '}
                    · {article.category}
                  </p>
                  <p className="article-summary">{article.summary}</p>
                </a>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* 关于我区域 */}
      <aside className="article-section about-section max-w-xl mx-auto">
        <h2>👤 关于我</h2>
        <div className="about-card">
          <div className="about-author">
            <div className="emoji" aria-label="程序员emoji" role="img">
              🧑‍💻
            </div>
            <div className="about-name">
              <p className="name">Reality</p>
              <p className="role">全栈开发者 · 技术爱好者</p>
            </div>
          </div>
          <p className="about-description">
            👋 你好，我是 Reality，一名热爱技术与生活的开发者，喜欢构建有趣的产品与工具。
            本博客记录我的开发笔记，欢迎常来看看！
          </p>
        </div>
      </aside>
    </main>
  );
}
