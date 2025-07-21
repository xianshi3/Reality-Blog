"use client";

import "./edit-article.css";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditArticle() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (data) setForm(data);
      setLoading(false);
    })();
  }, [id]);

  const handleUpdate = async () => {
    if (!form || saving) return;
    if (!form.title) {
      alert("标题不能为空");
      return;
    }

    setSaving(true);

    const { id: _id, ...updateData } = form;
    const { error } = await supabase.from("articles").update(updateData).eq("id", id);

    setSaving(false);

    if (error) {
      alert("更新失败：" + error.message);
    } else {
      router.push("/admin");
    }
  };

  const handleBack = () => {
    router.push("/admin");
  };

  const insertCodeBlock = () => {
    const codeBlockTemplate = "\n```js\n// 这里写代码\n```\n";
    setForm((f: any) => ({
      ...f,
      content: (f.content || "") + codeBlockTemplate,
    }));
  };

  if (loading || !form) {
    return <div className="text-center text-gray-500 mt-20">加载中...</div>;
  }

  return (
    <>
      <button
        onClick={handleBack}
        className="edit-back-button"
        aria-label="返回管理页"
      >
        ← 返回
      </button>

      <div className="edit-container" style={{ paddingTop: "3rem" }}>
        <h2 className="edit-title">编辑文章</h2>

        {/* 插入代码块按钮 */}
        <button
          type="button"
          onClick={insertCodeBlock}
          className="edit-button mb-4"
          style={{ backgroundColor: "#10b981" }} // 绿色按钮
        >
          插入代码块
        </button>

        <input
          className="edit-input"
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="文章标题"
        />

        <input
          className="edit-input"
          value={form.summary || ""}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          placeholder="文章摘要"
        />

        <textarea
          className="edit-textarea"
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="文章内容（支持 Markdown）"
        />

        <input
          className="edit-input"
          value={form.category || ""}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="分类"
        />

        <input
          className="edit-input"
          value={form.tags || ""}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="标签（逗号分隔）"
        />

        <input
          className="edit-input"
          type="date"
          value={form.date || ""}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <button
          onClick={handleUpdate}
          disabled={saving}
          className="edit-button mt-4"
        >
          {saving && <div className="spinner" />}
          {saving ? "保存中..." : "保存修改"}
        </button>
      </div>
    </>
  );
}
