"use client";
import React from "react";
import type { Article } from "../types/article";

interface ArticleSearchProps {
  value: string;
  onChange: (val: string) => void;
  isOpen: boolean;
  placeholder?: string;
  articles: Article[];
  onSelect?: (article: Article) => void;
}

export default function ArticleSearch({
  value,
  onChange,
  isOpen,
  placeholder = "搜索文章...",
  articles,
  onSelect,
}: ArticleSearchProps) {
  // 过滤匹配文章
  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div
      className={`overflow-hidden transition-all duration-500 ${
        isOpen ? "max-h-[400px] opacity-100 mb-4" : "max-h-0 opacity-0 mb-0"
      }`}
    >
      {/* 搜索框 */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded-lg bg-gray-100 dark:bg-[#2a2f3a] text-gray-800 dark:text-gray-200 text-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all duration-200"
      />

      {/* 搜索结果 */}
      {value && filteredArticles.length > 0 && (
        <ul className="mt-2 max-h-60 overflow-y-auto bg-white dark:bg-[#23272f] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          {filteredArticles.map((article) => (
            <li
              key={article.id}
              onClick={() => onSelect?.(article)}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2f3a] cursor-pointer transition-all duration-200 rounded-md"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {article.title}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* 无匹配结果 */}
      {value && filteredArticles.length === 0 && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center py-2">
          没有匹配文章
        </div>
      )}
    </div>
  );
}
