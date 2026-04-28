"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaList, FaChevronDown, FaChevronUp, FaXmark } from "react-icons/fa6";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface Props {
  className?: string;
}

export default function ArticleToc({ className }: Props) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && isExpanded && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("click", handleClickOutside);
      // 禁止背景滚动
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isMobile, isExpanded]);

  // 提取目录项
  useEffect(() => {
    const headingElements = Array.from(
      document.querySelectorAll(
        "article.article-content h1[id], article.article-content h2[id], article.article-content h3[id], article.article-content h4[id], article.article-content h5[id], article.article-content h6[id]"
      )
    );

    const newTocItems = headingElements.map((el) => ({
      id: el.id,
      text: el.textContent ?? "",
      level: Number(el.tagName.substring(1)),
    }));

    setTocItems(newTocItems);
  }, []);

  // 滚动监听 - 高亮当前标题
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = Array.from(
        document.querySelectorAll(
          "article.article-content h1[id], article.article-content h2[id], article.article-content h3[id], article.article-content h4[id], article.article-content h5[id], article.article-content h6[id]"
        )
      );

      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          setActiveId(el.id);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, itemId: string) => {
    e.preventDefault();
    const target = document.getElementById(itemId);
    if (target) {
      const topOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = window.scrollY + elementPosition - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // 移动端点击后收起
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    }
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  if (tocItems.length === 0) return null;

  // 移动端渲染
  if (isMobile) {
    return (
      <div ref={containerRef} className={`mobile-toc-container ${className ?? ""}`}>
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.button
              key="collapsed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleExpand}
              className="mobile-toc-toggle"
            >
              <span className="toc-icon">
                <FaList />
              </span>
              <span className="toc-label">目录</span>
              <span className="toc-count">({tocItems.length})</span>
              <FaChevronDown className="toc-arrow" />
            </motion.button>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="mobile-toc-expanded"
            >
              {/* 头部 */}
              <div className="mobile-toc-header">
                <div className="toc-header-title">
                  <FaList />
                  <span>目录</span>
                  <span className="toc-count">({tocItems.length})</span>
                </div>
                <button onClick={toggleExpand} className="toc-close-btn">
                  <FaXmark />
                </button>
              </div>

              {/* 目录列表 */}
              <div className="mobile-toc-list">
                {tocItems.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={(e) => handleClick(e, item.id)}
                    className={`toc-item ${activeId === item.id ? "active" : ""}`}
                    style={{
                      paddingLeft: `${(item.level - 1) * 0.5 + 0.75}rem`,
                    }}
                  >
                    <span
                      className="toc-level-dot"
                      style={{
                        backgroundColor: activeId === item.id ? "#3b82f6" : item.level === 1 ? "#6b7280" : "#9ca3af",
                      }}
                    />
                    <span className="toc-item-text">{item.text}</span>
                  </motion.a>
                ))}
              </div>

              {/* 底部提示 */}
              <div className="mobile-toc-footer">
                点击跳转 · 滑动关闭
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 桌面端渲染
  return (
    <aside className={`text-sm text-gray-800 dark:text-gray-300 ${className ?? ""}`}>
      <h2 className="font-semibold mb-3 text-base text-gray-900 dark:text-white flex items-center gap-2">
        <FaList className="text-xs" />
        目录
      </h2>
      <ul className="space-y-1.5">
        {tocItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`toc-link block transition-all duration-200 ${
                activeId === item.id
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300"
              }`}
              style={{
                paddingLeft: `${(item.level - 1) * 0.75 + 0.5}rem`,
                fontWeight: item.level === 1 ? 600 : 400,
                fontSize: item.level === 1 ? "0.9rem" : "0.8rem",
                borderLeft:
                  activeId === item.id
                    ? "2px solid currentColor"
                    : "2px solid transparent",
              }}
            >
              <span className="truncate inline-block max-w-full">{item.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
