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

      {/* 视差背景区，居中显示，带圆角和动画 */}
      <div
        style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}
        className="overflow-hidden rounded-3xl shadow-xl animate-fadeInDown transition-transform duration-700 ease-in-out hover:scale-105"
      >
        <ParallaxSection backgroundImage="/parallax-bg.jpg" height={400}>
          {/* 可在此处填充内容 */}
        </ParallaxSection>
      </div>
    </>
  );
}