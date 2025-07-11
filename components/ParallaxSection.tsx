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
  const [isMobile, setIsMobile] = useState(false);

  // 判断是否为移动端
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 鼠标移动监听
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
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
      style={{
        height: isMobile ? 200 : height, // 小屏自动缩小高度
      }}
    >
      {/* 背景图层 */}
      <div
        className={`
          absolute inset-0 
          bg-no-repeat bg-center 
          ${isMobile ? "bg-contain" : "bg-cover"} 
          will-change-transform
        `}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: isMobile
            ? "scale(1)"
            : `
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
