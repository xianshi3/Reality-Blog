"use client";

import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      onKeyDown={onKeyDown}
      aria-label="切换主题"
      title="切换主题"
      className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900"
    >
      <span
        className={`absolute top-1/2 left-1 w-5 h-5 rounded-full shadow-sm transform -translate-y-1/2 transition duration-300 ease-in-out ${
          isDark ? "translate-x-7 bg-gray-800" : "translate-x-0 bg-white"
        }`}
      />
    </button>
  );
}
