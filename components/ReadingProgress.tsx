"use client";
import React, { useEffect, useState } from "react";

/**
 * 阅读进度条组件
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
    // 顶部进度条容器
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      {/* 进度条本体 */}
      <div
        className="bg-blue-500 h-1 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}