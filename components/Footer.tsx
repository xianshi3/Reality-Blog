// Footer.tsx

type FooterProps = {
  currentYear: number;
};

/**
 * 网站页脚组件
 * 包含版权信息和外部链接（如 GitHub、Email）
 * 响应式布局：小屏幕竖排，大屏幕横排
 */
export default function Footer({ currentYear }: FooterProps) {
  return (
    <footer className="footer mt-12">
      {/* 版权声明 */}
      <div className="text-center sm:text-left">
        © {currentYear} Reality-Blog. 保留所有权利.
      </div>

      {/* 外部链接区域 */}
      <div className="footer-links items-center">
        {/* GitHub 链接 */}
        <a
          href="https://github.com/xianshi3"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="访问 GitHub"
          className="text-sm hover:underline hover:text-blue-600 transition-colors"
        >
          GitHub
        </a>

        {/* Email 链接 */}
        <a
          href="1784257751@qq.com"
          aria-label="发送邮件"
          className="text-sm hover:underline hover:text-blue-600 transition-colors"
        >
          Email
        </a>
      </div>
    </footer>
  );
}
