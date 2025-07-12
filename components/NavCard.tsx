interface NavLink {
  href: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
}

const NAV_LINKS: NavLink[] = [
  { href: '#', icon: <span className="nav-icon home-icon">⌂</span>, label: '首页', description: '网站首页' },
  { href: '#', icon: <span className="nav-icon category-icon">▤</span>, label: '分类', description: '浏览文章分类' },
  { href: '/ai-chat/fullscreen', icon: <span className="nav-icon chat-icon">✉</span>, label: 'AI Chat', description: 'LLM智能技术AI' },
];

interface NavCardProps {
  className?: string;
}

export default function NavCard({ className = '' }: NavCardProps) {
  const cardBaseClass =
    'bg-white dark:bg-[#23272f] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-5 animate-fadeInUp animate-scaleIn';
  const cardHoverClass =
  'transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl';

  return (
    <div className={`${cardBaseClass} ${cardHoverClass} ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">导航</h3>
      <ul className="space-y-4">
        {NAV_LINKS.map(({ href, icon, label, description }) => (
          <li key={label}>
            <a
              href={href}
              className="
                flex items-center p-3 rounded-lg
                bg-white dark:bg-[#23272f]
                hover:bg-gray-100 dark:hover:bg-[#2a2f3a]
                transition-colors duration-200 ease-in-out
                group
              "
            >
              <span
                className="
                  mr-3 text-2xl
                  transform transition-transform duration-300
                  group-hover:scale-110
                  text-gray-700 dark:text-gray-300
                  flex justify-center items-center w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700
                "
                aria-label={label}
              >
                {icon}
              </span>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{label}</div>
                {description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-tight">{description}</p>
                )}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
