"use client";

import React, { useState, useEffect, useRef } from "react";
import "./fullscreen-chat.css";

export default function FullscreenChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const queryMessages = new URLSearchParams(window.location.search).get("messages");
    queryMessages && setMessages(JSON.parse(queryMessages) || []);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `AI 回复: ${input}`,
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="gpt-root">
      {/* 顶部栏 */}
      <header className="gpt-header">
        <div className="gpt-header-inner">
          <button
            onClick={() => window.history.back()}
            className="gpt-header-back"
            aria-label="返回"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="gpt-header-title">AI 对话</h1>
        </div>
      </header>

      {/* 聊天内容 */}
      <main className="gpt-chat-main">
        <div className="gpt-chat-list">
          {messages.length === 0 ? (
            <div className="gpt-chat-empty animate-fade-in">
              <div className="gpt-chat-empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="gpt-chat-empty-tip">和 AI 聊聊技术、生活或任何问题吧！</p>
              <p className="gpt-chat-empty-desc">在下方输入框开始对话</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`gpt-chat-message ${msg.role} animate-slide-in`}
                style={{ animationDelay: `${idx * 60}ms`, animationFillMode: "backwards" }}
              >
                <div className="gpt-chat-avatar">
                  {msg.role === "user" ? (
                    <div className="gpt-chat-avatar-user">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="gpt-chat-avatar-ai">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="gpt-chat-bubble">
                  <div className="gpt-chat-bubble-inner">{msg.content}</div>
                  <div className="gpt-chat-meta">
                    {msg.role === "user" ? "你" : "AI助手"} · {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* 输入栏 */}
      <footer className="gpt-chat-footer">
        <form
          className="gpt-chat-inputbar"
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            placeholder="输入你的问题..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            aria-label="发送"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </form>
      </footer>
    </div>
  );
}