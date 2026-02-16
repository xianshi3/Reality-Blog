"use client";

interface AnnouncementCardProps {
  totalCount: number;
  message?: string;
}

export default function AnnouncementCard({
  totalCount,
  message = "目前我会在有空闲时间更新博客，内容还在持续完善中",
}: AnnouncementCardProps) {
  const cardBaseClass =
    "bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-5 animate-fadeInUp animate-scaleIn";

  const cardHoverClass =
    "transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl";

  const today = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`${cardBaseClass} ${cardHoverClass}`}>
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
        公告
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {message}
      </p>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div>文章总数：{totalCount}</div>
        <div>今日日期：{today}</div>
      </div>
    </div>
  );
}
