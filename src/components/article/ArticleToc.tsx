"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaList, FaChevronDown, FaXmark } from "react-icons/fa6";

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
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && isExpanded && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("click", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isMobile, isExpanded]);

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

    if (headingElements.length > 0) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

          if (visibleEntries.length > 0) {
            setActiveId((visibleEntries[0].target as HTMLElement).id);
          } else {
            const scrollY = window.scrollY;
            let active = (headingElements[0] as HTMLElement).id;
            for (const el of headingElements) {
              const top = el.getBoundingClientRect().top + scrollY;
              if (scrollY >= top - 120) {
                active = el.id;
              }
            }
            setActiveId(active);
          }
        },
        {
          rootMargin: "-80px 0px -60% 0px",
          threshold: 0,
        }
      );

      for (const el of headingElements) {
        observerRef.current.observe(el);
      }
    }

    return () => {
      observerRef.current?.disconnect();
    };
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

      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    }
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  if (tocItems.length === 0) return null;

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
                        backgroundColor: activeId === item.id ? "var(--toc-dot-active, #3b82f6)" : item.level === 1 ? "var(--toc-dot-level1, #6b7280)" : "var(--toc-dot-level2, #9ca3af)",
                      }}
                    />
                    <span className="toc-item-text">{item.text}</span>
                  </motion.a>
                ))}
              </div>

              <div className="mobile-toc-footer">
                点击跳转 · 滑动关闭
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <aside className={`text-sm text-gray-800 dark:text-gray-300 ${className ?? ""}`}>
      <h2 className="font-semibold mb-3 text-base text-gray-900 dark:text-white flex items-center gap-2">
        <FaList className="text-xs" />
        目录
        <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
          ({tocItems.length})
        </span>
      </h2>
      <ul className="space-y-0.5">
        {tocItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`block transition-all duration-200 py-1.5 rounded-lg ${
                activeId === item.id
                  ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800/30"
              }`}
              style={{
                paddingLeft: `${(item.level - 1) * 0.75 + 0.75}rem`,
                paddingRight: "0.75rem",
              }}
            >
              <span className="truncate block text-sm">{item.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
