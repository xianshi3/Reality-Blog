"use client";

import React, { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import styles from "./fullscreen-chat.module.css";

import { HiOutlineHome, HiOutlineSparkles, HiOutlinePlus, HiOutlineClock, HiOutlineDownload } from "react-icons/hi";
import { IoSend, IoStop, IoRefresh, IoTrash } from "react-icons/io5";
import { RiRobot2Line, RiUserLine } from "react-icons/ri";
import { BsClipboard, BsClipboardCheck } from "react-icons/bs";
import { VscSymbolKeyword } from "react-icons/vsc";
import { MdEdit } from "react-icons/md";

type Message = {
  role: "user" | "assistant";
  content: string;
  id: string;
  timestamp: number;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  messageCount: number;
};

const STORAGE_KEY = "ai-chat-conversations";
const CURRENT_ID_KEY = "ai-chat-current-id";
const MAX_TITLE_LENGTH = 40;

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

function getConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversations(convs: Conversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
  } catch {}
}

function getCurrentId(): string | null {
  try {
    return localStorage.getItem(CURRENT_ID_KEY);
  } catch {
    return null;
  }
}

function setCurrentId(id: string | null) {
  try {
    if (id) localStorage.setItem(CURRENT_ID_KEY, id);
    else localStorage.removeItem(CURRENT_ID_KEY);
  } catch {}
}

function generateTitle(msgs: Message[]): string {
  const firstUser = msgs.find(m => m.role === "user");
  if (!firstUser) return "新对话";
  const text = firstUser.content.replace(/\n/g, " ").trim();
  return text.length > MAX_TITLE_LENGTH ? text.slice(0, MAX_TITLE_LENGTH) + "…" : text;
}

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
      className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
      title={copied ? "已复制!" : "复制代码"}
    >
      {copied ? <BsClipboardCheck /> : <BsClipboard />}
    </button>
  );
};

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children).replace(/\n$/, "");
  const language = match ? match[1] : "text";

  if (!inline && match) {
    return (
      <div className={styles.codeBlockWrapper}>
        <div className={styles.codeHeader}>
          <span className={styles.codeLanguage}>
            <VscSymbolKeyword />
            {language}
          </span>
          <CopyButton text={code} />
        </div>
        <div className={styles.codeBlockContent}>
          <pre className={`language-${language}`}>
            <code className={className}>{children}</code>
          </pre>
        </div>
      </div>
    );
  }

  return <code className={className} {...props}>{children}</code>;
};

function ChatContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const scrollToBottom = useCallback(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    setConversations(getConversations());
  }, []);

  useEffect(() => {
    const messagesParam = searchParams.get("messages");
    if (messagesParam) {
      try {
        const parsedMessages = JSON.parse(messagesParam);
        const formattedMessages = parsedMessages.map((msg: any) => ({
          ...msg,
          id: generateId(),
        }));
        const convId = generateId();
        setMessages(formattedMessages);
        setCurrentConvId(convId);
        const url = new URL(window.location.href);
        url.searchParams.delete("messages");
        window.history.replaceState({}, "", url.toString());
      } catch (error) {
        console.error("Failed to parse messages from URL:", error);
      }
    } else {
      const savedId = getCurrentId();
      if (savedId) {
        const convs = getConversations();
        const found = convs.find(c => c.id === savedId);
        if (found) {
          setMessages(found.messages);
          setCurrentConvId(found.id);
        }
      }
    }
  }, [searchParams]);

  const persistConversations = useCallback((msgs: Message[], convId: string | null) => {
    if (msgs.length === 0) return;
    const id = convId || generateId();
    if (!convId) setCurrentConvId(id);

    const now = Date.now();
    const title = generateTitle(msgs);

    setConversations(prev => {
      const existing = prev.findIndex(c => c.id === id);
      const entry: Conversation = {
        id,
        title,
        messages: msgs,
        createdAt: existing >= 0 ? prev[existing].createdAt : now,
        updatedAt: now,
        messageCount: msgs.length,
      };
      const next = existing >= 0
        ? [...prev.slice(0, existing), entry, ...prev.slice(existing + 1)]
        : [entry, ...prev];
      saveConversations(next);
      setCurrentId(id);
      return next;
    });

    return id;
  }, []);

  useEffect(() => {
    if (messages.length > 0 && !loading) {
      persistConversations(messages, currentConvId);
    }
  }, [messages, loading, currentConvId, persistConversations]);

  useEffect(() => {
    if (editingMsgId && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.setSelectionRange(
        editTextareaRef.current.value.length,
        editTextareaRef.current.value.length
      );
    }
  }, [editingMsgId]);

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setLoading(false);
  };

  const sendMessages = useCallback(async (msgs: Message[]) => {
    setError(null);

    const assistantMsg: Message = {
      role: "assistant",
      content: "",
      id: generateId(),
      timestamp: Date.now() + 1,
    };

    setMessages(prev => [...prev, assistantMsg]);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: msgs.map(m => ({ role: m.role, content: m.content }))
        }),
        signal: controller.signal,
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
      if (error.name === "AbortError") return;
      console.error("Error:", error);
      setError(error.message || "发送失败，请重试");
      setMessages(prev => prev.filter(msg => msg.id !== assistantMsg.id));
    } finally {
      setLoading(false);
      abortRef.current = null;
      textareaRef.current?.focus();
    }
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      content: input.trim(),
      id: generateId(),
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    sendMessages(newMessages);
  }, [input, loading, messages, sendMessages]);

  const handleRetry = useCallback((userMsgIndex: number) => {
    const msgs = messages.slice(0, userMsgIndex + 1);
    setMessages(msgs);
    sendMessages(msgs);
  }, [messages, sendMessages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setError(null);
    setInput("");
    setCurrentConvId(null);
    setEditingMsgId(null);
    setSidebarOpen(false);
  };

  const handleCopyMessage = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const handleLoadConversation = (conv: Conversation) => {
    setMessages(conv.messages);
    setCurrentConvId(conv.id);
    setError(null);
    setEditingMsgId(null);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConversations(prev => {
      const next = prev.filter(c => c.id !== id);
      saveConversations(next);
      return next;
    });
    if (currentConvId === id) {
      setMessages([]);
      setCurrentConvId(null);
    }
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "昨天";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const handleExportMarkdown = () => {
    if (messages.length === 0) return;
    let md = `# AI Chat 对话记录\n\n`;
    md += `> 导出时间: ${new Date().toLocaleString()}\n\n`;
    md += `---\n\n`;

    for (const msg of messages) {
      const label = msg.role === "user" ? "**你**" : "**AI Chat**";
      md += `### ${label}\n\n`;
      md += `${msg.content}\n\n`;
    }

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEditStart = (msg: Message) => {
    if (loading) return;
    setEditingMsgId(msg.id);
    setEditContent(msg.content);
  };

  const handleEditCancel = () => {
    setEditingMsgId(null);
    setEditContent("");
  };

  const handleEditSave = () => {
    if (!editingMsgId || !editContent.trim()) return;

    const msgIndex = messages.findIndex(m => m.id === editingMsgId);
    if (msgIndex < 0) return;

    const updatedMsg: Message = {
      ...messages[msgIndex],
      content: editContent.trim(),
    };

    const truncated = messages.slice(0, msgIndex + 1);
    truncated[msgIndex] = updatedMsg;

    setMessages(truncated);
    setEditingMsgId(null);
    setEditContent("");

    sendMessages(truncated);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    }
    if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  return (
    <div className={styles.app}>
      {sidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>历史记录</h2>
          <button
            className={styles.sidebarClose}
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>
        <div className={styles.sidebarList}>
          {conversations.length === 0 ? (
            <div className={styles.sidebarEmpty}>暂无对话记录</div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                className={`${styles.sidebarItem} ${conv.id === currentConvId ? styles.sidebarItemActive : ""}`}
                onClick={() => handleLoadConversation(conv)}
              >
                <div className={styles.sidebarItemTitle}>{conv.title}</div>
                <div className={styles.sidebarItemMeta}>
                  <span>{formatDate(conv.updatedAt)}</span>
                  <span>{conv.messageCount} 条消息</span>
                </div>
                <button
                  className={styles.sidebarItemDelete}
                  onClick={(e) => handleDeleteConversation(e, conv.id)}
                  title="删除"
                >
                  <IoTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.headerMenuBtn}
            onClick={() => setSidebarOpen(true)}
            title="历史记录"
          >
            <HiOutlineClock />
          </button>
          <div className={styles.headerLogo}>
            <HiOutlineSparkles className={styles.headerIcon} />
          </div>
          <h1 className={styles.headerTitle}>AI Chat</h1>
          <div className={`${styles.headerStatus} ${loading ? styles.thinking : ""}`}>
            <span className={styles.statusDot}></span>
            <span>{loading ? "思考中..." : "在线"}</span>
          </div>
        </div>
        <div className="flex gap-3">
          {messages.length > 0 && (
            <button className={styles.headerAction} onClick={handleExportMarkdown} title="导出 Markdown">
              <HiOutlineDownload />
              <span>导出</span>
            </button>
          )}
          <button className={styles.headerAction} onClick={handleNewChat} title="新建对话">
            <HiOutlinePlus />
            <span>新建</span>
          </button>
          <button className={styles.headerAction} onClick={() => router.push("/")}>
            <HiOutlineHome />
            <span>首页</span>
          </button>
        </div>
      </header>

      <main className={styles.chatArea} ref={chatAreaRef}>
        <div className={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <HiOutlineSparkles />
              </div>
              <h2>开始新的对话</h2>
              <p>输入消息，开始与AI助手交流</p>
              <div className={styles.emptySuggestions}>
                <button className={styles.suggestionChip} onClick={() => setInput("你能做什么？")}>你能做什么？</button>
                <button className={styles.suggestionChip} onClick={() => setInput("写一首诗")}>写一首诗</button>
                <button className={styles.suggestionChip} onClick={() => setInput("解释量子计算")}>解释量子计算</button>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`${styles.messageItem} ${msg.role === "user" ? styles.user : ""}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.messageAvatar}>
                  {msg.role === "user" ? <RiUserLine /> : <RiRobot2Line />}
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.messageSender}>
                    {msg.role === "user" ? "你" : "AI Chat"}
                    <span className={styles.messageTime}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {editingMsgId === msg.id ? (
                    <div className={styles.editContainer}>
                      <textarea
                        ref={editTextareaRef}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        className={styles.editTextarea}
                      />
                      <div className={styles.editActions}>
                        <span className={styles.editHint}>Enter 保存 · Esc 取消 · Shift+Enter 换行</span>
                        <div className="flex gap-2">
                          <button onClick={handleEditCancel} className={styles.editCancelBtn}>取消</button>
                          <button onClick={handleEditSave} className={styles.editSaveBtn}>保存</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.messageBubble}>
                      {msg.role === "assistant" && msg.content === "" ? (
                        <div className={styles.typingIndicator}>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      ) : msg.role === "assistant" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{ code: CodeBlock }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  )}
                  {!editingMsgId && msg.role === "user" && !loading && (
                    <div className={styles.messageActions}>
                      <button
                        className={styles.messageActionBtn}
                        onClick={() => handleEditStart(msg)}
                        title="编辑"
                      >
                        <MdEdit />
                      </button>
                    </div>
                  )}
                  {!editingMsgId && msg.role === "assistant" && msg.content && !loading && (
                    <div className={styles.messageActions}>
                      <button
                        className={styles.messageActionBtn}
                        onClick={() => {
                          const userIdx = index - 1;
                          if (userIdx >= 0 && messages[userIdx].role === "user") {
                            handleRetry(userIdx);
                          }
                        }}
                        title="重新生成"
                      >
                        <IoRefresh />
                      </button>
                      <button
                        className={styles.messageActionBtn}
                        onClick={() => handleCopyMessage(msg.content)}
                        title="复制回复"
                      >
                        <BsClipboard />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {error && (
            <div className={styles.errorMessage}>
              <span>{error}</span>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => {
                    const lastUserIdx = messages
                      .map((m, i) => (m.role === "user" ? i : -1))
                      .filter(i => i >= 0)
                      .pop();
                    if (lastUserIdx !== undefined) handleRetry(lastUserIdx);
                  }}
                  className="flex items-center gap-1 text-xs hover:underline"
                >
                  <IoRefresh /> 重试
                </button>
                <button onClick={() => setError(null)} className={styles.errorClose}>×</button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <div className={styles.inputArea}>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息... (Shift + Enter 换行)"
              disabled={loading}
              className={styles.chatInput}
              rows={1}
            />
          </div>
          <div className={styles.buttonGroup}>
            {loading ? (
              <button onClick={handleStop} className={styles.stopBtn} title="停止生成">
                <IoStop />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={styles.sendBtn}
                title="发送 (Enter)"
              >
                <IoSend />
              </button>
            )}
          </div>
        </div>
        <div className={styles.inputHint}>
          <span>{loading ? "AI 正在思考... 点击红色按钮停止" : "Enter 发送 · Shift + Enter 换行"}</span>
          {input.length > 0 && (
            <span className={`${styles.charCount} ${input.length > 2000 ? styles.warning : ""}`}>
              {input.length}/2000
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FullscreenChat() {
  return (
    <Suspense fallback={
      <div className={styles.app}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerLogo}>
              <HiOutlineSparkles className={styles.headerIcon} />
            </div>
            <h1 className={styles.headerTitle}>AI Chat</h1>
            <div className={styles.headerStatus}>
              <span className={styles.statusDot}></span>
              <span>加载中...</span>
            </div>
          </div>
        </header>
        <main className={styles.chatArea}>
          <div className={`${styles.messagesContainer} flex items-center justify-center`}>
            <div className="text-center">
              <div className={`${styles.emptyIcon} mx-auto mb-4 animate-pulse`}>
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
