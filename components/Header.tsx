import Navbar from "./Navbar";
import ParallaxSection from "./ParallaxSection";

export default function Header() {
  return (
    <header className="home-header">
      {/* 固定导航条 */}
      <Navbar />
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        <ParallaxSection backgroundImage="/parallax-bg.jpg" height={400}>
          {/* 可在此处填充内容 */}
        </ParallaxSection>
      </div>
    </header>
  );
}