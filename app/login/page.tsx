"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import "./login.css";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password) {
      setErrorMsg("请输入邮箱和密码");
      return;
    }
    setErrorMsg("");
    setInfoMsg("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/login",
        },
      });

      if (error) {
        setErrorMsg("注册失败：" + error.message);
      } else {
        setInfoMsg("注册成功！请检查邮箱完成验证后再登录。");
      }
    } catch (err: any) {
      setErrorMsg("注册异常：" + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("请输入邮箱和密码");
      return;
    }

    setErrorMsg("");
    setInfoMsg("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg("登录失败：" + error.message);
        setLoading(false);
        return;
      }

      if (data?.session) {
        const res = await fetch("/api/auth/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          setErrorMsg("登录失败，写 cookie 错误：" + err.error);
          setLoading(false);
          return;
        }

        router.push("/admin");
      } else {
        setErrorMsg("登录失败：未获取有效会话");
      }
    } catch (err: any) {
      setErrorMsg("登录异常：" + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg min-h-screen flex items-center justify-center">
      <div className="login-card animate-fade-in-up">
        <h1 className="login-title">管理员登录</h1>

        {errorMsg && (
          <p className="login-error animate-fade-in">{errorMsg}</p>
        )}
        {infoMsg && (
          <p className="login-info animate-fade-in">{infoMsg}</p>
        )}

        <input
          className="login-input"
          placeholder="邮箱"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          className="login-input"
          placeholder="密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          disabled={loading}
          className={`login-btn ${loading ? "login-btn-disabled" : ""}`}
          onClick={handleLogin}
        >
          {loading ? "正在登录..." : "登录"}
        </button>

        {/* 
        <p className="text-center text-sm mt-2">
          还没有账号？{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => {
              setMode("signup");
              setErrorMsg("");
              setInfoMsg("");
            }}
            disabled={loading}
          >
            注册一个
          </button>
        </p>
        */}
      </div>
    </div>
  );
}