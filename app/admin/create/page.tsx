"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CreateArticle() {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    date: "",
    category: "",
    tags: "",
  });
  const router = useRouter();

  const handleSubmit = async () => {
    const { data, error } = await supabase.from("articles").insert([
      {
        ...form,
        tags: form.tags, // 可以是逗号分隔字符串
      },
    ]);

    if (error) {
      alert("创建失败：" + error.message);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">创建文章</h2>
      <input
        className="w-full border px-3 py-2"
        placeholder="标题"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      {/* 其他字段类似 */}
      <textarea
        className="w-full border px-3 py-2"
        placeholder="内容"
        rows={10}
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        发布
      </button>
    </div>
  );
}
