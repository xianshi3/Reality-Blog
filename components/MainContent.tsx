"use client";

import { useEffect, useState } from "react";
import type { Article } from "../types/article";

// 每页显示文章数，需和服务端保持一致
const PAGE_SIZE = 4;

/**
 * Props 类型定义：MainContent 组件接收文章列表、分页信息和样式类名
 */
interface MainContentProps {
  articles: Article[];
  className?: string;
  currentPage?: number;
  totalPages?: number;
}

/**
 * MainContent 组件：用于显示文章列表、分页导航和作者简介
 */
export default function MainContent({
  articles,
  className = "",
  currentPage = 1,
  totalPages = 1,
}: MainContentProps) {
  // 当前展示的页码（带过渡动画）
  const [displayPage, setDisplayPage] = useState(currentPage);
  const [transitionStage, setTransitionStage] = useState<"enter" | "exit">("enter");

  // 当页码变化时，触发退出动画后再更新展示页面
  useEffect(() => {
    if (currentPage !== displayPage) {
      setTransitionStage("exit");
      const timeout = setTimeout(() => {
        setDisplayPage(currentPage);
        setTransitionStage("enter");
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [currentPage, displayPage]);

  // 将文章按年份分组，方便按年份展示
  const groupedArticles = articles.reduce<Record<number, Article[]>>((acc, article) => {
    const year = new Date(article.date).getFullYear();
    acc[year] = acc[year] || [];
    acc[year].push(article);
    return acc;
  }, {});

  // 获取所有年份并按降序排列，最新年份在前
  const years = Object.keys(groupedArticles)
    .map(Number)
    .sort((a, b) => b - a);

  /**
   * 获取分页按钮要展示的页码数组（最大展示 5 个）
   */
  const getPageNumbers = () => {
    const delta = 2;
    let start = Math.max(1, displayPage - delta);
    let end = Math.min(totalPages, displayPage + delta);

    if (end - start < 4) {
      if (start === 1) end = Math.min(totalPages, start + 4);
      else if (end === totalPages) start = Math.max(1, end - 4);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  /**
   * 点击分页按钮时滚动到顶部并跳转到对应页
   */
  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    if (page !== currentPage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        window.location.href = `/?page=${page}`;
      }, 350);
    }
  };

  return (
    <main className={`space-y-8 ${className}`}>
      {/* 文章区域（按年份分组） */}
      <div
        key={displayPage}
        className={
          transitionStage === "enter"
            ? "page-transition-enter-active"
            : "page-transition-exit-active"
        }
      >
        {/* 遍历每个年份的文章分组 */}
        {years.map((year) => (
          <section key={year}>
            {/* 年份标题 */}
            <h2 className="section-title text-gray-800 dark:text-gray-100 font-semibold text-xl mt-6">
              📅 {year} 年文章
            </h2>

            {/* 当前年份下的文章列表 */}
            <ul className="space-y-8">
              {groupedArticles[year].map((article) => (
                <li key={article.link}>
                  <article className="article-item">
                    {/* 文章链接（包含标题、日期/分类、摘要） */}
                    <a href={article.link} className="article-link" tabIndex={0}>
                      {/* 文章标题 */}
                      <h3 className="article-title">{article.title}</h3>

                      {/* 文章元信息：日期 + 分类 */}
                      <p className="article-meta">
                        {article.date
                          ? new Date(article.date).toLocaleDateString("zh-CN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "未知日期"} · {article.category}
                      </p>

                      {/* 文章摘要 */}
                      <p className="article-summary">{article.summary}</p>
                    </a>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* 分页导航区域：只有文章数达到 PAGE_SIZE 且总页数大于1时才显示 */}
      {articles.length === PAGE_SIZE && totalPages > 1 ? (
        <nav aria-label="分页导航" className="pagination">
          {/* 只有当前页大于1时显示“上一页”按钮 */}
          {currentPage > 1 && (
            <a
              href={`/?page=${currentPage - 1}`}
              onClick={(e) => handlePageClick(e, currentPage - 1)}
              tabIndex={0}
            >
              上一页
            </a>
          )}

          {/* 页码按钮 */}
          {pageNumbers.map((pageNum) => (
            <a
              key={pageNum}
              href={`/?page=${pageNum}`}
              className={pageNum === currentPage ? "active" : ""}
              aria-current={pageNum === currentPage ? "page" : undefined}
              onClick={(e) => handlePageClick(e, pageNum)}
            >
              {pageNum}
            </a>
          ))}

          {/* 只有当前页小于总页数时显示“下一页”按钮 */}
          {currentPage < totalPages && (
            <a
              href={`/?page=${currentPage + 1}`}
              onClick={(e) => handlePageClick(e, currentPage + 1)}
              tabIndex={0}
            >
              下一页
            </a>
          )}
        </nav>
      ) : (
        /* 文章数少于 PAGE_SIZE 时显示无更多文章提示 */
        <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
          — 无更多文章 —
        </p>
      )}

      {/* 作者简介卡片 */}
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
