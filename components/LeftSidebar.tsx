/**
 * LeftSidebar 左侧边栏组件
 *
 * 用于展示博客导航链接、公告信息和随机文章推荐。
 * 默认适配大屏分栏布局，在小屏下全宽显示。
 */
import RandomArticleCard from './RandomArticleCard';
import type { Article } from '../types/article';

interface LeftSidebarProps {
  articles: Article[];
}

export default function LeftSidebar({ articles }: LeftSidebarProps) {
  return (
    <aside className="lg:w-1/4 w-full space-y-6">
      {/* 导航菜单卡片 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold mb-3">导航</h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <span className="mr-2">🏠</span> 首页
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <span className="mr-2">📚</span> 分类
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <span className="mr-2">📧</span> 联系我
            </a>
          </li>
        </ul>
      </div>

      {/* 公告卡片 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold mb-3">公告</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          欢迎来到 <span className="text-blue-600 dark:text-blue-400 font-medium">Reality</span> 的博客！<br />
          正在持续更新中，敬请期待 ✨
        </p>
      </div>

      {/* 随机文章推荐卡片 */}
      <RandomArticleCard articles={articles} />
    </aside>
  );
}