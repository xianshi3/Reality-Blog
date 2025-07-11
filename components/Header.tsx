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

      {/* 视差背景区：响应式居中，圆角动画 */}
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl shadow-xl animate-fadeInDown transition-transform duration-700 ease-in-out hover:scale-105 sm:hover:scale-100">
          <ParallaxSection backgroundImage="/parallax-bg.jpg" />
        </div>
      </div>
    </>
  );
}
