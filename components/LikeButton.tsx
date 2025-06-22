"use client";
import React, { useState } from "react";

export default function LikeButton({ articleId }: { articleId: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    if (liked) return;
    
    setIsAnimating(true);
    setLiked(true);
    setCount(count + 1);
    
    // 可在此处添加API请求同步点赞
    // await fetch(`/api/article/${articleId}/like`, { method: "POST" });
    
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
        liked
          ? "bg-pink-50/80 text-pink-600 border-pink-300 shadow-pink-100 shadow-sm"
          : "bg-white text-gray-500 border-gray-200 hover:bg-pink-50/50 hover:text-pink-500"
      } ${isAnimating ? "scale-110" : "scale-100"}`}
      onClick={handleLike}
      disabled={liked}
      aria-label="点赞"
    >
      <span className={`text-xl transition-all duration-300 ${isAnimating ? "scale-125" : "scale-100"}`}>
        {liked ? (
          <span className="relative">
            <span className="absolute inset-0 animate-ping opacity-75">❤️</span>
            ❤️
          </span>
        ) : (
          "🤍"
        )}
      </span>
      <span className="text-sm font-medium">
        {count > 0 ? (
          <span className={`inline-block ${isAnimating ? "animate-bounce" : ""}`}>
            {count}
          </span>
        ) : (
          "点赞"
        )}
      </span>
    </button>
  );
}