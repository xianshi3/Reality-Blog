"use client";

import { useState } from "react";

export default function TechStackCard() {
  const [activeTab, setActiveTab] = useState<"frontend" | "backend" | "devops">(
    "frontend"
  );

  const techStack = {
    frontend: [
      { name: "Next.js", level: 70, icon: "🅰️" },
      { name: "React", level: 75, icon: "⚛️" },
      { name: "TypeScript", level: 85, icon: "📘" },
      { name: "Tailwind CSS", level: 80, icon: "🎨" },
      { name: "Vue.js", level: 90, icon: "🟢" },
    ],
    backend: [
      { name: "JavaSE", level: 85, icon: "☕" },
      { name: ".NET", level: 80, icon: "🔷" },
      { name: "Go", level: 75, icon: "🐹" },
      { name: "Python", level: 80, icon: "🐍" },
      { name: "C++", level: 70, icon: "➕➕" },
    ],
    devops: [
      { name: "Vercel", level: 80, icon: "▲" },
      { name: "Docker", level: 70, icon: "🐳" },
      { name: "Git", level: 85, icon: "🐙" },
      { name: "CI/CD", level: 75, icon: "🔄" },
      { name: "AWS", level: 65, icon: "☁️" },
    ],
  };

  return (
    <div
      className="bg-white dark:bg-[#23272f] rounded-2xl shadow-lg p-6
        animate-fadeInUp animate-scaleIn
        transition-transform duration-300 ease-in-out
        hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl
        max-w-md mx-auto"
    >
      {/* 标题 */}
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">
          💻我的技术栈
        </h3>
      </div>
      
      {/* 标签页 */}
      <div className="flex gap-4 mt-2 border-b border-gray-200 dark:border-gray-700">
        {(["frontend", "backend", "devops"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center text-sm font-medium border-b-2
              transition-all duration-300
              ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 scale-105"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:scale-[1.03]"
              }`}
          >
            {tab === "frontend" ? "前端" : tab === "backend" ? "后端" : "运维"}
          </button>
        ))}
      </div>

      {/* 技术栈内容 */}
      <ul className="mt-6 space-y-6">
        {techStack[activeTab].map((tech, index) => (
          <li
            key={tech.name}
            className="animate-fadeInUp"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 group">
                <span className="text-xl transition-transform duration-300 group-hover:scale-110">
                  {tech.icon}
                </span>
                <span className="font-medium transition-colors duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                  {tech.name}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                {tech.level}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${tech.level}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
