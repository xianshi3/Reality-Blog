// components/TechStackCard.tsx
"use client";

import { useState } from 'react';

export default function TechStackCard() {
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend' | 'devops'>('frontend');

  const techStack = {
    frontend: [
      { name: 'Next.js', level: 90, icon: '🅰️' },
      { name: 'React', level: 95, icon: '⚛️' },
      { name: 'TypeScript', level: 85, icon: '📘' },
      { name: 'Tailwind CSS', level: 80, icon: '🎨' },
      { name: 'Redux', level: 75, icon: '🔄' }
    ],
    backend: [
      { name: 'Node.js', level: 85, icon: '🟢' },
      { name: 'Express', level: 80, icon: '🚂' },
      { name: 'Supabase', level: 75, icon: '🛢️' },
      { name: 'PostgreSQL', level: 70, icon: '🐘' },
      { name: 'REST API', level: 85, icon: '🔗' }
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

        {/* 技术亮点 */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold mb-2 flex items-center">
            <span className="mr-1">✨</span> 技术亮点
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            {activeTab === 'frontend' && (
              <>
                <li>• 精通Next.js服务端渲染和静态生成</li>
                <li>• 熟练使用React Hooks和状态管理</li>
                <li>• 擅长响应式和无障碍设计</li>
              </>
            )}
            {activeTab === 'backend' && (
              <>
                <li>• 使用Supabase构建全栈应用</li>
                <li>• 设计高性能RESTful API</li>
                <li>• 实现数据模型优化和查询优化</li>
              </>
            )}
            {activeTab === 'devops' && (
              <>
                <li>• 熟练使用Vercel部署Next.js应用</li>
                <li>• 配置自动化CI/CD流程</li>
                <li>• 实施监控和日志解决方案</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}