export default function LeftSidebar() {
  return (
    <aside className="lg:w-1/4 w-full space-y-6">
      <div className="article-item">
        <h3 className="article-title">导航</h3>
        <ul className="text-sm">
          <li>
            <a href="#">🏠 首页</a>
          </li>
          <li>
            <a href="#">📚 分类</a>
          </li>
          <li>
            <a href="#">📧 联系我</a>
          </li>
        </ul>
      </div>
      <div className="article-item">
        <h3 className="article-title">公告</h3>
        <p className="text-sm">
          欢迎来到 Reality 的博客！正在持续更新中~
        </p>
      </div>
    </aside>
  );
}