"use client";
import { useState, useEffect } from "react";
import ArticleSearch from "./ArticleSearch";

interface NavLink {
  href: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", icon: <span>⌂</span>, label: "首页", description: "博客首页" },
  { href: "/category", icon: <span>▤</span>, label: "分类", description: "文章分类" },
  { href: "/ai-chat/fullscreen", icon: <span>✉</span>, label: "AI Chat", description: "LLM" },
  { href: "/about", icon: <span>⚙</span>, label: "关于", description: "关于博客" },
];

interface NavCardProps {
  className?: string;
}

export default function NavCard({ className = "" }: NavCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [activeHref, setActiveHref] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // 检测屏幕宽度并自动设置折叠状态
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsOpen(!mobile); // PC 展开，手机折叠
    };
    handleResize();
    setIsReady(true); // 已检测完，允许渲染
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 获取当前路径（高亮）
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveHref(window.location.pathname);
    }
  }, []);

  const filteredLinks = NAV_LINKS.filter(
    (link) =>
      link.label.toLowerCase().includes(search.toLowerCase()) ||
      link.description?.toLowerCase().includes(search.toLowerCase())
  );

  const cardBaseClass =
    "bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-4 sm:p-5 animate-fadeInUp animate-scaleIn";
  const cardHoverClass =
    "transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl";

  // 在没准备好前不渲染，避免闪烁
  if (!isReady) return null;

  return (
    <div className={`${cardBaseClass} ${cardHoverClass} ${className}`}>
      {/* 标题 + 折叠按钮 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">导航</h3>
        {isMobile && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex justify-center items-center w-9 h-9 rounded-full bg-gray-100 dark:bg-[#2a2f3a] hover:bg-gray-200 dark:hover:bg-[#333844] transition-all duration-300 shadow-sm"
            aria-label="展开/折叠导航"
          >
            <span
              className={`text-xl text-gray-700 dark:text-gray-300 transform transition-transform duration-300 ${
                isOpen ? "rotate-45" : "rotate-0"
              }`}
            >
              {isOpen ? "×" : "☰"}
            </span>
          </button>
        )}
      </div>

      {/* 搜索框组件 */}
      <ArticleSearch value={search} onChange={setSearch} isOpen={isOpen} placeholder="搜索" />

      {/* 导航列表 */}
      <ul
        className={`space-y-3 overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {filteredLinks.length > 0 ? (
          filteredLinks.map(({ href, icon, label, description }) => (
            <li key={label}>
              <a
                href={href}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                  activeHref === href
                    ? "bg-gray-200 dark:bg-[#2a2f3a] border border-gray-300 dark:border-gray-700"
                    : "bg-white dark:bg-[#23272f] hover:bg-gray-100 dark:hover:bg-[#2a2f3a]"
                }`}
              >
                <span
                  className="mr-3 text-2xl flex justify-center items-center w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transform transition-transform duration-300 group-hover:scale-110"
                >
                  {icon}
                </span>

                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{label}</div>
                  {description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-tight">
                      {description}
                    </p>
                  )}
                </div>
              </a>
            </li>
          ))
        ) : (
          <li className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">
            没有匹配的结果
          </li>
        )}
      </ul>
    </div>
  );
}
