import RandomArticleCard from './RandomArticleCard';
import type { Article } from '../types/article';

interface LeftSidebarProps {
  articles: Article[];
}

const NAV_LINKS = [
  { href: '#', icon: '🏠', label: '首页' },
  { href: '#', icon: '📚', label: '分类' },
  { href: '#', icon: '📧', label: '联系我' },
  { href: '/ai-chat/fullscreen', icon: '🤖', label: 'AI Chat' },
];

export default function LeftSidebar({ articles }: LeftSidebarProps) {
  // 通用卡片样式
  const cardBaseClass =
    'bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-5 animate-fadeInUp animate-scaleIn';
  const cardHoverClass =
    'transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl';

  return (
    <aside className="lg:w-1/4 w-full space-y-6 animate-fadeInLeft delay-100">
      {/* 导航卡片 */}
      <div className={`${cardBaseClass} ${cardHoverClass}`}>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">导航</h3>
        <ul className="space-y-3">
          {NAV_LINKS.map(({ href, icon, label }) => (
            <li key={label}>
              <a
                href={href}
                className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span className="mr-2 text-base">{icon}</span>
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* 公告卡片 */}
      <div className={`${cardBaseClass} ${cardHoverClass}`}>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">公告</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          目前我会在有空闲时间更新网站，内容还在持续完善中 <span className="text-yellow-500">✨</span>
        </p>
      </div>


      {/* 随机文章推荐卡片 */}
      <RandomArticleCard articles={articles} />
    </aside>
  );
}
