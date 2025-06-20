"use client";
import React, { useState } from "react";

export default function LikeButton({ articleId }: { articleId: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setCount(count + 1);
    // 可在此处添加API请求同步点赞
    // await fetch(`/api/article/${articleId}/like`, { method: "POST" });
  };

  return (
    <button
      className={`flex items-center gap-1 px-3 py-1 rounded-full border transition ${
        liked
          ? "bg-pink-100 text-pink-600 border-pink-200"
          : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-pink-50"
      }`}
      onClick={handleLike}
      disabled={liked}
      aria-label="点赞"
    >
      <span className="text-lg">{liked ? "❤️" : "🤍"}</span>
      <span className="text-sm">{count > 0 ? count : "点赞"}</span>
    </button>
  );
}