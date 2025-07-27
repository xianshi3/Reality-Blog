"use client";

import { useEffect, useState } from "react";
import type { Article } from "../types/article";

interface MainContentProps {
  articles: Article[];
  className?: string;
  currentPage?: number;
  totalPages?: number;
}

export default function MainContent({
  articles,
  className,
  currentPage = 1,
  totalPages = 1,
}: MainContentProps) {
  // 动画状态管理，记录当前显示页码和动画阶段
  const [displayPage, setDisplayPage] = useState(currentPage);
  const [transitionStage, setTransitionStage] = useState<"enter" | "exit">("enter");

  // 当父组件的 currentPage 变更时，触发动画切换
  useEffect(() => {
    if (currentPage === displayPage) return;

    setTransitionStage("exit");

    const timeout = setTimeout(() => {
      setDisplayPage(currentPage);
      setTransitionStage("enter");
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentPage, displayPage]);

  // 按年份分组文章
  const groupedArticles = articles.reduce((acc, article) => {
    const year = new Date(article.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(article);
    return acc;
  }, {} as Record<number, Article[]>);

  const years = Object.keys(groupedArticles)
    .map(Number)
    .sort((a, b) => b - a);

  // 生成页码，最多5个，当前页居中
  function getPageNumbers() {
    const delta = 2;
    let start = Math.max(1, displayPage - delta);
    let end = Math.min(totalPages, displayPage + delta);

    if (end - start < 4) {
      if (start === 1) end = Math.min(totalPages, start + 4);
      else if (end === totalPages) start = Math.max(1, end - 4);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  const pageNumbers = getPageNumbers();

  // 自定义分页点击处理，阻止默认跳转，先平滑滚动到顶部，再更新页码
  function onPageClick(e: React.MouseEvent, page: number) {
    e.preventDefault();
    if (page === currentPage) return;

    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      // 这里假设父组件通过 URL 或状态控制页码
      // 你可以改成 router.push(`/?page=${page}`) 或调用父组件回调
      window.location.href = `/?page=${page}`;
    }, 350);
  }

  return (
    <main className={`space-y-8 ${className ?? ""}`}>
      <div
        key={displayPage}
        className={
          transitionStage === "enter"
            ? "page-transition-enter-active"
            : "page-transition-exit-active"
        }
      >
        {years.map((year) => (
          <section key={year}>
            <h2 className="section-title text-gray-800 dark:text-gray-100 font-semibold text-xl mt-6">
              📅 {year} 年文章
            </h2>
            <ul className="space-y-8">
              {groupedArticles[year].map((article) => (
                <li key={article.link}>
                  <article className="article-item">
                    <a href={article.link} className="article-link" tabIndex={0}>
                      <h3 className="article-title">{article.title}</h3>
                      <p className="article-meta">
                        {article.date
                          ? new Date(article.date).toLocaleDateString("zh-CN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "未知日期"}{" "}
                        · {article.category}
                      </p>
                      <p className="article-summary">{article.summary}</p>
                    </a>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <nav aria-label="分页导航" className="pagination">
        {/* 上一页 */}
        <a
          href={`/?page=${Math.max(1, currentPage - 1)}`}
          className={currentPage === 1 ? "disabled" : ""}
          aria-disabled={currentPage === 1}
          tabIndex={currentPage === 1 ? -1 : 0}
          onClick={(e) => onPageClick(e, Math.max(1, currentPage - 1))}
        >
          上一页
        </a>

        {/* 数字页码 */}
        {pageNumbers.map((pageNum) => (
          <a
            key={pageNum}
            href={`/?page=${pageNum}`}
            className={pageNum === currentPage ? "active" : ""}
            aria-current={pageNum === currentPage ? "page" : undefined}
            onClick={(e) => onPageClick(e, pageNum)}
          >
            {pageNum}
          </a>
        ))}

        {/* 下一页 */}
        <a
          href={`/?page=${Math.min(totalPages, currentPage + 1)}`}
          className={currentPage === totalPages ? "disabled" : ""}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : 0}
          onClick={(e) => onPageClick(e, Math.min(totalPages, currentPage + 1))}
        >
          下一页
        </a>
      </nav>

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
            👋 你好，我是 Reality，一名热爱技术与生活的开发者，喜欢构建有趣的产品与工具。本博客记录我的开发笔记，欢迎常来看看！
          </p>
        </div>
      </aside>
    </main>
  );
}
