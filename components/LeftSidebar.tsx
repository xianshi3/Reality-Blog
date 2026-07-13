"use client";

import RandomArticleCard from "./RandomArticleCard";
import NavCard from "./NavCard";
import AnnouncementCard from "./AnnouncementCard";
import type { Article } from "../types/article";

interface LeftSidebarProps {
  articles: Article[];
  totalCount: number;
  className?: string;
}

export default function LeftSidebar({
  articles,
  totalCount,
  className,
}: LeftSidebarProps) {
  return (
    <aside className={`lg:w-64 w-full space-y-6 ${className ?? ""}`}>
      {/* 导航卡片 */}
      <NavCard articles={articles} />

      {/* 公告卡片 */}
      <AnnouncementCard totalCount={totalCount} />

      {/* 随机文章卡片 */}
      <RandomArticleCard articles={articles} />
    </aside>
  );
}
