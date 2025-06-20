/**
 * AIChat 组件
 * 
 * @module AIChat
 */

"use client";
import React, { useState, useRef, useEffect } from "react";

/** 消息类型定义 */
interface Message {
  role: "user" | "assistant";
  content: string;
}

/** 用户和 AI 的头像 */
const AVATAR = {
  user: (
    <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold shadow">
      我
    </div>
  ),
  assistant: (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow">
      🤖
    </div>
  ),
};

/**
 * AIChat 组件
 * 悬浮按钮点击弹出对话框，支持与 AI 聊天
 */
export default function AIChat() {
  const [open, setOpen] = useState(false); // 控制对话框显示
  const [messages, setMessages] = useState<Message[]>([]); // 消息列表
  const [input, setInput] = useState(""); // 输入框内容
  const [loading, setLoading] = useState(false); // 发送状态
  const messagesEndRef = useRef<HTMLDivElement>(null); // 滚动到底部

  // 每次消息变化或打开时自动滚动到底部
  useEffect(() => {
    if (open) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [messages, open]);

  // 发送消息
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        { role: "assistant" as const, content: data.reply }
      ]);
    } catch (e) {
      setMessages([
        ...newMessages,
        { role: "assistant" as const, content: "AI服务异常，请稍后再试。" }
      ]);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* 悬浮按钮 */}
      <button
        className="fixed bottom-6 left-6 z-50 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-all focus:outline-none"
        style={{ boxShadow: "0 4px 24px rgba(80,80,200,0.18)" }}
        onClick={() => setOpen(v => !v)}
        aria-label="打开AI对话"
      >
        <span className="text-2xl">🤖</span>
      </button>

      {/* 对话框 */}
      {open && (
        <div
          className="fixed bottom-24 left-6 z-50 w-[350px] max-w-[90vw] flex flex-col bg-white/95 dark:bg-[#23272f]/95 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-md animate-fadeInUp"
          style={{ minWidth: 320, minHeight: 420 }}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-[#23272f] dark:to-[#23273f] rounded-t-2xl">
            <span className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-lg">
              <span className="text-2xl">🤖</span>AI 对话
            </span>
            <button
              className="text-gray-400 hover:text-red-400 text-xl font-bold transition"
              onClick={() => setOpen(false)}
              aria-label="关闭"
            >
              ×
            </button>
          </div>
          {/* 消息区 */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
            {messages.length === 0 && (
              <div className="text-gray-400 text-sm text-center mt-12 select-none">
                和 AI 聊聊技术、生活或任何问题吧！
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-scaleIn`}
              >
                {msg.role === "assistant" && AVATAR.assistant}
                <div
                  className={`
                    px-4 py-2 rounded-2xl max-w-[70%] text-sm whitespace-pre-line shadow
                    ${msg.role === "user"
                      ? "bg-blue-500 text-white rounded-br-md"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md"}
                  `}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && AVATAR.user}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* 输入区 */}
          <div className="flex gap-2 px-3 py-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-[#23272f] rounded-b-2xl">
            <input
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition"
              placeholder="请输入你的问题..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loading && handleSend()}
              disabled={loading}
            />
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-5 py-2 rounded-lg font-semibold shadow disabled:opacity-50 transition"
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? "发送中..." : "发送"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}