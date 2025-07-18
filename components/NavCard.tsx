// 定义单个导航链接的接口类型
interface NavLink {
  href: string;               // 链接地址
  icon: React.ReactNode;      // 图标组件或元素
  label: string;              // 显示名称
  description?: string;       // 可选描述信息
}

// 定义导航链接列表
const NAV_LINKS: NavLink[] = [
  {
    href: '#',
    icon: <span className="nav-icon home-icon">⌂</span>,
    label: '首页',
    description: '网站首页',
  },
  {
    href: '#',
    icon: <span className="nav-icon category-icon">▤</span>,
    label: '分类',
    description: '浏览文章分类',
  },
  {
    href: '/ai-chat/fullscreen',
    icon: <span className="nav-icon chat-icon">✉</span>,
    label: 'AI Chat',
    description: 'LLM智能技术AI',
  },
];

// 定义 NavCard 组件的 props 类型
interface NavCardProps {
  className?: string; // 外部传入的自定义样式类名
}

// 导出导航卡片组件
export default function NavCard({ className = '' }: NavCardProps) {
  // 卡片的基础样式类（含背景、边框、圆角、阴影、动画）
  const cardBaseClass =
    'bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-5 animate-fadeInUp animate-scaleIn';

  // 悬停时的交互动画类
  const cardHoverClass =
    'transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl';

  return (
    <div className={`${cardBaseClass} ${cardHoverClass} ${className}`}>
      {/* 标题部分 */}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">导航</h3>

      {/* 导航链接列表 */}
      <ul className="space-y-4">
        {NAV_LINKS.map(({ href, icon, label, description }) => (
          <li key={label}>
            <a
              href={href}
              className="
                flex items-center p-3 rounded-lg
                bg-white dark:bg-[#23272f]
                hover:bg-gray-100 dark:hover:bg-[#2a2f3a]
                transition-colors duration-200 ease-in-out
                group
              "
            >
              {/* 图标部分 */}
              <span
                className="
                  mr-3 text-2xl
                  transform transition-transform duration-300
                  group-hover:scale-110
                  text-gray-700 dark:text-gray-300
                  flex justify-center items-center w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700
                "
                aria-label={label}
              >
                {icon}
              </span>

              {/* 标签文字和描述 */}
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{label}</div>
                {description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-tight">
                    {description}
                  </p>
                )}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
