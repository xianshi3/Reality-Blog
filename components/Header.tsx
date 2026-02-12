/**
 * Header 头部组件
 *
 * @module Header
 */

import Navbar from "./Navbar";
import ParallaxSection from "./ParallaxSection";

/**
 * Header 组件
 * 渲染顶部导航和带圆角及动画的视差背景区
 */
export default function Header() {
  return (
    <>
      {/* 顶部导航条容器 */}
      <div className="navbar-container">
        <Navbar />
      </div>

      {/* 视差背景区   更新：删除了圆角 rounded-3xl */}
      <div className="overflow-hidden shadow-xl animate-fadeInDown transition-transform duration-700 ease-in-out hover:scale-105 sm:hover:scale-100">
        <ParallaxSection 
          backgroundImage="/parallax-bg.png" 
          height={450} 
        />
      </div>
    </>
  );
}
