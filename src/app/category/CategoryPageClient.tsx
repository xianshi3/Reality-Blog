"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Article } from "@/types/article";
import Link from "next/link";
import { parseTags } from "@/lib/parseTags";
import { FiSearch, FiX } from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";

import "./category.css";
import Footer from "@/components/layout/Footer";

interface Props {
  articles: Article[];
}

export default function CategoryPageClient({ articles }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFromUrl = searchParams.get("category");
  const tagFromUrl = searchParams.get("tag");
  const queryFromUrl = searchParams.get("q");

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
  const [searchQuery, setSearchQuery] = useState(queryFromUrl || "");
  const searchRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSelectedCategory(activeFilter);
    setCurrentFilterType(filterType);
  }, [categoryFromUrl, tagFromUrl]);

  useEffect(() => {
    setSearchQuery(queryFromUrl || "");
  }, [queryFromUrl]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current !== null) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const updateUrl = useCallback((q: string) => {
    if (searchTimerRef.current !== null) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("q", q);
      else params.delete("q");
      router.replace(`/category?${params.toString()}`, { scroll: false });
    }, 300);
  }, [searchParams, router]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateUrl(val);
  };

  const clearSearch = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.replace(`/category?${params.toString()}`, { scroll: false });
    searchRef.current?.focus();
  };

  const filteredByCategory = useMemo(() => {
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

  const searchedArticles = useMemo(() => {
    if (!searchQuery.trim()) return filteredByCategory;
    const q = searchQuery.toLowerCase();
    return filteredByCategory.filter((art) => {
      if (art.title.toLowerCase().includes(q)) return true;
      if (art.summary?.toLowerCase().includes(q)) return true;
      const tags = parseTags(art.tags);
      if (tags.some((t) => t.toLowerCase().includes(q))) return true;
      if (art.category?.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [searchQuery, filteredByCategory]);

  const groupedByCategory = useMemo(() => {
    return searchedArticles.reduce<Record<string, Article[]>>(
      (acc, article) => {
        const category = article.category || "未分类";
        if (!acc[category]) acc[category] = [];
        acc[category].push(article);
        return acc;
      },
      {}
    );
  }, [searchedArticles]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentFilterType(cat === "全部" ? "all" : "category");
  };

  const totalResults = searchedArticles.length;
  const hasActiveFilter = selectedCategory !== "全部" || currentFilterType === "tag";

  return (
    <div className="category-page-container pt-14 bg-gray-100">
      <Navbar />

      <div className="category-filter-container">
        <button
          className={`category-filter-btn ${
            selectedCategory === "全部" && currentFilterType !== "tag" ? "active" : ""
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

      <div className="category-search-container">
        <div className="category-search-wrapper">
          <FiSearch className="category-search-icon" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="搜索文章标题、摘要、标签..."
            className="category-search-input"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="category-search-clear">
              <FiX />
            </button>
          )}
        </div>
        {searchQuery && (
          <span className="category-search-count">
            找到 {totalResults} 篇
          </span>
        )}
        {hasActiveFilter && !searchQuery && (
          <span className="category-search-count">
            {totalResults} 篇
          </span>
        )}
      </div>

      <main className="category-container">
        {Object.keys(groupedByCategory).length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <p className="text-lg">没有匹配的文章</p>
            {(searchQuery || hasActiveFilter) && (
              <button
                className="mt-4 text-sm text-blue-500 hover:underline"
                onClick={() => {
                  setSearchQuery("");
                  handleCategorySelect("全部");
                  const params = new URLSearchParams();
                  router.replace("/category", { scroll: false });
                }}
              >
                清除所有筛选
              </button>
            )}
          </div>
        ) : (
          Object.entries(groupedByCategory).map(([category, arts]) => (
            <section key={category} className="category-card">
              <h2 className="category-header-title">
                <span className="category-indicator" />
                {category}（{arts.length} 篇）
              </h2>

              <div className="category-articles-grid">
                {arts.map((article) => (
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
