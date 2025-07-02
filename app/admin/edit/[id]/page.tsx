"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditArticle() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("articles").select("*").eq("id", id).single();
      setForm(data);
    })();
  }, [id]);

  const handleUpdate = async () => {
    const { error } = await supabase.from("articles").update(form).eq("id", id);
    if (error) alert("更新失败：" + error.message);
    else router.push("/admin");
  };

  if (!form) return <div>加载中...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">编辑文章</h2>
      <input
        className="w-full border px-3 py-2 mb-2"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      {/* 其他字段类似 */}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleUpdate}
      >
        保存
      </button>
    </div>
  );
}
