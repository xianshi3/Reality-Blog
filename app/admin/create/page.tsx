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

  // 在内容光标处插入代码块模板
  const insertCodeBlock = () => {
    const codeBlockTemplate = "\n```js\n// 这里写代码\n```\n";
    setForm((f) => ({
      ...f,
      content: f.content + codeBlockTemplate,
    }));
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (!form.title) {
      alert("标题不能为空");
      return;
    }
    setLoading(true);

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

  const handleBack = () => {
    router.push("/admin");
  };

  return (
    <div className="create-bg min-h-screen flex items-center justify-center relative px-6">
      <button
        onClick={handleBack}
        className="create-back-button"
        aria-label="返回管理页"
        type="button"
      >
        ← 返回
      </button>

      <div className="create-card create-layout">
        {/* 左侧内容编辑 */}
        <div className="create-main-content">
          <textarea
            className="create-input create-textarea"
            placeholder="内容 (支持 Markdown 语法)"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            disabled={loading}
          />
        </div>

        {/* 右侧其他字段和按钮 */}
        <div className="create-side-form space-y-4">
          <button
            type="button"
            className="create-btn insert-code-btn"
            onClick={insertCodeBlock}
          >
            插入代码块
          </button>

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
