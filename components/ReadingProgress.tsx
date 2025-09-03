"use client";
import React, { useEffect, useState } from "react";

/**
 * 阅读进度条组件（美化版）
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0); // 当前进度百分比

  useEffect(() => {
    // 滚动时计算进度
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(percent);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // 顶部进度条容器（带阴影和渐变）
    <div className="fixed top-0 left-0 w-full h-2 z-50 pointer-events-none">
      {/* 进度条本体（渐变、圆角、阴影、动画） */}
      <div
        className="h-full rounded-b transition-all duration-300 shadow-lg"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
          boxShadow: "0 2px 8px rgba(59,130,246,0.15)",
        }}
      />
    </div>
  );
}