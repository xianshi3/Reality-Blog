"use client";

import { useState, useEffect } from "react";
import type { Article } from "../types/article";

interface RandomArticleCardProps {
  articles: Article[];
}

export default function RandomArticleCard({ articles }: RandomArticleCardProps) {
  const [article, setArticle] = useState<Article | null>(null);

  const getRandomArticle = () => {
    if (articles.length === 0) {
      setArticle(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * articles.length);
    setArticle(articles[randomIndex]);
  };

  useEffect(() => {
    getRandomArticle();
  }, [articles]);

  if (!article) {
    return (
      <div className="bg-white dark:bg-[#23272f] border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-center">
        <p className="text-gray-500 dark:text-gray-400">暂无推荐文章</p>
        <button
          onClick={getRandomArticle}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#23272f]  rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">🎲 随机</h3>
        <button
          onClick={getRandomArticle}
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          换一篇
        </button>
      </div>

      <div>
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="block space-y-2">
          <h4 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2">
            {article.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {article.summary || "暂无摘要"}
          </p>
        </a>
        <div className="mt-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>{article.category || "未分类"}</span>
          <span>
            {new Date(article.date).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
