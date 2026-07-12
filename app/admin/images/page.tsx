"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import "./images.css";

interface ImageItem {
  name: string;
  size?: number;
  publicUrl: string;
  article?: { id: number; title: string } | null;
}

export default function ImageManagerPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchImageSize(url: string): Promise<number | undefined> {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (!res.ok) return undefined;
      const length = res.headers.get("content-length");
      return length ? parseInt(length, 10) : undefined;
    } catch {
      return undefined;
    }
  }

  useEffect(() => {
    const fetchImagesAndArticles = async () => {
      const { data, error } = await supabase.storage
        .from("article-images")
        .list("", {
          limit: 1000,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        alert("加载图片失败：" + error.message);
        setLoading(false);
        return;
      }
      if (!data) {
        setLoading(false);
        return;
      }

      const files = data.filter((item) =>
        /\.(jpg|jpeg|png|webp|gif)$/i.test(item.name)
      );

      const { data: articlesData, error: articlesError } = await supabase
        .from("articles")
        .select("id, title, image_url");

      if (articlesError) {
        alert("加载文章信息失败：" + articlesError.message);
      }

      const imgs: ImageItem[] = files.map((item) => {
        const { data: urlData } = supabase.storage
          .from("article-images")
          .getPublicUrl(item.name);

        const relatedArticle = articlesData?.find((art) => {
          if (!art.image_url) return false;
          const artFileName = art.image_url.split("/").pop();
          return artFileName === item.name;
        });

        return {
          name: item.name,
          publicUrl: urlData.publicUrl,
          size: undefined,
          article: relatedArticle
            ? { id: relatedArticle.id, title: relatedArticle.title }
            : null,
        };
      });

      const sizes = await Promise.all(
        imgs.map(async (img) => {
          const size = await fetchImageSize(img.publicUrl);
          return size;
        })
      );

      setImages(imgs.map((img, i) => ({ ...img, size: sizes[i] })));

      setLoading(false);
    };

    fetchImagesAndArticles();
  }, []);

  const formatSize = (size?: number) => {
    if (!size || isNaN(size)) return "未知大小";
    if (size < 1024) return size + " B";
    else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
    else return (size / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleDelete = async (publicUrl: string, name: string) => {
    if (!window.confirm("确定要删除这张图片吗？")) return;

    const res = await fetch("/api/storage", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert("删除失败：" + (data.error || "Unknown error"));
    } else {
      setImages((prev) => prev.filter((img) => img.publicUrl !== publicUrl));
    }
  };

  return (
    <div>
      <h1 className="admin-page-title"><span>🖼️</span>图片管理</h1>

      {loading ? (
        <p className="loading-text">加载中...</p>
      ) : images.length === 0 ? (
        <p className="no-images">暂无图片</p>
      ) : (
        <div className="image-grid">
          {images.map(({ publicUrl, size, name, article }) => (
            <div
              key={publicUrl}
              className="image-card"
              title={article?.title || "未关联文章"}
            >
              <img
                src={publicUrl}
                alt={article?.title || "文章封面"}
                loading="lazy"
              />
              <div className="image-info">
                <p className="image-title">{article?.title || "未关联文章"}</p>
                <p className="image-size">{formatSize(size)}</p>
              </div>
              <button
                onClick={() => handleDelete(publicUrl, name)}
                className="delete-button"
                type="button"
                aria-label={`删除图片 ${name}`}
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
