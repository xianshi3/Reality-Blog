"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaHashtag } from "react-icons/fa6";
import type { Article } from "@/types/article";

interface TagCardProps {
  articles: Article[];
}

function TagItem({
  label,
  count,
  onClick,
}: {
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <span
      onClick={onClick}
      className="
        flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full
        bg-gray-100 dark:bg-gray-700
        text-gray-800 dark:text-gray-100
        hover:bg-blue-100 dark:hover:bg-blue-800
        hover:text-blue-700 dark:hover:text-blue-300
        transition-all duration-200
        cursor-pointer
        whitespace-nowrap
      "
    >
      #{label}
      <span className="text-xs opacity-70">({count})</span>
    </span>
  );
}

export default function TagCard({ articles }: TagCardProps) {
  const router = useRouter();

  const tagMap = useMemo(() => {
    if (!articles) return [];

    const map = new Map<string, number>();

    articles.forEach((article) => {
      const rawTags = article.tags;
      if (!rawTags) return;

      const tagArray =
        typeof rawTags === "string"
          ? rawTags.split(",")
          : Array.isArray(rawTags)
          ? rawTags
          : [];

      tagArray.forEach((tag) => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        map.set(trimmed, (map.get(trimmed) || 0) + 1);
      });
    });

    return Array.from(map.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [articles]);

  return (
    <div className="relative bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-md p-5 sm:p-6 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg">
      
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <FaHashtag className="text-sm text-gray-600 dark:text-gray-300 opacity-80" />
          </div>
          标签
        </h3>

        <span className="text-xs text-gray-400">共 {tagMap.length} 个</span>
      </div>

      {/* 分割线 */}
      <div className="w-full h-px bg-gray-200 dark:bg-gray-700 mb-4" />

      {/* 标签列表 */}
      <div className="flex flex-wrap gap-2">
        <TagItem
          label="全部"
          count={articles?.length || 0}
          onClick={() => router.push("/category")}
        />

        {tagMap.map(([tag, count]) => (
          <TagItem
            key={tag}
            label={tag}
            count={count}
            onClick={() =>
              router.push(`/category?category=${encodeURIComponent(tag)}`)
            }
          />
        ))}
      </div>
    </div>
  );
}
