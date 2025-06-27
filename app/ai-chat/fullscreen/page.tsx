"use client";

import React, { useState, useEffect } from "react";

export default function FullscreenChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryMessages = new URLSearchParams(window.location.search).get("messages");
    queryMessages && setMessages(JSON.parse(queryMessages) || []);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    setLoading(true);
    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      setMessages([...newMessages, { 
        role: "assistant", 
        content: `AI 回复: ${input}` 
      }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4">
        {/* 标题栏 */}
        <div className="relative bg-white rounded-t-xl border-b border-gray-300 p-4 shadow-sm">
          <button
            onClick={() => window.history.back()}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ←
          </button>
          <h1 className="text-center text-xl font-semibold">AI 全屏对话</h1>
        </div>
        
        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto bg-white border border-gray-300 rounded-b-xl shadow-sm">
          <div className="p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="opacity-0 animate-fade-in text-gray-400 text-sm text-center py-12 select-none rounded-lg bg-gray-50">
                和 AI 聊聊技术、生活或任何问题吧！
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`opacity-0 animate-message-in flex items-start gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      🤖
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] ${
                    msg.role === "user" 
                      ? "flex flex-col items-end" 
                      : "flex flex-col items-start"
                  }`}>
                    <div className={`
                      px-4 py-3 rounded-2xl text-sm whitespace-pre-line shadow-sm
                      ${msg.role === "user"
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-gray-300 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {msg.role === "user" ? "你" : "AI助手"}
                    </div>
                  </div>
                  
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">
                      我
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 输入区域 */}
      <div className="opacity-0 animate-fade-in-up max-w-4xl w-full mx-auto p-4">
        <div className="flex gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-300">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-100 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            placeholder="输入你的问题..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold 
                       transition-all duration-200 ${loading ? "opacity-50" : "hover:bg-blue-600 hover:scale-105"}`}
          >
            {loading ? "发送中..." : "发送"}
          </button>
        </div>
      </div>
    </div>
  );
}