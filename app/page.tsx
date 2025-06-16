import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import MainContent from "../components/MainContent";
import RightSidebar from "../components/RightSidebar";
import Footer from "../components/Footer";

/**
 * Home 组件是博客首页的主入口，负责组织页面的整体布局和数据传递。
 *
 * - 展示博客文章列表、标签、推荐内容等。
 * - 使用 Header、Footer、LeftSidebar、MainContent、RightSidebar 等子组件进行页面分区。
 * - 通过 props 向 Footer 传递当前年份，向 MainContent、RightSidebar 传递文章、标签和推荐数据。
 *
 * @component
 * @returns {JSX.Element} 博客首页布局
 */
export default function Home() {
  const currentYear = new Date().getFullYear();

  const articles = [
    {
      title: "博客文章标题一",
      date: "2024-06-01",
      category: "技术",
      summary:
        "这里是一段文章摘要，简要介绍文章内容，吸引读者点击阅读全文。",
      link: "#",
    },
    {
      title: "博客文章标题二",
      date: "2024-05-20",
      category: "生活",
      summary:
        "这里是一段文章摘要，简要介绍文章内容，吸引读者点击阅读全文。",
      link: "#",
    },
  ];

  const tags = [
    "JavaScript",
    "React",
    "生活",
    "设计",
    "全栈",
    "Tailwind",
    "Next.js",
  ];
  const recommends = [
    "深入理解 React",
    "Vite 与 Webpack 对比",
    "使用 Tailwind 构建博客",
  ];

  return (
    <div className="home-container pt-16 bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto flex flex-col lg:flex-row w-full max-w-6xl px-4 gap-6 py-8">
        <LeftSidebar />
        <MainContent articles={articles} />
        <RightSidebar tags={tags} recommends={recommends} />
      </main>
      <Footer currentYear={currentYear} />
    </div>
  );
}