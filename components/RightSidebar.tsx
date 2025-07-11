import Image from "next/image";
import TechStackCard from './TechStackCard';

interface RightSidebarProps {
  tags: string[];
  recommends: string[];
}

/**
 * 右侧边栏组件，显示个人信息、技术栈、热门标签
 */
export default function RightSidebar({ tags, recommends }: RightSidebarProps) {
  const cardClass = "bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-6 animate-fadeInUp animate-scaleIn transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl";

  return (
    <aside className="lg:w-64 w-full space-y-6">
      {/* 个人信息卡片 */}
      <div className="flex flex-col items-center justify-center text-center bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-6 animate-fadeInUp animate-scaleIn transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl">
        <Image
          className="avatarImg mb-3"
          src="/avatar.jpg"
          alt="头像"
          width={96}
          height={96}
          priority
        />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Reality</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-[200px]">
          Full Stack Developer
        </p>
      </div>

      {/* 技术栈卡片 */}
      <TechStackCard />

      {/* 热门标签卡片 */}
      <div className={cardClass}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">标签</h3>
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
