// components/TechStackCard.tsx
"use client";

import { useState } from 'react';

export default function TechStackCard() {
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend' | 'devops'>('frontend');

  const techStack = {
    frontend: [
      { name: 'Next.js', level: 70, icon: '🅰️' },
      { name: 'React', level: 75, icon: '⚛️' },
      { name: 'TypeScript', level: 85, icon: '📘' },
      { name: 'Tailwind CSS', level: 80, icon: '🎨' },
      { name: 'Vue.js', level: 90, icon: '🟢' }
    ],
    backend: [
      { name: 'JavaSE', level: 85, icon: '☕' },
      { name: '.NET', level: 80, icon: '🔷' },
      { name: 'Go', level: 75, icon: '🐹' },
      { name: 'Python', level: 80, icon: '🐍' },
      { name: 'C++', level: 70, icon: '➕➕' }
    ],
    devops: [
      { name: 'Vercel', level: 80, icon: '▲' },
      { name: 'Docker', level: 70, icon: '🐳' },
      { name: 'Git', level: 85, icon: '🐙' },
      { name: 'CI/CD', level: 75, icon: '🔄' },
      { name: 'AWS', level: 65, icon: '☁️' }
    ]
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* 标题 */}
      <div className="p-6 pb-0">
        <h3 className="text-xl font-bold flex items-center">
          <span className="mr-2">💻</span> 我的技术栈
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          根据项目经验评估的技术熟练度
        </p>
      </div>

      {/* 标签页 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 px-6 mt-4">
        <button
          onClick={() => setActiveTab('frontend')}
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'frontend'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          前端技术
        </button>
        <button
          onClick={() => setActiveTab('backend')}
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'backend'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          后端技术
        </button>
        <button
          onClick={() => setActiveTab('devops')}
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'devops'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          运维部署
        </button>
      </div>

      {/* 技术栈内容 */}
      <div className="p-6">
        <ul className="space-y-4">
          {techStack[activeTab].map((tech) => (
            <li key={tech.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium flex items-center">
                  <span className="mr-2">{tech.icon}</span>
                  {tech.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {tech.level}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${tech.level}%` }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}