"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Message } from "../types/message";
import { HiOutlineSparkles } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import { RiRobot2Line, RiUserLine } from "react-icons/ri";
import { IoClose, IoExpand } from "react-icons/io5";

// 用户和 AI 的头像组件
const AVATAR = {
  user: (
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#e5e7eb] dark:bg-[#374151] flex items-center justify-center">
      <RiUserLine className="w-4 h-4 text-[#1f2937] dark:text-[#d1d5db]" />
    </div>
  ),
  assistant: (
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#f3f4f6] dark:bg-[#23272f] flex items-center justify-center">
      <RiRobot2Line className="w-4 h-4 text-[#4b5563] dark:text-[#9ca3af]" />
    </div>
  ),
};

// 消息气泡组件
const MessageBubble = ({ message }: { message: Message }) => (
  <div
    className={`flex gap-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 ${
      message.role === "user" ? "justify-end" : "justify-start"
    }`}
  >
    {message.role === "assistant" && AVATAR.assistant}
    <div
      className={`max-w-[70%] px-3 py-2 text-sm whitespace-pre-wrap break-words shadow-sm
        ${
          message.role === "user"
            ? "bg-[#2563eb] text-white rounded-2xl rounded-tr-none"
            : "bg-white dark:bg-[#23272f] text-[#374151] dark:text-[#cbd5e1] rounded-2xl rounded-tl-none"
        }`}
    >
      {message.content}
    </div>
    {message.role === "user" && AVATAR.user}
  </div>
);

// 聊天顶部栏
const ChatHeader = ({
  onFullscreen,
  onClose,
  onMouseDown,
}: {
  onFullscreen: () => void;
  onClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
}) => (
  <div 
    className="flex items-center justify-between px-4 py-3 bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] dark:from-[#18181b] dark:to-[#23272f] cursor-move select-none"
    onMouseDown={onMouseDown}
  >
    <span className="flex items-center gap-2">
      <HiOutlineSparkles className="w-4 h-4 text-[#2563eb] dark:text-[#60a5fa]" />
      <span className="text-sm font-medium text-[#111827] dark:text-white">
        AI 助手
      </span>
    </span>
    <div className="flex gap-1">
      <button
        onClick={onFullscreen}
        aria-label="全屏"
        className="p-1.5 text-[#6b7280] hover:text-[#2563eb] dark:text-[#9ca3af] dark:hover:text-[#60a5fa] rounded-md hover:bg-white/50 dark:hover:bg-[#374151] transition-colors cursor-pointer"
      >
        <IoExpand className="w-4 h-4" />
      </button>
      <button
        onClick={onClose}
        aria-label="关闭"
        className="p-1.5 text-[#6b7280] hover:text-[#ef4444] dark:text-[#9ca3af] dark:hover:text-[#f87171] rounded-md hover:bg-white/50 dark:hover:bg-[#374151] transition-colors cursor-pointer"
      >
        <IoClose className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// 聊天输入框组件
const ChatInput = ({
  value,
  onChange,
  onSend,
  loading,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  loading: boolean;
}) => (
  <div className="flex items-center gap-2 p-3 bg-white dark:bg-[#23272f]">
    <div className="flex-1 flex items-center bg-[#f3f4f6] dark:bg-[#374151] rounded-full px-4 py-1.5">
      <input
        className="flex-1 bg-transparent border-0 outline-none text-sm text-[#1f2937] dark:text-[#f3f4f6] placeholder-[#9ca3af] dark:placeholder-[#6b7280]"
        placeholder="输入消息..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !loading && onSend()}
        disabled={loading}
      />
    </div>
    <button
      className="bg-[#2563eb] text-white rounded-full w-8 h-8 flex items-center justify-center transition-all
                 hover:bg-[#1d4ed8] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#2563eb]"
      onClick={onSend}
      disabled={loading || !value.trim()}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <IoSend className="w-4 h-4" />
      )}
    </button>
  </div>
);

