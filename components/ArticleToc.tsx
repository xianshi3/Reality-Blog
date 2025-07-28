"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface Props {
  content: string;
  className?: string;
}

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]/g, "");

export default function ArticleToc({ content, className }: Props) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const lines = content.split("\n");
    const headings: TocItem[] = [];

    lines.forEach((line) => {
      const match = /^(#{1,6})\s+(.*)/.exec(line);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = slugify(text);
        headings.push({ id, text, level });
      }
    });

    setTocItems(headings);
  }, [content]);

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
                  const topOffset = 80; // 如果有固定导航栏，请调整这里
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
