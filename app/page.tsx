import Image from "next/image";

export default function Home() {
  const currentYear = new Date().getFullYear();

  const articles = [
    {
      title: "博客文章标题一",
      date: "2024-06-01",
      category: "技术",
      summary: "这里是一段文章摘要，简要介绍文章内容，吸引读者点击阅读全文。",
      link: "#",
    },
    {
      title: "博客文章标题二",
      date: "2024-05-20",
      category: "生活",
      summary: "这里是一段文章摘要，简要介绍文章内容，吸引读者点击阅读全文。",
      link: "#",
    },
  ];

  const tags = ["JavaScript", "React", "生活", "设计", "全栈", "Tailwind", "Next.js"];
  const recommends = ["深入理解 React", "Vite 与 Webpack 对比", "使用 Tailwind 构建博客"];

  return (
    <div className="home-container">
      {/* 顶部 */}
      <header className="home-header">
        <Image
          className="avatarImg"
          src="/avatar.jpg"
          alt="头像"
          width={96}
          height={96}
          priority
        />
        <h1 className="home-title">Reality</h1>
        <p className="home-description">全栈开发工程师的技术与生活</p>
      </header>

      {/* 内容区域三栏布局 */}
      <main className="flex flex-col lg:flex-row w-full max-w-6xl px-4 gap-6">
        {/* 左侧边栏 */}
        <aside className="lg:w-1/4 w-full space-y-6">
          <div className="article-item">
            <h3 className="article-title">导航</h3>
            <ul className="text-sm">
              <li><a href="#">🏠 首页</a></li>
              <li><a href="#">📚 分类</a></li>
              <li><a href="#">📧 联系我</a></li>
            </ul>
          </div>

          <div className="article-item">
            <h3 className="article-title">公告</h3>
            <p className="text-sm">欢迎来到 Reality 的博客！正在持续更新中~</p>
          </div>
        </aside>

        {/* 主内容区 */}
        <section className="flex-1 space-y-8">
          {/* 最新文章 */}
          <div className="article-section">
            <h2 className="section-title">📝 最新文章</h2>
            <ul className="space-y-6">
              {articles.map((article, idx) => (
                <li className="article-item" key={idx}>
                  <a href={article.link} className="block">
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-meta">{article.date} · {article.category}</p>
                    <p className="article-summary">{article.summary}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 关于我 */}
          <div className="article-section">
            <h2 className="section-title">👤 关于我</h2>
            <p className="about-para">
              👋 你好，我是 Reality，一名热爱技术与生活的全栈开发者。
              喜欢探索现代前端框架与构建简洁、优雅的系统。
            </p>
          </div>
        </section>

        {/* 右侧边栏 */}
        <aside className="lg:w-1/4 w-full space-y-6">
          <div className="article-item">
            <h3 className="article-title">热门标签</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span key={idx} className="bg-gray-200">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="article-item">
            <h3 className="article-title">推荐阅读</h3>
            <ul className="text-sm">
              {recommends.map((title, idx) => (
                <li key={idx}><a href="#" className="hover:underline">📌 {title}</a></li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      {/* 页脚 */}
      <footer className="footer mt-8">
        <div>© {currentYear} Reality-Blog. 保留所有权利.</div>
        <div className="footer-links">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="mailto:your@email.com">Email</a>
        </div>
      </footer>
    </div>
  );
}
