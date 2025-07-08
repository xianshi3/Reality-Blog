import Link from "next/link";
import { createServerSupabase } from "@/lib/supabaseServer";
import ArticleItem from "@/components/ArticleItem";
import "./admin.css";

export default async function AdminPage() {
  const supabase = await createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="admin-bg flex items-center justify-center min-h-screen">
        <div className="admin-card animate-fade-in-down">
          <p className="text-gray-600 text-lg">
            未登录，请先{" "}
            <a href="/login" className="text-blue-500 underline font-semibold hover:text-blue-700 transition">
              登录页面
            </a>
          </p>
        </div>
      </div>
    );
  }

  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, date")
    .order("date", { ascending: false });

  return (
    <div className="admin-bg min-h-screen py-12">
      <div className="admin-card max-w-3xl mx-auto animate-fade-in-up">
        <h1 className="admin-title flex items-center gap-2">
          <span className="admin-emoji">📝</span>
          博客管理后台
        </h1>
        <Link href="/admin/create" className="admin-create-btn">
          ➕ 新建文章
        </Link>

        <ul className="admin-list">
          {articles?.length ? (
            articles.map((article, idx) => (
              <ArticleItem key={article.id} article={article} delay={idx * 60} />
            ))
          ) : (
            <li className="admin-empty">
              <span className="admin-empty-icon">📭</span>
              暂无文章
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
