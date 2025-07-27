"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import "./create-article.css";

export default function CreateArticle() {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    date: "",
    category: "",
    tags: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null); // 保存选中的文件
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // 图片选择时只保存文件，不上传
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
  };

  // 点击发布按钮时调用
  const handleSubmit = async () => {
    if (loading) return;
    if (!form.title) {
      alert("标题不能为空");
      return;
    }

    setLoading(true);

    let imageUrl = "";

    // 如果选了图片，先上传
    if (imageFile) {
      setUploading(true);
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      try {
        const { error: uploadError } = await supabase.storage
          .from('article-images')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('article-images').getPublicUrl(fileName);
        if (!data?.publicUrl) throw new Error("获取图片地址失败");
        imageUrl = data.publicUrl;
      } catch (error: any) {
        alert("图片上传失败：" + error.message);
        setUploading(false);
        setLoading(false);
        return;
      }
      setUploading(false);
    }

    // 准备要插入的数据
    const insertData: any = { ...form };
    if (imageUrl) insertData.image_url = imageUrl;
    if (!form.date) delete insertData.date;
    if (!form.summary) delete insertData.summary;
    if (!form.content) delete insertData.content;
    if (!form.category) delete insertData.category;
    if (!form.tags) delete insertData.tags;

    // 插入文章数据
    const { error } = await supabase.from("articles").insert([insertData]);

    setLoading(false);
    if (error) {
      alert("创建失败：" + error.message);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="create-bg min-h-screen flex items-center justify-center relative px-6">
      <button
        onClick={() => router.push("/admin")}
        className="create-back-button"
        aria-label="返回管理页"
        type="button"
      >
        ← 返回
      </button>

      <div className="create-card create-layout">
        <div className="create-main-content">
          <textarea
            className="create-input create-textarea"
            placeholder="内容 (支持 Markdown 语法)"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="create-side-form space-y-4">
          {/* 插入代码按钮 */}
          <button
            type="button"
            className="create-btn insert-code-btn"
            onClick={() => {
              setForm((f) => ({
                ...f,
                content: f.content + "\n```js\n// 这里写代码\n```\n",
              }));
            }}
            disabled={loading}
          >
            插入代码块
          </button>

          {/* 图片选择按钮 */}
          <div>
            <label htmlFor="image-upload" className="create-btn cursor-pointer">
              {uploading ? "上传中..." : imageFile ? "更改图片" : "选择封面图片"}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={uploading || loading}
              className="hidden"
            />
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="预览封面"
                className="mt-2 max-h-40 object-contain rounded-lg border"
              />
            )}
          </div>

          {/* 表单输入项 */}
          <input
            className="create-input"
            placeholder="标题"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            disabled={loading}
          />
          <input
            className="create-input"
            placeholder="摘要"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            disabled={loading}
          />
          <input
            className="create-input"
            placeholder="分类"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            disabled={loading}
          />
          <input
            className="create-input"
            placeholder="标签（逗号分隔）"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            disabled={loading}
          />
          <input
            className="create-input"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            disabled={loading}
          />

          {/* 发布按钮 */}
          <button
            className={`create-btn ${loading ? "create-btn-loading" : ""}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <span className="loader"></span> : "发布"}
          </button>
        </div>
      </div>
    </div>
  );
}
