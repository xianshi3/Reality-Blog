"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FaTrashCan } from "react-icons/fa6";
import "./images.css";

interface ImageItem {
  name: string;
  size?: number;
  publicUrl: string;
  article?: { id: number; title: string } | null;
}

function ImageSkeleton() {
  return (
    <div className="image-loading">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="image-skeleton" />
      ))}
    </div>
  );
}

export default function ImageManagerPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
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

      const { data: articlesData } = await supabase
        .from("articles")
        .select("id, title, image_url");

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
          try {
            const res = await fetch(img.publicUrl, { method: "HEAD" });
            if (!res.ok) return undefined;
            const length = res.headers.get("content-length");
            return length ? parseInt(length, 10) : undefined;
          } catch {
            return undefined;
          }
        })
      );

      setImages(imgs.map((img, i) => ({ ...img, size: sizes[i] })));
      setLoading(false);
    };

    fetchImages();
  }, []);

  const formatSize = (size?: number) => {
    if (!size || isNaN(size)) return "";
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
    return (size / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleDelete = async (publicUrl: string, name: string) => {
    if (!window.confirm("确定要删除这张图片吗？")) return;
    setDeleting(name);

    const res = await fetch("/api/storage", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setDeleting(null);

    if (!res.ok) {
      const data = await res.json();
      alert("删除失败：" + (data.error || "Unknown error"));
    } else {
      setImages((prev) => prev.filter((img) => img.publicUrl !== publicUrl));
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">
        <span>🖼️</span>图片管理
        {!loading && <span className="admin-stat-label" style={{ fontSize: "0.8rem", fontWeight: 400 }}>({images.length})</span>}
      </h1>

      {loading ? (
        <ImageSkeleton />
      ) : images.length === 0 ? (
        <p className="image-empty">
          <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>🖼️</span>
          暂无图片
        </p>
      ) : (
        <div className="image-grid">
          {images.map(({ publicUrl, size, name, article }, idx) => (
            <div
              key={publicUrl}
              className="image-card"
              style={{ animationDelay: `${idx * 30}ms` }}
              title={article?.title || "未关联文章"}
            >
              <img src={publicUrl} alt={article?.title || "文章封面"} loading="lazy" />
              <div className="image-info">
                <p className="image-title">{article?.title || "未关联文章"}</p>
                {size && <span className="image-size">{formatSize(size)}</span>}
              </div>
              <button
                onClick={() => handleDelete(publicUrl, name)}
                className="image-delete-btn"
                disabled={deleting === name}
                aria-label={`删除图片 ${name}`}
              >
                <FaTrashCan />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
