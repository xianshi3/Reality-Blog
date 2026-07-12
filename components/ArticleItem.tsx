"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ArticleItem({
  article,
  delay = 0,
}: {
  article: { id: string; title: string; date?: string };
  delay?: number;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = confirm(`确定要删除文章「${article.title}」吗？`);
    if (!confirmDelete) return;

    setIsDeleting(true);
    const res = await fetch("/api/article", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: article.id }),
    });
    setIsDeleting(false);

    if (!res.ok) {
      const data = await res.json();
      alert("删除失败：" + (data.error || "Unknown error"));
    } else {
      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <li className="admin-list-item" style={{ animationDelay: `${delay}ms` }}>
      <div>
        <span className="admin-article-title">{article.title}</span>
        <span className="admin-article-date">
          {article.date && new Date(article.date).toLocaleDateString()}
        </span>
      </div>

      <div className="admin-btns">
        <Link href={`/admin/edit/${article.id}`} className="admin-edit-link">
          编辑
        </Link>
        <button
          onClick={handleDelete}
          className="admin-delete-btn flex items-center gap-2"
          disabled={isDeleting}
        >
          {isDeleting && <span className="delete-spinner" />}
          {isDeleting ? "删除中..." : "删除"}
        </button>
      </div>
    </li>
  );
}
