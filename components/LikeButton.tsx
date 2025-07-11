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

    // 这里可以调用后端接口同步点赞
    // await fetch(`/api/article/${articleId}/like`, { method: "POST" });

    setTimeout(() => setIsAnimating(false), 1000);
  };

  // 按钮样式，利用 CSS 变量
  const baseStyle = {
    backgroundColor: liked ? "var(--like-active-bg)" : "var(--like-bg)",
    color: liked ? "var(--like-active-text)" : "var(--like-text)",
    borderColor: liked ? "var(--like-active-border)" : "var(--like-border)",
    boxShadow: liked
      ? `0 2px 8px var(--like-shadow)`
      : "none",
    transform: isAnimating ? "scale(1.1)" : "scale(1)",
  };

  const iconStyle = {
    transform: isAnimating ? "scale(1.25)" : "scale(1)",
    transition: "transform 0.3s ease",
  };

  const countStyle = {
    animation: isAnimating ? "bounce 0.5s" : "none",
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      aria-label="点赞"
      style={baseStyle}
      className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 select-none cursor-pointer disabled:cursor-default"
      onMouseEnter={e => {
        if (!liked) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--like-bg-hover)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--like-active-text)";
        }
      }}
      onMouseLeave={e => {
        if (!liked) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--like-bg)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--like-text)";
        }
      }}
    >
      <span style={iconStyle} className="text-xl transition-transform duration-300">
        {liked ? (
          <span className="relative">
            <span className="absolute inset-0 animate-ping opacity-75">❤️</span>
            ❤️
          </span>
        ) : (
          "🤍"
        )}
      </span>
      <span className="text-sm font-medium" style={countStyle}>
        {count > 0 ? count : "点赞"}
      </span>
    </button>
  );
}
