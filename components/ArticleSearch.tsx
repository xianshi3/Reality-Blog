"use client";
import React from "react";

interface ArticleSearchProps {
  value: string;
  onChange: (val: string) => void;
  isOpen: boolean;
  placeholder?: string;
}

export default function ArticleSearch({
  value,
  onChange,
  isOpen,
  placeholder = "搜索文章...",
}: ArticleSearchProps) {
  return (
    <div
      className={`overflow-hidden transition-all duration-500 ${
        isOpen ? "max-h-20 opacity-100 mb-4" : "max-h-0 opacity-0 mb-0"
      }`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded-lg bg-gray-100 dark:bg-[#2a2f3a] text-gray-800 dark:text-gray-200 text-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all duration-200"
      />
    </div>
  );
}
