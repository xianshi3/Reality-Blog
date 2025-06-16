"use client";

import { useEffect, useState } from "react";

interface ParallaxSectionProps {
  backgroundImage: string; // 背景图片路径
  height?: number;         // 高度，默认为 400
  children?: React.ReactNode; // 子组件内容
}

export default function ParallaxSection({
  backgroundImage,
  height = 400,
  children,
}: ParallaxSectionProps) {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative overflow-hidden" style={{ height: height }}>
      {/* 背景层实现视差效果 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: `translateY(${offsetY * 0.5}px)`,
          transition: "transform 0.1s",
        }}
      />
      {/* 可选遮罩层，如不需要可移除或调整颜色透明度 */}
      {/* 删除或修改下面这行代码以修复图片上方黑色效果 */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50" /> */}
      
      {/* 内容层 */}
      <div className="relative z-10 flex items-center justify-center h-full text-white drop-shadow-lg">
        {children}
      </div>
    </div>
  );
}