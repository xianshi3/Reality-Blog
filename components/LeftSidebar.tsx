import RandomArticleCard from './RandomArticleCard';
import NavCard from './NavCard';
import type { Article } from '../types/article';

interface LeftSidebarProps {
  articles: Article[];
}

export default function LeftSidebar({ articles }: LeftSidebarProps) {
  const cardBaseClass =
    'bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-5 animate-fadeInUp animate-scaleIn';
  const cardHoverClass =
    'transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl';

  return (
    <aside className="lg:w-1/4 w-full space-y-6 animate-fadeInUp delay-100">
      <NavCard />

      <div className={`${cardBaseClass} ${cardHoverClass}`}>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">公告</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          目前我会在有空闲时间更新网站，内容还在持续完善中
        </p>
      </div>

      <RandomArticleCard articles={articles} />
    </aside>
  );
}
