'use client';

import { useEffect, useState } from 'react';

type FooterProps = {
  currentYear: number;
};

/**
 * 网站页脚组件
 * 包含版权信息和外部链接（如 GitHub、Email）
 * 使用 Tailwind 实现淡入动画效果，无需额外配置
 */
export default function Footer({ currentYear }: FooterProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100); // 确保动画在挂载后触发
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

      {/* 外部链接区域 */}
      <div className="flex gap-4 text-sm">
        <a
          href="https://github.com/xianshi3"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="访问 GitHub"
          className="hover:text-blue-400 transition-colors duration-200"
        >
          GitHub
        </a>
        <a
          href="mailto:1784257751@qq.com"
          aria-label="发送邮件"
          className="hover:text-blue-400 transition-colors duration-200"
        >
          Email
        </a>
      </div>
    </footer>
  );
}
