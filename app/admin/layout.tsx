"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaGaugeHigh,
  FaPenToSquare,
  FaImages,
  FaGear,
  FaArrowLeft,
  FaBars,
  FaXmark,
  FaNewspaper,
} from "react-icons/fa6";
import "./admin.css";

const NAV_ITEMS = [
  { href: "/admin", label: "控制台", icon: FaGaugeHigh },
  { href: "/admin/create", label: "写文章", icon: FaPenToSquare },
  { href: "/admin", label: "文章管理", icon: FaNewspaper, exact: true },
  { href: "/admin/images", label: "图片管理", icon: FaImages },
  { href: "#", label: "设置", icon: FaGear, disabled: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.disabled) return false;
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="admin-shell">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <Link href="/admin" className="admin-sidebar-brand">
            <FaNewspaper className="admin-sidebar-icon" />
            <span>Reality Blog</span>
          </Link>
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="关闭侧边栏"
          >
            <FaXmark />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.disabled ? "#" : item.href}
                className={`admin-nav-item ${isActive(item) ? "active" : ""} ${item.disabled ? "disabled" : ""}`}
                onClick={() => setSidebarOpen(false)}
                aria-disabled={item.disabled}
              >
                <Icon />
                <span>{item.label}</span>
                {item.disabled && <span className="admin-nav-badge">即将推出</span>}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-nav-item">
            <FaArrowLeft />
            <span>返回前台</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        {/* Mobile header */}
        <div className="admin-mobile-header">
          <button
            className="admin-mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="打开菜单"
          >
            <FaBars />
          </button>
          <span className="admin-mobile-title">管理后台</span>
        </div>

        {children}
      </div>
    </div>
  );
}
