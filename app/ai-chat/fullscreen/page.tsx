"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import "./fullscreen-chat.css";

// 图标
import { HiOutlineHome, HiOutlineSparkles } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import { RiRobot2Line, RiUserLine } from "react-icons/ri";

type Message = {
  role: "user" | "assistant";
  content: string;
  id: string;
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function FullscreenChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 自动聚焦输入框
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      content: input.trim(),
      id: generateId(),
    };

    const assistantMsg: Message = {
      role: "assistant",
      content: "",
      id: generateId(),
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        aiText += decoder.decode(value, { stream: true });

        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMsg.id
              ? { ...msg, content: aiText }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error:", error);
      // 可以在这里添加错误提示
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app">
      {/* 顶部导航 */}
      <header className="header">
        <div className="header-left">
          <HiOutlineSparkles className="header-icon" />
          <h1 className="header-title">AI 助手</h1>
          <span className={`header-status ${loading ? 'thinking' : ''}`}>
            {loading ? '思考中...' : '在线'}
          </span>
        </div>
        <button
          className="header-home"
          onClick={() => window.location.href = "/"}
        >
          <HiOutlineHome />
          <span>首页</span>
        </button>
      </header>

      {/* 聊天区域 */}
      <main className="chat-area" ref={chatAreaRef}>
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <HiOutlineSparkles />
              </div>
              <h2>开始新的对话</h2>
              <p>输入消息，开始与AI助手交流</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`message-item ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? <RiUserLine /> : <RiRobot2Line />}
                </div>
                <div className="message-content">
                  <div className="message-sender">
                    {msg.role === 'user' ? '你' : 'AI助手'}
                  </div>
                  <div className="message-bubble">
                    {msg.role === 'assistant' && msg.content === '' ? (
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : msg.role === 'assistant' ? (
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
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* 底部输入区 - DeepSeek风格 */}
      <div className="input-area">
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            disabled={loading}
            className="chat-input"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="send-btn"
            title="发送 (Enter)"
          >
            <IoSend />
          </button>
        </div>
        <div className="input-hint">
          Enter 发送
        </div>
      </div>
    </div>
  );
}