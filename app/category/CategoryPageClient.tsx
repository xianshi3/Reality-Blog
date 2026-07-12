"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Article } from "@/types/article";
import Link from "next/link";
import { parseTags } from "@/lib/parseTags";

import Navbar from "@/components/Navbar";
import "./category.css";
import Footer from "@/components/Footer";

interface Props {
  articles: Article[];
}

function getFilterLabel(selected: string): string {
  if (selected === "全部" || !selected) return "全部";
  return selected;
}

export default function CategoryPageClient({ articles }: Props) {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const tagFromUrl = searchParams.get("tag");

  const activeFilter = categoryFromUrl || tagFromUrl || "全部";
  const filterType = tagFromUrl ? "tag" : categoryFromUrl ? "category" : "all";

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(articles.map((art) => art.category || "未分类"))
    );
    cats.sort((a, b) => a.localeCompare(b));
    return cats;
  }, [articles]);

  const [selectedCategory, setSelectedCategory] = useState<string>(activeFilter);
  const [currentFilterType, setCurrentFilterType] = useState<"category" | "tag" | "all">(filterType);

  useEffect(() => {
    setSelectedCategory(activeFilter);
    setCurrentFilterType(filterType);
  }, [categoryFromUrl, tagFromUrl]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === "全部") return articles;

    if (currentFilterType === "tag") {
      return articles.filter((art) => {
        const tags = parseTags(art.tags);
        return tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());
      });
    }

    return articles.filter(
      (art) => (art.category || "未分类") === selectedCategory
    );
  }, [selectedCategory, currentFilterType, articles]);

  const groupedByCategory = useMemo(() => {
    return filteredArticles.reduce<Record<string, Article[]>>(
      (acc, article) => {
        const category = article.category || "未分类";
        if (!acc[category]) acc[category] = [];
        acc[category].push(article);
        return acc;
      },
      {}
    );
  }, [filteredArticles]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentFilterType(cat === "全部" ? "all" : "category");
  };

  return (
    <div className="category-page-container pt-14 bg-gray-100">
      <Navbar />

      <div className="category-filter-container">
        <button
          className={`category-filter-btn ${
            selectedCategory === "全部" ? "active" : ""
          }`}
          onClick={() => handleCategorySelect("全部")}
        >
          全部
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-filter-btn ${
              selectedCategory === cat && currentFilterType === "category" ? "active" : ""
            }`}
            onClick={() => handleCategorySelect(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {currentFilterType === "tag" && selectedCategory !== "全部" && (
        <div className="category-filter-container tag-active-hint">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            标签筛选：
          </span>
          <span className="category-filter-btn active tag-badge">
            #{selectedCategory}
          </span>
          <button
            className="category-filter-btn"
            onClick={() => handleCategorySelect("全部")}
          >
            清除筛选
          </button>
        </div>
      )}

      <main className="category-container">
        {Object.keys(groupedByCategory).length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <p className="text-lg">没有匹配的文章</p>
            <button
              className="mt-4 text-sm text-blue-500 hover:underline"
              onClick={() => handleCategorySelect("全部")}
            >
              查看全部文章
            </button>
          </div>
        ) : (
          Object.entries(groupedByCategory).map(([category, articles]) => (
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
                        alt={article.title}
                        className="article-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="article-image-placeholder">
                        无封面图
                      </div>
                    )}

                    <h3 className="category-article-title">
                      {article.title}
                    </h3>
                    <p className="category-article-summary">
                      {article.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <Footer currentYear={new Date().getFullYear()} />
    </div>
  );
}
