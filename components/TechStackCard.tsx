"use client";

import { useState } from "react";
import { FiChevronDown, FiCpu } from "react-icons/fi";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiVuedotjs,
  SiGo,
  SiPython,
  SiDocker,
  SiAmazon,
  SiGit,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { TbBrandCSharp } from "react-icons/tb";

const techStack = {
  frontend: [
    { name: "Next.js", level: 70, icon: <SiNextdotjs /> },
    { name: "React", level: 75, icon: <SiReact /> },
    { name: "TypeScript", level: 85, icon: <SiTypescript /> },
    { name: "Tailwind CSS", level: 80, icon: <SiTailwindcss /> },
    { name: "Vue.js", level: 90, icon: <SiVuedotjs /> },
  ],
  backend: [
    { name: "Java", level: 85, icon: <FaJava /> },
    { name: ".NET", level: 80, icon: <TbBrandCSharp /> },
    { name: "Go", level: 75, icon: <SiGo /> },
    { name: "Python", level: 80, icon: <SiPython /> },
  ],
  devops: [
    { name: "Docker", level: 70, icon: <SiDocker /> },
    { name: "Git", level: 85, icon: <SiGit /> },
    { name: "AWS", level: 65, icon: <SiAmazon /> },
  ],
};

export default function TechStackCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] =
    useState<"frontend" | "backend" | "devops">("frontend");

  const previewIcons = [
    ...techStack.frontend,
    ...techStack.backend,
    ...techStack.devops,
  ].slice(0, 6);

  return (
    <div
      className="
        bg-white dark:bg-[#23272f]
        rounded-2xl
        shadow-lg
        transition-all duration-300 ease-in-out
        hover:scale-[1.02]
        hover:-translate-y-1
        hover:shadow-xl
        overflow-hidden
        max-w-md
        mx-auto
      "
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex flex-col gap-4 text-left group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiCpu
              className={`
                text-lg transition-all duration-300
                ${isOpen ? "text-blue-500 scale-110" : "text-gray-500"}
              `}
            />

            <span
              className={`
                text-base font-semibold tracking-wide
                transition-all duration-300
                ${
                  isOpen
                    ? "text-blue-600 dark:text-blue-400 translate-x-1"
                    : "text-gray-800 dark:text-gray-100"
                }
              `}
            >
              我的技术栈
            </span>
          </div>

          <FiChevronDown
            className={`
              transition-all duration-300 text-gray-400
              ${isOpen ? "rotate-180 text-blue-500" : ""}
            `}
          />
        </div>

        {/* 折叠图标预览 */}
        {!isOpen && (
          <div className="flex gap-4 flex-wrap opacity-80">
            {previewIcons.map((tech, i) => (
              <div
                key={i}
                className="
                  text-xl
                  text-gray-500
                  dark:text-gray-400
                  transition-transform duration-300
                  group-hover:scale-110
                "
              >
                {tech.icon}
              </div>
            ))}
          </div>
        )}
      </button>

      {/* 内容区域 */}
      <div
        className={`
          transition-all duration-500 ease-in-out overflow-hidden
          ${isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-6 pb-6">
          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
            {(["frontend", "backend", "devops"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 py-3 text-sm font-medium border-b-2
                  transition-all duration-300
                  ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600 dark:text-blue-400 scale-105"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:scale-[1.03]"
                  }
                `}
              >
                {tab === "frontend"
                  ? "前端"
                  : tab === "backend"
                  ? "后端"
                  : "运维"}
              </button>
            ))}
          </div>

          {/* 技术列表 */}
          <ul className="space-y-6">
            {techStack[activeTab].map((tech) => (
              <li key={tech.name} className="group">
                <div className="flex items-center justify-between mb-2 cursor-pointer">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <span
                      className="
                        text-lg
                        transition-all duration-300
                        group-hover:scale-110
                        group-hover:text-blue-500
                      "
                    >
                      {tech.icon}
                    </span>

                    <span
                      className="
                        font-medium text-sm
                        transition-colors duration-300
                        group-hover:text-blue-500
                        dark:group-hover:text-blue-400
                      "
                    >
                      {tech.name}
                    </span>
                  </div>

                  <span
                    className="
                      text-xs text-gray-500 dark:text-gray-400
                      transition-colors duration-300
                      group-hover:text-blue-500
                    "
                  >
                    {tech.level}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="
                      bg-blue-500 h-2 rounded-full
                      transition-all duration-1000 ease-out
                    "
                    style={{
                      width: isOpen ? `${tech.level}%` : "0%",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
