"use client";

import { useState, useEffect } from "react";
import type { Article } from "../types/article";

// 定义组件接收的属性类型
interface RandomArticleCardProps {
  articles: Article[];  // 文章数组
}

// 随机文章卡片组件
export default function RandomArticleCard({ articles }: RandomArticleCardProps) {
  const [article, setArticle] = useState<Article | null>(null);  // 当前显示的文章

  // 随机获取一篇文章
  const getRandomArticle = () => {
    if (articles.length === 0) {
      setArticle(null);  // 如果没有文章，设为null
      return;
    }
    const randomIndex = Math.floor(Math.random() * articles.length);  // 生成随机索引
    setArticle(articles[randomIndex]);  // 设置随机文章
  };

  // 组件加载或文章列表变化时获取随机文章
  useEffect(() => {
    getRandomArticle();
  }, [articles]);

  return (
    <div className="bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-5 animate-fadeInUp animate-scaleIn
    transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl">
      {/* 标题和刷新按钮区域 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">随机日志</h3>
        <button
          onClick={getRandomArticle}
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          换一篇
        </button>
      </div>

      {/* 主要内容区域 - 显示文章或提示信息 */}
      {article ? (
        <>
          {/* 文章链接（包含标题和摘要） */}
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="space-y-2 block text-left"
          >
            <h4 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
              {article.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {article.summary || "暂无摘要"}
            </p>
          </a>
          {/* 文章元信息（分类和日期） */}
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
        </>
      ) : (
        <>
          {/* 没有文章时的提示信息 */}
          <p className="text-gray-500 dark:text-gray-400">暂无推荐文章</p>
          <button
            onClick={getRandomArticle}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            重试
          </button>
        </>
      )}
    </div>
  );
}