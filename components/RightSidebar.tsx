import Image from "next/image";

interface RightSidebarProps {
  tags: string[];
  recommends: string[];
}

/**
 * 右侧边栏组件，显示个人信息、热门标签和推荐阅读列表。
 *
 * @param tags - 热门标签数组，将以标签形式展示。
 * @param recommends - 推荐阅读标题数组，将以列表形式展示。
 * @returns 渲染右侧边栏的 React 组件。
 */
export default function RightSidebar({ tags, recommends }: RightSidebarProps) {
  return (
    <aside className="lg:w-1/4 w-full space-y-6">
      <div className="flex flex-col items-center text-center">
        <Image
          className="avatarImg"
          src="/avatar.jpg"
          alt="头像"
          width={96}
          height={96}
          priority
        />
        <h1 className="home-title">Reality</h1>
        <p className="home-description">全栈开发工程师的技术与生活</p>
      </div>
      <div className="article-item">
        <h3 className="article-title">热门标签</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span key={idx} className="bg-gray-200">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className="article-item">
        <h3 className="article-title">推荐阅读</h3>
        <ul className="text-sm">
          {recommends.map((title, idx) => (
            <li key={idx}>
              <a href="#" className="hover:underline">
                📌 {title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}