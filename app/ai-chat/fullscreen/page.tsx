"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

import "./fullscreen-chat.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function FullscreenChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      content: input,
    };

    const newMessages = [...messages, userMsg];

    setMessages([...newMessages, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: newMessages }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    let aiText = "";

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value);

      aiText += chunk;

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: aiText,
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="desktop-chat-layout">

      <div className="chat-main">

        <header className="chat-topbar">
          <h1>AI Chat</h1>

          <button
            className="back-home-btn"
            onClick={() => (window.location.href = "/")}
          >
            返回首页
          </button>
        </header>

        <main className="chat-body">

          <div className="chat-inner">

            {messages.length === 0 && (
              <div className="chat-empty">
                <div className="icon">💬</div>
                <h2>开始与 AI 对话</h2>
                <p>例如：写一个 React 组件</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.role}`}>

                <div className="avatar">
                  {msg.role === "user" ? "🧑" : "🤖"}
                </div>

                <div className="bubble">
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>

              </div>
            ))}

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

            <button disabled={loading}>
              {loading ? "思考中..." : "发送"}
            </button>

          </form>

        </footer>

      </div>

    </div>
  );
}