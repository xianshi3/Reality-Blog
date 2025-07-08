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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (loading) return; // 防止重复提交
    if (!form.title) {
      alert("标题不能为空");
      return;
    }
    setLoading(true);

    // 构造插入对象，避免空字符串传给 timestamp 字段
    const insertData: any = { ...form };
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
    <div className="create-bg min-h-screen flex items-center justify-center">
      <div className="create-card animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-6 text-center tracking-wide">创建文章</h2>
        <div className="space-y-4">
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
          <textarea
            className="create-input"
            placeholder="内容"
            rows={10}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            disabled={loading}
          />
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