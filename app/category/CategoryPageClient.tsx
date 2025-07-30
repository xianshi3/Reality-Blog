"use client";

import { useState, useMemo } from "react";
import type { Article } from "@/types/article";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import "./category.css";

interface Props {
  articles: Article[];
}

export default function CategoryPageClient({ articles }: Props) {
  // 提取所有分类，按字母排序
  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(articles.map((art) => art.category || "未分类"))
    );
    cats.sort((a, b) => a.localeCompare(b));
    return cats;
  }, [articles]);

  const [selectedCategory, setSelectedCategory] = useState<string>("全部");

  // 筛选文章
  const filteredArticles = useMemo(() => {
    if (selectedCategory === "全部") return articles;
    return articles.filter((art) => (art.category || "未分类") === selectedCategory);
  }, [selectedCategory, articles]);

  // 按分类分组（筛选后）
  const groupedByCategory = useMemo(() => {
    return filteredArticles.reduce<Record<string, Article[]>>((acc, article) => {
      const category = article.category || "未分类";
      if (!acc[category]) acc[category] = [];
      acc[category].push(article);
      return acc;
    }, {});
  }, [filteredArticles]);

  return (
    <div className="category-page-container pt-14 bg-gray-100">
      <Navbar />

      {/* 分类筛选按钮区 */}
      <div className="category-filter-container">
        <button
          className={`category-filter-btn ${selectedCategory === "全部" ? "active" : ""}`}
          onClick={() => setSelectedCategory("全部")}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-filter-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

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

                  <h3 className=".category-article-title">{article.title}</h3>
                  <p className=".category-article-summary">{article.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
