'use client';

import { useEffect, useState } from 'react';

type FooterProps = {
  currentYear: number;
};

/**
 * 网站页脚组件
 * 包含版权信息和开源地址
 * 使用 Tailwind 实现淡入动画效果，无需额外配置
 */
export default function Footer({ currentYear }: FooterProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <footer
      className={`footer mt-12 flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-6
        transition-all duration-700 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {/* 版权声明 */}
      <div className="text-center sm:text-left text-sm text-gray-600 dark:text-gray-400">
        © {currentYear} Reality-Blog. 保留所有权利.
      </div>

      {/* 开源地址 */}
      <div className="flex gap-4 text-sm items-center">
        <a
          href="https://github.com/xianshi3/Reality-Blog"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="博客开源地址"
          className="flex items-center gap-1 hover:text-blue-500 transition-colors duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="inline-block align-middle">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
          </svg>
          博客开源
        </a>
      </div>
    </footer>
  );
}