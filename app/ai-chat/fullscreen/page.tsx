"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import "./fullscreen-chat.css";

// 图标
import { HiOutlineHome, HiOutlineSparkles, HiPaperClip } from "react-icons/hi";
import { IoSend, IoStop } from "react-icons/io5";
import { RiRobot2Line, RiUserLine } from "react-icons/ri";
import { BsEmojiSmile } from "react-icons/bs";

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
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // 自动调整文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

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
    textareaRef.current?.focus();
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    setError(null);

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

    // 重置文本框高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
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
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message || "发送失败，请重试");
      setMessages(prev => prev.filter(msg => msg.id !== assistantMsg.id));
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 停止生成
  const handleStop = () => {
    setLoading(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <HiOutlineSparkles className="header-icon" />
          <h1 className="header-title">Al Chat</h1>
          <span className={`header-status ${loading ? 'thinking' : ''}`}>
            {loading ? '思考中...' : '在线'}
          </span>
        </div>
        <button className="header-home" onClick={() => window.location.href = "/"}>
          <HiOutlineHome />
          <span>首页</span>
        </button>
      </header>

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
                    {msg.role === 'user' ? '你' : 'Al Chat'}
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
          
          {error && (
            <div className="error-message">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="error-close">×</button>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      <div className="input-area">
        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息... (Shift + Enter 换行)"
              disabled={loading}
              className="chat-input"
              rows={1}
            />
          </div>
          <div className="button-group">
            <button className="action-btn" title="表情" disabled={loading}>
              <BsEmojiSmile />
            </button>
            <button className="action-btn" title="附件" disabled={loading}>
              <HiPaperClip />
            </button>
            {loading ? (
              <button onClick={handleStop} className="stop-btn" title="停止生成">
                <IoStop />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="send-btn"
                title="发送 (Enter)"
              >
                <IoSend />
              </button>
            )}
          </div>
        </div>
        <div className="input-hint">
          <span>{loading ? 'AI 正在思考... 点击红色按钮停止' : 'Enter 发送 · Shift + Enter 换行'}</span>
          {input.length > 0 && <span className="char-count">{input.length}</span>}
        </div>
      </div>
    </div>
  );
}