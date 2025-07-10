"use client";

import { useEffect, useRef, useState } from "react";

interface ParallaxSectionProps {
  backgroundImage: string;
  height?: number;
  children?: React.ReactNode;
}

export default function ParallaxSection({
  backgroundImage,
  height = 400,
  children,
}: ParallaxSectionProps) {
  const [offsetY, setOffsetY] = useState(0); // 页面滚动偏移量
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 }); // 鼠标偏移
  const containerRef = useRef<HTMLDivElement>(null);

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 鼠标移动监听（相对容器中心）
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = (e.clientX - centerX) / rect.width;
    const offsetY = (e.clientY - centerY) / rect.height;

    setMouseOffset({ x: offsetX, y: offsetY });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden"
      style={{ height }}
    >
      {/* 背景图层：结合滚动视差与鼠标偏移 */}
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: `
            translateY(${offsetY * 0.5}px)
            translateX(${mouseOffset.x * 20}px)
            translateY(${mouseOffset.y * 20}px)
            scale(1.05)
          `,
          transition: "transform 0.1s ease-out",
        }}
      />

      {/* 可选遮罩层 */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50" /> */}

      {/* 前景内容层 */}
      <div className="relative z-10 flex items-center justify-center h-full text-white drop-shadow-lg pointer-events-none">
        {children}
      </div>
    </div>
  );
}
