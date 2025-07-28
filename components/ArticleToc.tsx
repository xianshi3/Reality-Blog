"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    // 选择文章内所有 h1~h6 有 id 的标题元素
    const headingElements = Array.from(
      document.querySelectorAll('article.article-content h1[id], article.article-content h2[id], article.article-content h3[id], article.article-content h4[id], article.article-content h5[id], article.article-content h6[id]')
    );

    const newTocItems = headingElements.map((el) => ({
      id: el.id,
      text: el.textContent ?? "",
      level: Number(el.tagName.substring(1)), // h1 -> 1, h2 -> 2
    }));

    setTocItems(newTocItems);
  }, []);

  if (tocItems.length === 0) return null;

  return (
    <aside className={`text-sm text-gray-800 dark:text-gray-300 ${className ?? ""}`}>
      <h2 className="font-semibold mb-3 text-base text-gray-900 dark:text-white">目录</h2>
      <ul className="space-y-2">
        {tocItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(item.id);
                if (target) {
                  const topOffset = 80; // 固定导航栏高度
                  const elementPosition = target.getBoundingClientRect().top;
                  const offsetPosition = window.scrollY + elementPosition - topOffset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });
                }
              }}
              className="block transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"
              style={{
                marginLeft: `${(item.level - 1) * 1}rem`,
                fontWeight: item.level === 1 ? 600 : 400,
                fontSize: item.level === 1 ? "0.95rem" : "0.85rem",
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
