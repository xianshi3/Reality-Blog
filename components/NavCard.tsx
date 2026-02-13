"use client";
import { useState, useEffect } from "react";
import { FiHome, FiGrid, FiMessageSquare, FiInfo } from "react-icons/fi"; // react-icons
import ArticleSearch from "./ArticleSearch";
import type { Article } from "../types/article";

interface NavLink {
  href: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", icon: <FiHome />, label: "首页", description: "博客首页" },
  { href: "/category", icon: <FiGrid />, label: "分类", description: "文章分类" },
  { href: "/ai-chat/fullscreen", icon: <FiMessageSquare />, label: "AI Chat", description: "智能对话" },
  { href: "/about", icon: <FiInfo />, label: "关于", description: "关于博客" },
];

interface NavCardProps {
  className?: string;
  articles: Article[];
}

export default function NavCard({ className = "", articles }: NavCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [activeHref, setActiveHref] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    handleResize();
    setIsReady(true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    "bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-5 sm:p-6 animate-fadeInUp animate-scaleIn";
  const cardHoverClass =
    "transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl";

  if (!isReady) return null;

  return (
    <div className={`${cardBaseClass} ${cardHoverClass} ${className}`}>
      {/* 标题 + 折叠按钮 */}
      <div className="flex justify-between items-center mb-5">
  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 tracking-wide flex items-center">
    {/* 导航标题图标 */}
    <FiGrid className="mr-2 text-xl text-gray-700 dark:text-gray-300" />
    导航
  </h3>

  {isMobile && (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2a2f3a] hover:bg-gray-200 dark:hover:bg-[#333844] transition-all duration-300 shadow-sm"
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

      {/* 搜索框 */}
      <div className="mb-5">
        <ArticleSearch
          value={search}
          onChange={setSearch}
          isOpen={isOpen}
          articles={articles}
          onSelect={(article) => {
            window.location.href = article.link;
          }}
        />
      </div>

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
                {/* 导航图标 */}
                <span
                  className="mr-4 text-2xl flex justify-center items-center w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transform transition-transform duration-300 group-hover:scale-110"
                >
                  {icon}
                </span>

                <div className="flex flex-col">
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
