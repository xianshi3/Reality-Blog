import Image from "next/image";
import TechStackCard from "./TechStackCard";

interface RightSidebarProps {
  tags: string[];
  recommends: string[];
  className?: string;
}

/**
 * 右侧边栏组件，显示个人信息、技术栈、热门标签
 */
export default function RightSidebar({
  tags,
  recommends,
  className,
}: RightSidebarProps) {
  const cardClass =
    "bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-6 animate-fadeInUp animate-scaleIn transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl";

  return (
    <aside className={`lg:w-64 w-full space-y-6 ${className ?? ""}`}>
      {/* 个人信息卡片 */}
      <div className={cardClass + " flex flex-col items-center text-center"}>
        <Image
          className="avatarImg mb-3 rounded-full mx-auto ring-4 ring-blue-200 dark:ring-blue-900"
          src="/avatar.jpg"
          alt="头像"
          width={96}
          height={96}
          priority
        />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
          Reality
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Full Stack Developer
        </p>

        {/* 社交链接 */}
        <div className="flex gap-3 mt-4">
          <a
            href="https://github.com/xianshi3"
            target="_blank"
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800 transition"
          >
            {/* GitHub SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.8-1.5-3.8-1.5-.6-1.5-1.3-1.9-1.3-1.9-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3 0-.3-.5-1.5.1-3.1 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6.2 0c2.4-1.5 3.4-1.2 3.4-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.6-2.7 5.5-5.3 5.8.4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A10.9 10.9 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
            </svg>
          </a>
          <a
            href="https://x.com/xianshi_3"
            target="_blank"
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800 transition"
          >
            {/* Twitter SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9 9 0 0 1-2.84 1.1A4.52 4.52 0 0 0 16.5 0c-2.66 0-4.8 2.15-4.8 4.8 0 .38.05.75.13 1.1A12.8 12.8 0 0 1 1.64.9a4.82 4.82 0 0 0-.65 2.42c0 1.66.84 3.13 2.13 3.98a4.54 4.54 0 0 1-2.17-.6v.06c0 2.32 1.64 4.26 3.8 4.7a4.6 4.6 0 0 1-2.16.08c.61 1.9 2.38 3.28 4.48 3.32A9.1 9.1 0 0 1 0 19.54a12.8 12.8 0 0 0 6.92 2.03c8.3 0 12.84-6.9 12.84-12.85 0-.2 0-.39-.01-.58A9.2 9.2 0 0 0 23 3z" />
            </svg>
          </a>
        </div>

      </div>

      {/* 技术栈卡片 */}
      <TechStackCard />

      {/* 热门标签卡片 */}
      <div className={cardClass}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
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
