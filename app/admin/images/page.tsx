"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import "./images.css";

export default function ImageManagerPage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.storage
        .from("article-images")
        .list("", { limit: 100, offset: 0, sortBy: { column: "created_at", order: "desc" } });

      if (error) {
        alert("加载图片失败：" + error.message);
        return;
      }

      const urls = data
        .filter((item) => item.name.match(/\.(jpg|jpeg|png|webp|gif)$/i))
        .map((item) =>
          supabase.storage.from("article-images").getPublicUrl(item.name).data.publicUrl
        );

      setImages(urls);
      setLoading(false);
    };

    fetchImages();
  }, []);

  const handleDelete = async (publicUrl: string) => {
    const fileName = publicUrl.split("/").pop();
    if (!fileName) return;

    const confirm = window.confirm("确定要删除这张图片吗？");
    if (!confirm) return;

    const { error } = await supabase.storage.from("article-images").remove([fileName]);
    if (error) {
      alert("删除失败：" + error.message);
    } else {
      setImages((prev) => prev.filter((url) => url !== publicUrl));
    }
  };

  return (
    <div className="create-bg min-h-screen p-8">
      <button
        onClick={() => router.push("/admin")}
        className="create-back-button mb-4"
        type="button"
      >
        ← 返回后台
      </button>

      <h1 className="text-2xl font-bold mb-6">🖼️ 图片管理</h1>

      {loading ? (
        <p>加载中...</p>
      ) : images.length === 0 ? (
        <p className="text-gray-500">暂无图片</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {images.map((url) => (
            <div key={url} className="relative group border rounded-lg overflow-hidden">
              <img src={url} alt="文章封面" className="w-full h-32 object-cover" />
              <button
                onClick={() => handleDelete(url)}
                className="absolute top-1 right-1 text-white bg-red-500 bg-opacity-80 px-2 py-0.5 text-sm rounded hover:bg-red-700"
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
