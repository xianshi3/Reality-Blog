// components/DeleteButton.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";

export default function DeleteButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (!confirm("确定删除这篇文章吗？")) return;

    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      alert("删除失败：" + error.message);
    } else {
      location.reload(); // 简单粗暴：刷新页面
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:underline"
    >
      删除
    </button>
  );
}
