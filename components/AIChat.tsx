"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Message } from "../types/message";

const AVATAR = {
  user: (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow">
      我
    </div>
  ),
  assistant: (
    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gradient font-extrabold tracking-wide shadow select-none">
      LLM
    </div>
  ),
};

const MessageBubble = ({ message }: { message: Message }) => (
  <div
    className={`flex gap-3 animate-message-in ${
      message.role === "user" ? "justify-end" : "justify-start"
    }`}
  >
    {message.role === "assistant" && AVATAR.assistant}
    <div
      className={`max-w-[80%] min-w-[120px] px-4 py-3 rounded-xl text-sm whitespace-pre-line shadow
        transition-all duration-200 
        ${
          message.role === "user"
            ? "bg-white text-[#111827] rounded-br-sm dark:bg-[#23272f] dark:text-[#f3f4f6]"
            : "bg-white text-[#111827] rounded-bl-sm dark:bg-[#23272f] dark:text-[#f3f4f6]"
        }`}
    >
      {message.content}
    </div>
    {message.role === "user" && AVATAR.user}
  </div>
);

const ChatHeader = ({
  onFullscreen,
  onClose,
}: {
  onFullscreen: () => void;
  onClose: () => void;
}) => (
  <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-[#23272f] dark:to-[#23273f] rounded-t-xl border border-gray-200 dark:border-gray-700">
    <span className="flex items-center gap-2 font-semibold text-lg">
      <span className="text-xl font-extrabold tracking-wide text-gradient select-none">
        LLM
      </span>
    </span>
    <div className="flex gap-2">
      <button
        className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 text-xl font-bold transition"
        onClick={onFullscreen}
        aria-label="全屏"
      >
        全屏
      </button>
      <button
        className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 text-xl font-bold transition"
        onClick={onClose}
        aria-label="关闭"
      >
        ×
      </button>
    </div>
  </div>
);

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
  <div className="flex items-center gap-2 px-4 py-3 border-t border-[#e5e7eb] dark:border-[#374151] bg-white dark:bg-[#23272f]">
    <input
      className="flex-1 border border-[#e5e7eb] rounded-lg px-4 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-400
                 dark:border-[#374151] dark:bg-[#23272f] dark:text-[#f3f4f6] transition-shadow shadow-inner"
      placeholder="请输入你的问题..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && !loading && onSend()}
      disabled={loading}
    />
    <button
      className="bg-white text-[#111827] border border-[#e5e7eb] rounded-lg px-4 py-2 font-medium shadow-sm
                hover:bg-[#f8fafc] active:bg-[#e0e7ef] disabled:opacity-50 disabled:cursor-not-allowed
                dark:bg-[#23272f] dark:text-[#f3f4f6] dark:border-[#374151] dark:hover:bg-[#2a2f3a] dark:active:bg-[#1c1f24]
                transition duration-200 ease-in-out"
      onClick={onSend}
      disabled={loading}
    >
      {loading ? (
        <span className="inline-flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#111827] dark:text-[#f3f4f6]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          发送中
        </span>
      ) : (
        "发送"
      )}
    </button>
  </div>
);

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[aria-label="打开AI Chat"]')
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = res.ok ? await res.json() : { reply: "AI 服务异常" };
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "AI 服务异常，请稍后再试" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleFullscreen = useCallback(() => {
    const queryParams = new URLSearchParams();
    queryParams.set("messages", JSON.stringify(messages));
    router.push(`/ai-chat/fullscreen?${queryParams.toString()}`);
  }, [messages, router]);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        className="w-14 h-14 flex items-center justify-center rounded-2xl 
                   bg-white/30 dark:bg-[#23272f]/30 backdrop-blur-lg 
                   bg-white/20 dark:bg-gray-600/20 
                   shadow-lg text-2xl hover:scale-110 transition-all duration-200 
                   active:scale-95 text-gray-800 dark:text-white hover:bg-white/50 dark:hover:bg-[#2c2f3a]"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="打开AI Chat"
      >
        <span className="text-gradient font-extrabold tracking-wide select-none">
          LLM
        </span>
      </button>

      {open && (
        <div
          ref={chatContainerRef}
          className="fixed bottom-24 left-6 w-[380px] max-w-[calc(100vw-48px)] flex flex-col rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700
                     bg-gradient-to-br from-white to-gray-50 dark:from-[#1c1f24] dark:to-[#2a2f3a] 
                     backdrop-blur-xl transition-all duration-300 origin-bottom-left overflow-hidden
                     animate-chat-fade-in"
          style={{
            maxHeight: "calc(100vh - 120px)",
            height: "min(600px, 70vh)",
          }}
        >
          <ChatHeader
            onFullscreen={handleFullscreen}
            onClose={() => setOpen(false)}
          />

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50/50 dark:bg-gray-900/50 scrollbar">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-gray-400 text-sm text-center select-none p-8">
                <div className="text-gradient text-4xl mb-2 font-extrabold tracking-wide">
                  LLM
                </div>
                <p>和 AI 聊聊</p>
                <p className="text-xs mt-2 text-gray-300 dark:text-gray-500">
                  输入你的问题开始对话
                </p>
              </div>
            ) : (
              messages.map((message, idx) => (
                <MessageBubble key={idx} message={message} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
