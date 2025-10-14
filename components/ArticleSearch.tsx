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
  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="w-full relative">
      {/* 搜索框 */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl bg-gray-100 dark:bg-[#2a2f3a] text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 border border-transparent focus:border-gray-300 dark:focus:border-gray-600 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-300 shadow-sm"
      />

      {/* 搜索结果列表 */}
      <div
        className={`absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform origin-top ${
          value && isOpen
            ? "opacity-100 scale-100 max-h-60"
            : "opacity-0 scale-95 max-h-0"
        } bg-white dark:bg-[#23272f]`}
      >
        {value && filteredArticles.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto max-h-60">
            {filteredArticles.map((article) => (
              <li
                key={article.id}
                onClick={() => onSelect?.(article)}
                className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#2a2f3a] cursor-pointer transition-colors duration-200"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {article.title}
                </span>
              </li>
            ))}
          </ul>
        ) : value ? (
          <div className="py-3 text-center text-gray-500 dark:text-gray-400 text-sm">
            没有匹配文章
          </div>
        ) : null}
      </div>
    </div>
  );
}
