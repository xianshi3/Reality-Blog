"use client";
import React, { useState, useEffect } from "react";

interface LikeButtonProps {
  articleId: string;
  initialLikes?: number;
}

export default function LikeButton({ articleId, initialLikes = 0 }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setCount(initialLikes);
  }, [initialLikes]);

  const handleLike = async () => {
    if (liked) return;

    setIsAnimating(true);
    setLiked(true);

    try {
      const res = await fetch(`/api/article/${articleId}/like`, {
        method: "POST",
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "点赞失败");
        setLiked(false);
        setIsAnimating(false);
        return;
      }

      const json = await res.json();
      setCount(json.likes);
    } catch (error) {
      alert("网络错误，点赞失败");
      setLiked(false);
    }

    setTimeout(() => setIsAnimating(false), 1000);
  };

  const baseStyle = {
    backgroundColor: liked ? "var(--like-active-bg)" : "var(--like-bg)",
    color: liked ? "var(--like-active-text)" : "var(--like-text)",
    borderColor: liked ? "var(--like-active-border)" : "var(--like-border)",
    boxShadow: liked ? `0 2px 8px var(--like-shadow)` : "none",
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
      onMouseEnter={(e) => {
        if (!liked) {
          const el = e.currentTarget;
          el.style.backgroundColor = "var(--like-bg-hover)";
          el.style.color = "var(--like-active-text)";
        }
      }}
      onMouseLeave={(e) => {
        if (!liked) {
          const el = e.currentTarget;
          el.style.backgroundColor = "var(--like-bg)";
          el.style.color = "var(--like-text)";
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
        {count}
      </span>
    </button>
  );
}
