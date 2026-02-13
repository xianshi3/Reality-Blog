"use client";

import Image from "next/image";
import TechStackCard from "./TechStackCard";
import { FaUser, FaHashtag, FaGithub, FaXTwitter } from "react-icons/fa6";

interface RightSidebarProps {
  tags: string[];
  recommends: string[];
  className?: string;
}

export default function RightSidebar({
  tags,
  recommends,
  className,
}: RightSidebarProps) {
  const cardClass =
    "relative bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl";

  return (
    <aside className={`lg:w-72 w-full space-y-6 ${className ?? ""}`}>

      {/* 个人信息卡片 */}
      <div className={`${cardClass} flex flex-col items-center text-center`}>

        {/* 头像区域 */}
        <div className="mb-4">
          <Image
            src="/avatar.png"
            alt="头像"
            width={96}
            height={96}
            sizes="96px"
            quality={100}
            priority
            className="rounded-full object-cover ring-4 ring-blue-200 dark:ring-blue-900 transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* 名字 */}
        <h1 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white">
          <FaUser className="text-base opacity-80" />
          Reality
        </h1>

        {/* 描述 */}
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Full Stack Developer
        </p>

        {/* 分割线 */}
        <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-4" />

        {/* 社交链接 */}
        <div className="flex justify-center gap-4">
          <a
            href="https://github.com/xianshi3"
            target="_blank"
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-300 hover:scale-110 hover:shadow-md"
          >
            <FaGithub className="w-5 h-5" />
          </a>

          <a
            href="https://x.com/xianshi_3"
            target="_blank"
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-300 hover:scale-110 hover:shadow-md"
          >
            <FaXTwitter className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* 技术栈卡片 */}
      <TechStackCard />

      {/* 标签卡片 */}
      <div className={cardClass}>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white mb-4">
          <FaHashtag className="text-sm opacity-80" />
          标签
        </h3>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 transition cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
