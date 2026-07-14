"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { parseTags } from "@/lib/parseTags";
import type { Article } from "@/types/article";

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
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredArticles = articles.filter((a) => {
    if (!value.trim()) return false;
    const q = value.toLowerCase();
    if (a.title.toLowerCase().includes(q)) return true;
    if (a.summary?.toLowerCase().includes(q)) return true;
    const tags = parseTags(a.tags);
    if (tags.some((t) => t.toLowerCase().includes(q))) return true;
    return false;
  });

  const visible = value && isOpen;

  useEffect(() => {
    setHighlightIdx(-1);
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!visible || filteredArticles.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIdx((prev) =>
          prev < filteredArticles.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIdx((prev) =>
          prev > 0 ? prev - 1 : filteredArticles.length - 1
        );
      } else if (e.key === "Enter" && highlightIdx >= 0) {
        e.preventDefault();
        onSelect?.(filteredArticles[highlightIdx]);
        setHighlightIdx(-1);
      }
    },
    [visible, filteredArticles, highlightIdx, onSelect]
  );

  useEffect(() => {
    if (highlightIdx >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[highlightIdx]) {
        (items[highlightIdx] as HTMLLIElement).scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [highlightIdx]);

  return (
    <div className="w-full relative">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          type="text"
          aria-label="搜索文章"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-[#2a2f3a] text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 border border-transparent focus:border-gray-300 dark:focus:border-gray-600 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-300 shadow-sm"
        />
      </div>

      <div
        className={`absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform origin-top ${
          value && isOpen
            ? "opacity-100 scale-100 max-h-80"
            : "opacity-0 scale-95 max-h-0"
        } bg-white dark:bg-[#23272f]`}
      >
        {visible && filteredArticles.length > 0 ? (
          <ul
            ref={listRef}
            className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto max-h-80"
          >
            {filteredArticles.map((article, idx) => (
              <li
                key={article.id}
                onClick={() => onSelect?.(article)}
                className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                  idx === highlightIdx
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-gray-100 dark:hover:bg-[#2a2f3a]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {article.title}
                      </span>
                      <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        {article.category}
                      </span>
                    </div>
                    {article.summary && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {article.summary}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : visible ? (
          <div className="py-6 text-center text-gray-400 dark:text-gray-500 text-sm">
            没有匹配的文章
          </div>
        ) : null}
      </div>
    </div>
  );
}
