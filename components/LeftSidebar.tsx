/**
 * LeftSidebar 左侧边栏组件
 *
 * 用于展示博客导航链接和公告信息。
 * 默认适配大屏分栏布局，在小屏下全宽显示。
 */
export default function LeftSidebar() {
  return (
    <aside className="lg:w-1/4 w-full space-y-6">
      {/* 导航菜单卡片 */}
      <div className="article-item">
        <h3 className="article-title">导航</h3>
        <ul className="text-sm space-y-2 mt-2">
          <li>
            <a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              🏠 首页
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              📚 分类
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              📧 联系我
            </a>
          </li>
        </ul>
      </div>

      {/* 公告卡片 */}
      <div className="article-item">
        <h3 className="article-title">公告</h3>
        <p className="text-sm mt-2 leading-relaxed text-gray-700 dark:text-gray-300">
          欢迎来到 <strong className="text-blue-600 dark:text-blue-400">Reality</strong> 的博客！<br />
          正在持续更新中，敬请期待 ✨
        </p>
      </div>
    </aside>
  );
}