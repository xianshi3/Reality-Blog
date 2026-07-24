"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { parseTags } from "@/lib/parseTags";
import type { Article } from "@/types/article";

interface MainContentProps {
  articles: Article[];
  className?: string;
  currentPage?: number;
  totalPages?: number;
}

export default function MainContent({
  articles,
  className = "",
  currentPage = 1,
  totalPages = 1,
}: MainContentProps) {

  const [displayPage, setDisplayPage] = useState(currentPage);
  const [transitionStage, setTransitionStage] =
    useState<"enter" | "exit">("enter");

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
      <div
        key={displayPage}
        className={
          transitionStage === "enter"
            ? "page-transition-enter-active"
            : "page-transition-exit-active"
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <div key={article.link} className="flex">
              <Link
                href={article.link}
                className="article-item"
              >
                {article.image_url ? (
                  <div className="relative h-48 md:h-56 w-full overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="h-48 md:h-56 bg-gradient-to-b from-gray-100 to-gray-50 dark:from-[#2a2f3a] dark:to-[#23272f]" />
                )}

                <div className="flex flex-col flex-1 px-4 pb-4 pt-3">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="article-title">
                      {article.title}
                    </h3>

                    <p className={`article-summary min-h-[1.35em] ${!article.summary ? "invisible" : ""}`}>
                      {article.summary || "."}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      {article.date
                        ? new Date(article.date).toLocaleDateString("zh-CN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "未知日期"}
                    </span>

                    {article.category && (
                      <span className="article-meta-tag">
                        {article.category}
                      </span>
                    )}

                    {article.tags && parseTags(article.tags).slice(0, 2).map((t: string) => (
                      <span key={t} className="article-meta-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <nav aria-label="分页导航" className="pagination">
          {currentPage > 1 && (
            <Link href={`/?page=${currentPage - 1}`}>上一页</Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => (
              <Link
                key={page}
                href={`/?page=${page}`}
                className={page === currentPage ? "active" : ""}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </Link>
            )
          )}

          {currentPage < totalPages && (
            <Link href={`/?page=${currentPage + 1}`}>下一页</Link>
          )}
        </nav>
      )}
    </main>
  );
}
