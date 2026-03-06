"use client";

import React, { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./fullscreen-chat.css";

// 图标
import { HiOutlineHome, HiOutlineSparkles, HiPaperClip } from "react-icons/hi";
import { IoSend, IoStop } from "react-icons/io5";
import { RiRobot2Line, RiUserLine } from "react-icons/ri";
import { BsEmojiSmile, BsClipboard, BsClipboardCheck } from "react-icons/bs";
import { VscSymbolKeyword } from "react-icons/vsc";

type Message = {
  role: "user" | "assistant";
  content: string;
  id: string;
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 复制按钮组件
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`copy-button ${copied ? 'copied' : ''}`}
      title={copied ? "已复制!" : "复制代码"}
    >
      {copied ? <BsClipboardCheck /> : <BsClipboard />}
    </button>
  );
};

// 代码块组件
const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const code = String(children).replace(/\n$/, '');
  const language = match ? match[1] : 'text';

  if (!inline && match) {
    return (
      <div className="code-block-wrapper">
        <div className="code-header">
          <span className="code-language">
            <VscSymbolKeyword />
            {language}
          </span>
          <CopyButton text={code} />
        </div>
        <div className="code-block-content">
          <pre className={`language-${language}`}>
            <code className={className}>{children}</code>
          </pre>
        </div>
      </div>
    );
  }

  return <code className={className} {...props}>{children}</code>;
};

// 将主要聊天逻辑提取到子组件中
function ChatContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // 从 URL 参数恢复聊天记录
  useEffect(() => {
    const messagesParam = searchParams.get('messages');
    if (messagesParam) {
      try {
        const parsedMessages = JSON.parse(messagesParam);
        const formattedMessages = parsedMessages.map((msg: any) => ({
          ...msg,
          id: generateId(),
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Failed to parse messages from URL:', error);
      }
    }
  }, [searchParams]);

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

  const handleStop = () => {
    setLoading(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <div className="header-logo">
            <HiOutlineSparkles className="header-icon" />
          </div>
          <h1 className="header-title">AI Chat</h1>
          <div className={`header-status ${loading ? 'thinking' : ''}`}>
            <span className="status-dot"></span>
            <span>{loading ? '思考中...' : '在线'}</span>
          </div>
        </div>
        <button className="header-home" onClick={() => window.location.href = "/"}>
          <HiOutlineHome />
          <span>返回首页</span>
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
              <div className="empty-suggestions">
                <button className="suggestion-chip" onClick={() => setInput("你能做什么？")}>你能做什么？</button>
                <button className="suggestion-chip" onClick={() => setInput("写一首诗")}>写一首诗</button>
                <button className="suggestion-chip" onClick={() => setInput("解释量子计算")}>解释量子计算</button>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={msg.id} 
                className={`message-item ${msg.role}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="message-avatar">
                  {msg.role === 'user' ? <RiUserLine /> : <RiRobot2Line />}
                </div>
                <div className="message-content">
                  <div className="message-sender">
                    {msg.role === 'user' ? '你' : 'AI Chat'}
                    <span className="message-time">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
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
                        components={{
                          code: CodeBlock,
                        }}
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
          {input.length > 0 && (
            <span className={`char-count ${input.length > 2000 ? 'warning' : ''}`}>
              {input.length}/2000
            </span>
          )}
        </div>
      </div>
    </>
  );
}

// 主页面组件，用 Suspense 包裹 ChatContent
export default function FullscreenChat() {
  return (
    <Suspense fallback={
      <div className="app">
        <header className="header">
          <div className="header-left">
            <div className="header-logo">
              <HiOutlineSparkles className="header-icon" />
            </div>
            <h1 className="header-title">AI Chat</h1>
            <div className="header-status">
              <span className="status-dot"></span>
              <span>加载中...</span>
            </div>
          </div>
        </header>
        <main className="chat-area">
          <div className="messages-container flex items-center justify-center">
            <div className="text-center">
              <div className="empty-icon mx-auto mb-4 animate-pulse">
                <HiOutlineSparkles className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500">加载聊天记录...</p>
            </div>
          </div>
        </main>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}