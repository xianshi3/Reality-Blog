"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import "./create-article.css";

const TOOLBAR_ACTIONS = [
  { label: "H1", markdown: "# " },
  { label: "H2", markdown: "## " },
  { label: "H3", markdown: "### " },
  { label: "代码块", markdown: "\n```\n\n```\n" },
  { label: "序列号", markdown: "1. " },
  { label: "列表", markdown: "- " },
  { label: "加粗", markdown: "**加粗内容**" },
  { label: "斜体", markdown: "*斜体内容*" },
];

export default function CreateArticle() {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    date: "",
    category: "",
    tags: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
  };

  const handleToolbarInsert = (markdown: string) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content + markdown,
    }));
  };

  const handleSubmit = async () => {
    if (loading || !form.title) {
      alert("标题不能为空");
      return;
    }

    setLoading(true);
    let imageUrl = "";

    if (imageFile) {
      setUploading(true);
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      try {
        const { error: uploadError } = await supabase.storage
          .from("article-images")
          .upload(fileName, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("article-images").getPublicUrl(fileName);
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

    const insertData: any = { ...form };
    if (imageUrl) insertData.image_url = imageUrl;
    if (!form.date) delete insertData.date;
    if (!form.summary) delete insertData.summary;
    if (!form.content) delete insertData.content;
    if (!form.category) delete insertData.category;
    if (!form.tags) delete insertData.tags;

    const { error } = await supabase.from("articles").insert([insertData]);
    setLoading(false);
    if (error) {
      alert("创建失败：" + error.message);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="editor-wrapper">
      <header className="editor-header">
        <button onClick={() => router.push("/admin")} className="editor-back">← 返回</button>
        <h1 className="editor-title">撰写新文章</h1>
      </header>

      <main className="editor-container">
        <section className="editor-main">
          <input
            type="text"
            placeholder="输入标题..."
            className="editor-input-title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <div className="editor-toolbar">
            {TOOLBAR_ACTIONS.map((action) => (
              <button
                key={action.label}
                className="toolbar-button"
                onClick={() => handleToolbarInsert(action.markdown)}
              >
                {action.label}
              </button>
            ))}
          </div>

          <textarea
            className="editor-textarea"
            placeholder="写下你的文章内容，支持 Markdown..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </section>

        <aside className="editor-sidebar">
          <label htmlFor="image-upload" className="editor-upload-label">
            {uploading ? "上传中..." : imageFile ? "更换封面图片" : "上传封面图片"}
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
              className="editor-image-preview"
            />
          )}

          <input
            className="editor-input"
            placeholder="摘要"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
          <input
            className="editor-input"
            placeholder="分类"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            className="editor-input"
            placeholder="标签（逗号分隔）"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <input
            className="editor-input"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </aside>
      </main>

      <footer className="editor-footer">
        <button className="editor-publish-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "发布中..." : "发布文章"}
        </button>
      </footer>
    </div>
  );
}
