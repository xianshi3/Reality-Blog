"use client";

import { useEffect, useState } from "react";
import type { Article } from "../types/article";

// 每页显示的文章数量，需要和服务端保持一致
const PAGE_SIZE = 4;

/**
 * MainContent 组件属性类型定义
 */
interface MainContentProps {
  articles: Article[];           // 当前页的文章列表
  className?: string;            // 额外的样式类名
  currentPage?: number;          // 当前页码，默认1
  totalPages?: number;           // 总页数，默认1
}

/**
 * MainContent 组件
 * 显示文章列表（按年份分组），带分页导航和作者简介
 */
export default function MainContent({
  articles,
  className = "",
  currentPage = 1,
  totalPages = 1,
}: MainContentProps) {
  // 用于实现分页切换时的过渡动画
  const [displayPage, setDisplayPage] = useState(currentPage);
  const [transitionStage, setTransitionStage] = useState<"enter" | "exit">("enter");

  // 监听 currentPage 变化，实现分页切换动画
  useEffect(() => {
    if (currentPage !== displayPage) {
      setTransitionStage("exit"); // 先触发退出动画
      const timeout = setTimeout(() => {
        setDisplayPage(currentPage); // 更新显示的页码
        setTransitionStage("enter"); // 触发进入动画
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [currentPage, displayPage]);

  // 将文章按年份分组，方便分年展示
  const groupedArticles = articles.reduce<Record<number, Article[]>>((acc, article) => {
    const year = new Date(article.date).getFullYear();
    acc[year] = acc[year] || [];
    acc[year].push(article);
    return acc;
  }, {});

  // 获取所有年份，降序排列（最新年份排前面）
  const years = Object.keys(groupedArticles)
    .map(Number)
    .sort((a, b) => b - a);

  /**
   * 计算分页按钮显示的页码数组，最多显示5个页码
   */
  const getPageNumbers = () => {
    const delta = 2; // 当前页前后各显示几个页码
    let start = Math.max(1, displayPage - delta);
    let end = Math.min(totalPages, displayPage + delta);

    // 保证页码总数为5（或者不足5时尽量补足）
    if (end - start < 4) {
      if (start === 1) end = Math.min(totalPages, start + 4);
      else if (end === totalPages) start = Math.max(1, end - 4);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  /**
   * 点击分页按钮事件处理
   * 滚动页面顶部，并跳转到对应页码（刷新页面）
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
      {/* 文章列表容器，切换分页时触发动画 */}
      <div
        key={displayPage}
        className={
          transitionStage === "enter"
            ? "page-transition-enter-active"
            : "page-transition-exit-active"
        }
      >
        {/* 按年份分组渲染文章 */}
        {years.map((year) => (
          <section key={year}>
            {/* 年份标题 */}
            <h2 className="section-title text-gray-800 dark:text-gray-100 font-semibold text-xl mt-6">
              📅 {year} 年文章
            </h2>

            <ul className="space-y-8">
              {/* 渲染该年份下的文章列表 */}
              {groupedArticles[year].map((article) => (
                <li key={article.link}>
                  <article className="article-item">
                    <a href={article.link} className="article-link" tabIndex={0}>
                      {/* 文章标题 */}
                      <h3 className="article-title">{article.title}</h3>

                      {/* 文章元信息：发布日期和分类 */}
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

                      {/* 如果有封面图片则显示，放在文本下面 */}
                      {article.image_url && (
                        <img
                          src={article.image_url}
                          alt={`文章封面 - ${article.title}`}
                          className="article-image mt-4 mx-auto"
                          loading="lazy"
                        />
                      )}
                    </a>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* 分页导航：只有当文章数达到每页最大数且总页数大于1时显示 */}
      {articles.length === PAGE_SIZE && totalPages > 1 ? (
        <nav aria-label="分页导航" className="pagination">
          {/* 上一页按钮，当前页大于1时显示 */}
          {currentPage > 1 && (
            <a
              href={`/?page=${currentPage - 1}`}
              onClick={(e) => handlePageClick(e, currentPage - 1)}
              tabIndex={0}
            >
              上一页
            </a>
          )}

          {/* 数字页码按钮 */}
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

          {/* 下一页按钮，当前页小于总页数时显示 */}
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
        /* 文章不足每页最大数时显示无更多文章提示 */
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
