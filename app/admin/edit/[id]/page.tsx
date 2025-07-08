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
    if (!form) return;

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

  if (loading || !form) {
    return <div className="text-center text-gray-500 mt-20">加载中...</div>;
  }

  return (
    <div className="edit-container">
      <h2 className="edit-title">编辑文章</h2>

      <input
        className="edit-input"
        value={form.title || ""}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="文章标题"
      />

      <textarea
        className="edit-textarea"
        value={form.content || ""}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        placeholder="文章内容"
      />

      <button
        onClick={handleUpdate}
        disabled={saving}
        className="edit-button"
      >
        {saving && <div className="spinner" />}
        {saving ? "保存中..." : "保存"}
      </button>
    </div>
  );
}
