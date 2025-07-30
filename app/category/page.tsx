import { createServerSupabase } from "@/lib/supabaseServer";
import type { Article } from "@/types/article";
import Link from "next/link";

import Navbar from "@/components/Navbar";  // 复用首页的导航条
import "./category.css";

export default async function CategoryPage() {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.from("articles").select("*");

  const articles = data as Article[] | null;

  if (error || !articles) {
    return (
      <div className="text-center mt-10 text-red-500">
        无法加载文章数据，请稍后重试。
      </div>
    );
  }

  const groupedByCategory = articles.reduce<Record<string, Article[]>>((acc, article) => {
    const category = article.category || "未分类";
    if (!acc[category]) acc[category] = [];
    acc[category].push(article);
    return acc;
  }, {});

  return (
    <div className="category-page-container pt-14 bg-gray-100">
      <Navbar />

      <main className="category-container">
        {Object.entries(groupedByCategory).map(([category, articles]) => (
          <section key={category} className="category-card">
            <h2 className="category-header-title">
              <span className="category-indicator" />
              {category}（{articles.length} 篇）
            </h2>

            <div className="category-articles-grid">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.id}`}
                  className="article-card"
                >
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={`文章封面 - ${article.title}`}
                      className="article-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="article-image-placeholder">无封面图</div>
                  )}

                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-summary">{article.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
