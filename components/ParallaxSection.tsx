"use client";

import { useEffect, useState } from "react";

/**
 * 视差滚动组件
 *
 * 用于创建带有背景视差效果的页面部分区域。
 *
 * @param backgroundImage 背景图片的路径（必填）
 * @param height 区块高度，单位为 px，默认为 400
 * @param children 前景内容（位于视差背景之上的子组件）
 */
interface ParallaxSectionProps {
  backgroundImage: string;         // 背景图路径
  height?: number;                 // 高度，默认 400
  children?: React.ReactNode;     // 子内容，可为文字、按钮等
}

/**
 * ParallaxSection 主组件
 */
export default function ParallaxSection({
  backgroundImage,
  height = 400,
  children,
}: ParallaxSectionProps) {
  const [offsetY, setOffsetY] = useState(0); // 页面滚动偏移量

  // 监听页面滚动，更新偏移量实现视差效果
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);

    // 卸载时移除监听器
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative overflow-hidden" style={{ height: height }}>
      {/* 背景图层，添加滚动位移产生视差效果 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: `translateY(${offsetY * 0.5}px)`, // 控制滚动速度比例
          transition: "transform 0.1s", // 平滑过渡
        }}
      />

      {/* 可选遮罩层：用于增强文字可读性 */}
      {/* 如不需要遮罩，可将下面这行注释或删除 */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50" /> */}

      {/* 内容层，位于背景图之上 */}
      <div className="relative z-10 flex items-center justify-center h-full text-white drop-shadow-lg">
        {children}
      </div>
    </div>
  );
}
