"use client";

import React, { useState, useEffect, useRef } from "react";
import "./fullscreen-chat.css";

export default function FullscreenChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("messages");
    if (q) setMessages(JSON.parse(q));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages([
        ...newMsgs,
        { role: "assistant", content: `AI 回答：${userMsg.content} 🤖` },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="desktop-chat-layout">
      {/* 左侧导航栏 */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>🤖 AI 助手</h2>
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "⟨" : "⟩"}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">💬 新对话</button>
          <button className="nav-item">🧠 Prompt 预设</button>
          <button className="nav-item">📜 历史记录</button>
          <button className="nav-item">⚙️ 设置</button>
        </nav>
      </aside>

      {/* 中间主聊天区 */}
      <div className="chat-main">
        <header className="chat-topbar">
          <h1>AI 聊天助手</h1>
          {/* 返回首页按钮 */}
          <button
            className="back-home-btn"
            onClick={() => window.location.href = "/"}  // 这里可以替换为你的博客首页URL
          >
            返回首页
          </button>
        </header>

        <main className="chat-body">
          <div className="chat-inner">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <div className="icon">💬</div>
                <h2>开始与 AI 对话</h2>
                <p>例如：帮我写一段文案、分析一篇文章、写段代码</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`msg ${msg.role}`}>
                  <div className="avatar">
                    {msg.role === "user" ? "🧑" : "🤖"}
                  </div>
                  <div className="bubble">
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="msg assistant">
                <div className="avatar">🤖</div>
                <div className="bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </main>

        {/* 底部毛玻璃输入栏 */}
        <footer className="chat-footer">
          <form
            className="chat-input"
            onSubmit={(e) => {
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
            />
            <button type="submit" disabled={loading}>
              {loading ? "..." : "发送"}
            </button>
          </form>
        </footer>
      </div>

      {/* 右侧可扩展区域 */}
      <aside className="right-panel">
        <div className="hint-card">
          <h3>💡 提示</h3>
          <p>你可以试试：</p>
          <ul>
            <li>生成一段励志语录</li>
            <li>帮我写一段产品介绍</li>
            <li>分析一篇新闻内容</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
