"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Article } from "../types/article";

/**
 * 每页文章数量（必须和服务端一致）
 */
const PAGE_SIZE = 4;

interface MainContentProps {
  articles: Article[];
  className?: string;
  currentPage?: number;
  totalPages?: number;
}

/**
 * 主内容组件
 * 功能：
 * - 直接按时间顺序展示文章
 * - 支持分页
 * - 支持切换动画
 */
export default function MainContent({
  articles,
  className = "",
  currentPage = 1,
  totalPages = 1,
}: MainContentProps) {

  const [displayPage, setDisplayPage] = useState(currentPage);
  const [transitionStage, setTransitionStage] =
    useState<"enter" | "exit">("enter");

  /**
   * 页码切换动画
   */
  useEffect(() => {
    if (currentPage !== displayPage) {
      setTransitionStage("exit");

      const timer = setTimeout(() => {
        setDisplayPage(currentPage);
        setTransitionStage("enter");
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentPage, displayPage]);

  return (
    <main className={`space-y-8 ${className}`}>

      {/* ===================== */}
      {/* 文章列表 */}
      {/* ===================== */}

      <div
        key={displayPage}
        className={
          transitionStage === "enter"
            ? "page-transition-enter-active"
            : "page-transition-exit-active"
        }
      >
        {/* 统一 grid，不再分年份 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {articles.map((article) => (
            <div key={article.link} className="flex">
              <Link
                href={article.link}
                className="article-item flex flex-col h-full w-full overflow-hidden"
              >

                {/* 封面图 */}
                {article.image_url && (
                  <div className="relative h-48 md:h-56 w-full overflow-hidden rounded-xl">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl" />
                  </div>
                )}

                {/* 文章内容 */}
                <div className="flex flex-col flex-1 mt-4">

                  {/* 标题 */}
                  <h3 className="article-title mb-2">
                    {article.title}
                  </h3>

                  {/* 摘要 */}
                  <p className="article-summary mb-4">
                    {article.summary}
                  </p>

                  {/* 底部信息 */}
                  <div className="mt-auto flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      {article.date
                        ? new Date(article.date).toLocaleDateString("zh-CN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "未知日期"}
                    </span>

                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-blue-600 dark:text-blue-300">
                      {article.category}
                    </span>
                  </div>

                </div>
              </Link>
            </div>
          ))}

        </div>
      </div>

      {/* ===================== */}
      {/* 分页 */}
      {/* ===================== */}

      {totalPages > 1 && (
        <nav
          aria-label="分页导航"
          className="pagination"
        >

          {/* 上一页 */}
          {currentPage > 1 && (
            <Link href={`/?page=${currentPage - 1}`}>
              上一页
            </Link>
          )}

          {/* 页码 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => (
              <Link
                key={page}
                href={`/?page=${page}`}
                className={page === currentPage ? "active" : ""}
                aria-current={
                  page === currentPage ? "page" : undefined
                }
              >
                {page}
              </Link>
            )
          )}

          {/* 下一页 */}
          {currentPage < totalPages && (
            <Link href={`/?page=${currentPage + 1}`}>
              下一页
            </Link>
          )}

        </nav>
      )}

    </main>
  );
}
