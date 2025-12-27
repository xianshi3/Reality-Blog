"use client";
import React, { useState, useEffect, useRef } from "react";
import "./fullscreen-chat.css";

export default function FullscreenChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // 桌面端布局
  if (!isMobile) {
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
            <button className="nav-item active">
              <span className="nav-text">💬 新对话</span>
            </button>
            <button className="nav-item">
              <span className="nav-text">🧠 Prompt 预设</span>
            </button>
            <button className="nav-item">
              <span className="nav-text">📜 历史记录</span>
            </button>
            <button className="nav-item">
              <span className="nav-text">⚙️ 设置</span>
            </button>
          </nav>
        </aside>

        {/* 中间主聊天区 */}
        <div className="chat-main">
          <header className="chat-topbar">
            <h1>AI 聊天助手</h1>
            {/* 返回首页按钮 */}
            <button
              className="back-home-btn"
              onClick={() => window.location.href = "/"}
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

  // 手机端布局
  return (
    <div className="mobile-chat-layout">
      {/* 手机端顶部导航栏 */}
      <header className="mobile-header">
        <button
          className="mobile-menu-btn"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          ☰
        </button>
        <h1 className="mobile-title">AI 助手</h1>
        <button
          className="mobile-home-btn"
          onClick={() => window.location.href = "/"}
        >
          🏠
        </button>
      </header>

      {/* 手机端侧边菜单 */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h3>菜单</h3>
              <button onClick={() => setShowMobileMenu(false)}>✕</button>
            </div>
            <nav className="mobile-nav">
              <button className="mobile-nav-item active">
                💬 新对话
              </button>
              <button className="mobile-nav-item">
                🧠 Prompt 预设
              </button>
              <button className="mobile-nav-item">
                📜 历史记录
              </button>
              <button className="mobile-nav-item">
                ⚙️ 设置
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* 手机端聊天主体 */}
      <main className="mobile-chat-body">
        {messages.length === 0 ? (
          <div className="mobile-chat-empty">
            <div className="mobile-empty-icon">🤖</div>
            <h2>开始与 AI 对话</h2>
            <p>有什么问题都可以问我</p>
            <div className="mobile-suggestions">
              <button className="mobile-suggestion-btn" onClick={() => setInput("帮我写一段产品介绍")}>
                📝 写文案
              </button>
              <button className="mobile-suggestion-btn" onClick={() => setInput("分析一下这篇文章")}>
                📊 内容分析
              </button>
              <button className="mobile-suggestion-btn" onClick={() => setInput("帮我写段代码")}>
                💻 编程助手
              </button>
            </div>
          </div>
        ) : (
          <div className="mobile-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`mobile-msg ${msg.role}`}>
                <div className="mobile-avatar">
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>
                <div className="mobile-bubble">
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="mobile-msg assistant">
                <div className="mobile-avatar">🤖</div>
                <div className="mobile-bubble typing">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </main>

      {/* 手机端输入区域 */}
      <footer className="mobile-input-footer">
        <form
          className="mobile-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className="mobile-input"
            placeholder="输入你的问题..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="mobile-send-btn"
            disabled={loading || !input.trim()}
          >
            {loading ? "⏳" : "📤"}
          </button>
        </form>
      </footer>
    </div>
  );
}
