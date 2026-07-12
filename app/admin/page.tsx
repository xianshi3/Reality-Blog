import Link from "next/link";
import { createServerSupabase } from "@/lib/supabaseServer";
import ArticleItem from "@/components/ArticleItem";
import { FaPenToSquare, FaImages, FaNewspaper, FaFileLines } from "react-icons/fa6";

export default async function AdminPage() {
  const supabase = await createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="admin-card text-center max-w-md">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            未登录，请先登录
          </p>
          <a
            href="/login"
            className="admin-btn admin-btn-primary"
          >
            前往登录
          </a>
        </div>
      </div>
    );
  }

  const { data: articles, count } = await supabase
    .from("articles")
    .select("id, title, date", { count: "exact" })
    .order("date", { ascending: false });

  const totalArticles = count ?? articles?.length ?? 0;

  const { count: categoryCount } = await supabase
    .from("articles")
    .select("category", { count: "exact", head: true })
    .not("category", "is", null);

  const { data: imageList } = await supabase.storage
    .from("article-images")
    .list("", { limit: 1000 });

  const totalImages = imageList?.length ?? 0;

  return (
    <div>
      <h1 className="admin-page-title">
        <FaNewspaper />控制台
      </h1>

      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon blue">
            <FaFileLines />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{totalArticles}</span>
            <span className="admin-stat-label">文章总数</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon green">
            <FaPenToSquare />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{categoryCount ?? 0}</span>
            <span className="admin-stat-label">分类数量</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon purple">
            <FaImages />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{totalImages}</span>
            <span className="admin-stat-label">封面图片</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="admin-quick-actions">
        <Link href="/admin/create" className="admin-btn admin-btn-primary">
          <FaPenToSquare />写新文章
        </Link>
        <Link href="/admin/images" className="admin-btn admin-btn-secondary">
          <FaImages />管理图片
        </Link>
      </div>

      {/* Article list */}
      <div className="admin-card">
        <h2 className="admin-section-title">最近文章</h2>
        <ul className="admin-list">
          {articles?.length ? (
            articles.map((article, idx) => (
              <ArticleItem key={article.id} article={article} delay={idx * 60} />
            ))
          ) : (
            <li className="admin-empty">
              <span className="admin-empty-icon">📭</span>
              暂无文章，开始写第一篇吧
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
