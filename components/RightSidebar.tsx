import Image from "next/image";

interface RightSidebarProps {
  tags: string[];
  recommends: string[];
}

/**
 * 右侧边栏组件，显示个人信息、热门标签和推荐阅读列表
 *
 * @param tags - 热门标签数组，将以标签形式展示
 * @param recommends - 推荐阅读标题数组，将以列表形式展示
 * @returns 渲染右侧边栏的 React 组件
 */
export default function RightSidebar({ tags, recommends }: RightSidebarProps) {
  return (
    <aside className="lg:w-1/4 w-full space-y-6">
      {/* 个人信息卡片 */}
      <div className="flex flex-col items-center text-center bg-white dark:bg-[#23272f] rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-800 animate-fadeInUp">
        <Image
          className="avatarImg mb-3"
          src="/avatar.jpg"
          alt="头像"
          width={96}
          height={96}
          priority
        />
        <h1 className="home-title mb-1">Reality</h1>
        <p className="home-description text-sm">全栈开发工程师的技术与生活</p>
      </div>
      {/* 热门标签 */}
      <div className="article-item">
        <h3 className="article-title mb-3">热门标签</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-200 dark:bg-gray-700 text-blue-700 dark:text-blue-200 text-xs px-3 py-1 rounded-full font-medium shadow-sm transition hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      {/* 推荐阅读 */}
      <div className="article-item">
        <h3 className="article-title mb-3">推荐阅读</h3>
        <ul className="text-sm space-y-2">
          {recommends.map((title, idx) => (
            <li key={idx}>
              <a
                href="#"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 transition"
              >
                <span className="text-base">📌</span>
                <span className="truncate">{title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}