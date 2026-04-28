"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHashtag, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import type { Article } from "@/types/article";

interface TagCardProps {
  articles: Article[];
}

const DEFAULT_VISIBLE_TAGS = 10;
const MAX_VISIBLE_TAGS_EXPANDED = 20;

// 标签入场动画变体
const tagVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.3,
      ease: "easeOut" as const,
    },
  }),
};

// 展开按钮动画
const expandButtonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 },
  },
};

function TagItem({
  label,
  count,
  onClick,
  index,
}: {
  label: string;
  count: number;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.span
      custom={index}
      initial="hidden"
      animate="visible"
      variants={tagVariants}
      onClick={onClick}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="
        flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full
        bg-gray-100 dark:bg-gray-700
        text-gray-800 dark:text-gray-100
        hover:bg-blue-100 dark:hover:bg-blue-800
        hover:text-blue-700 dark:hover:text-blue-300
        transition-colors duration-200
        cursor-pointer
        whitespace-nowrap
        shadow-sm hover:shadow-md
      "
    >
      #{label}
      <span className="text-xs opacity-70">({count})</span>
    </motion.span>
  );
}

export default function TagCard({ articles }: TagCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

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

    // 按使用频率排序
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [articles]);

  const visibleTags = isExpanded
    ? tagMap.slice(0, MAX_VISIBLE_TAGS_EXPANDED)
    : tagMap.slice(0, DEFAULT_VISIBLE_TAGS);

  const hasMore = tagMap.length > DEFAULT_VISIBLE_TAGS;
  const hasCollapse = tagMap.length > MAX_VISIBLE_TAGS_EXPANDED;

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
          index={0}
        />

        {visibleTags.map(([tag, count], idx) => (
          <TagItem
            key={tag}
            label={tag}
            count={count}
            onClick={() =>
              router.push(`/category?category=${encodeURIComponent(tag)}`)
            }
            index={idx + 1}
          />
        ))}

        {/* 展开/收起按钮 */}
        <AnimatePresence>
          {hasMore && (
            <motion.button
              initial="hidden"
              animate="visible"
              variants={expandButtonVariants}
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full
                bg-gray-100 dark:bg-gray-700
                text-gray-600 dark:text-gray-300
                hover:bg-gray-200 dark:hover:bg-gray-600
                transition-colors duration-200
                cursor-pointer
                shadow-sm hover:shadow-md
              "
            >
              {isExpanded ? (
                <>
                  <FaChevronUp className="text-xs" />
                  收起
                </>
              ) : (
                <>
                  <FaChevronDown className="text-xs" />
                  更多 ({tagMap.length - DEFAULT_VISIBLE_TAGS})
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