// 主组件
export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 20, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const searchParams = useSearchParams();

  // 处理打开/关闭动画
  useEffect(() => {
    if (open) {
      // 先计算位置再显示
      if (buttonRef.current && window.innerWidth >= 640) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const chatWidth = 320;
        const chatHeight = 560;
        
        let x = buttonRect.left;
        let y = buttonRect.top - chatHeight - 10;
        
        if (y < 10) {
          y = buttonRect.bottom + 10;
        }
        
        if (x + chatWidth > window.innerWidth - 10) {
          x = window.innerWidth - chatWidth - 10;
        }
        
        if (x < 10) {
          x = 10;
        }
        
        setPosition({ x, y });
      }
      
      // 延迟显示以触发动画
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [open]);

  // 从 URL 参数恢复聊天记录
  useEffect(() => {
    const messagesParam = searchParams.get('messages');
    if (messagesParam) {
      try {
        const parsedMessages = JSON.parse(messagesParam);
        setMessages(parsedMessages);
        const url = new URL(window.location.href);
        url.searchParams.delete('messages');
        window.history.replaceState({}, '', url.toString());
      } catch (error) {
        console.error('Failed to parse messages from URL:', error);
      }
    }
  }, [searchParams]);

  // 从 localStorage 恢复聊天记录
  useEffect(() => {
    const savedMessages = localStorage.getItem('ai-chat-messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }
  }, []);

  // 保存聊天记录到 localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai-chat-messages', JSON.stringify(messages));
    } else {
      localStorage.removeItem('ai-chat-messages');
    }
  }, [messages]);

  // 自动滚动到底部
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 拖动功能
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (window.innerWidth < 640) return;
    
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPos({ x: position.x, y: position.y });
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    let newX = initialPos.x + dx;
    let newY = initialPos.y + dy;

    const container = chatContainerRef.current;
    if (container) {
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      newX = Math.max(10, Math.min(newX, windowWidth - containerWidth - 10));
      newY = Math.max(10, Math.min(newY, windowHeight - containerHeight - 10));
    }

    setPosition({ x: newX, y: newY });
  }, [isDragging, dragStart, initialPos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 发送消息
  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        assistantMessage += text;

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: "assistant", content: assistantMessage };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "AI 服务异常，请稍后再试" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  // 全屏
  const handleFullscreen = useCallback(() => {
    localStorage.setItem('ai-chat-messages', JSON.stringify(messages));
    const queryParams = new URLSearchParams();
    queryParams.set("messages", JSON.stringify(messages));
    router.push(`/ai-chat/fullscreen?${queryParams.toString()}`);
    setOpen(false);
  }, [messages, router]);

  // 清空记录
  const handleClear = useCallback(() => {
    if (window.confirm('确定要清空所有聊天记录吗？')) {
      setMessages([]);
      localStorage.removeItem('ai-chat-messages');
    }
  }, []);

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(true)}
        aria-label="打开AI Chat"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto z-50 group"
      >
        <div className="relative">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-white dark:bg-[#23272f] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200">
            <HiOutlineSparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#2563eb] dark:text-[#60a5fa]" />
          </div>
          <span className="hidden sm:block absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1f2937] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            AI 助手
          </span>
        </div>
      </button>

      {/* 弹出聊天窗口 - 添加过渡动画 */}
      {open && (
        <>
          {/* 移动端遮罩层 - 淡入淡出 */}
          <div 
            className={`fixed inset-0 bg-black/20 dark:bg-black/40 z-40 sm:hidden transition-opacity duration-300 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setOpen(false)}
          />
          
          {/* 聊天窗口 */}
          <div
            ref={chatContainerRef}
            className={`fixed flex flex-col rounded-xl shadow-xl overflow-hidden z-50
                       bg-white dark:bg-[#23272f] transition-all duration-300 ease-out
                       ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{
              // 桌面端：绝对定位
              ...(window.innerWidth >= 640 ? {
                position: 'fixed',
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: '320px',
                maxHeight: 'min(560px, 80vh)',
                height: 'min(560px, 80vh)',
                cursor: isDragging ? 'grabbing' : 'default',
                transformOrigin: 'left top',
              } : {
                // 移动端：底部弹出
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                width: '100%',
                maxHeight: '85vh',
                height: 'min(600px, 90vh)',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.3s ease-out',
              })
            }}
          >
            <ChatHeader 
              onFullscreen={handleFullscreen} 
              onClose={() => setOpen(false)} 
              onMouseDown={handleMouseDown}
            />

            {/* 消息数量提示 */}
            {messages.length > 0 && (
              <div className="flex justify-between items-center px-4 py-2 bg-[#f8fafc] dark:bg-[#18181b]">
                <span className="text-xs text-[#6b7280] dark:text-[#9ca3af]">
                  共 {messages.length} 条消息
                </span>
                <button
                  onClick={handleClear}
                  className="text-xs text-[#6b7280] hover:text-[#ef4444] dark:text-[#9ca3af] dark:hover:text-[#f87171]"
                >
                  清空
                </button>
              </div>
            )}

            {/* 消息内容区 */}
            <div 
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-none"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center h-full animate-in fade-in-0 duration-500">
                  <div className="w-12 h-12 mb-3 rounded-xl bg-[#f3f4f6] dark:bg-[#374151] flex items-center justify-center">
                    <HiOutlineSparkles className="w-5 h-5 text-[#2563eb] dark:text-[#60a5fa]" />
                  </div>
                  <p className="text-sm text-[#1f2937] dark:text-[#f3f4f6] mb-1">开始和 AI 聊天</p>
                  <p className="text-xs text-[#6b7280] dark:text-[#9ca3af]">
                    输入消息开始对话
                  </p>
                </div>
              ) : (
                messages.map((message, idx) => (
                  <MessageBubble key={`${idx}-${message.content}`} message={message} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <ChatInput value={input} onChange={setInput} onSend={handleSend} loading={loading} />
          </div>
        </>
      )}
    </>
  );
}