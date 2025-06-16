"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  // 读取 localStorage 中的主题设置，默认浅色
  const [isDark, setIsDark] = useState(false);

  // 组件挂载时读取 localStorage
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setIsDark(true);
    }
  }, []);

  // 根据 isDark 状态添加或移除 dark 类，并同步到 localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-lg shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2">
            {/* <Image
              src="/logo.png"
              alt="Reality Blog Logo"
              width={40}
              height={40}
              className="rounded-full shadow-md"
            /> */}
            <span className="text-2xl font-extrabold text-gray-800 dark:text-white drop-shadow-lg">
              Reality Blog
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-8">
          <ul className="flex space-x-8">
            <li>
              <Link
                href="/"
                className="font-medium text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/20"
              >
                首页
              </Link>
            </li>
            <li>
              <Link
                href="/category"
                className="font-medium text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/20"
              >
                分类
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="font-medium text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/20"
              >
                联系我
              </Link>
            </li>
          </ul>
          {/* 主题切换按钮 */}
          <button
            onClick={toggleTheme}
            className="font-medium text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/20"
          >
            {isDark ? "浅色模式" : "深色模式"}
          </button>
        </div>
      </div>
    </nav>
  );
}