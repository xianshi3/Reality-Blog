"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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

      console.log("🟢 注册响应：", { data, error });

      if (error) {
        if (error.message.includes("Password")) {
          setErrorMsg("❌ 注册失败：密码不符合要求，请使用更复杂的密码。");
        } else if (error.message.includes("email")) {
          setErrorMsg("❌ 注册失败：邮箱格式无效或已被注册。");
        } else {
          setErrorMsg("❌ 注册失败：" + error.message);
        }
      } else {
        setInfoMsg("✅ 注册成功！请前往邮箱点击验证链接，验证后才能登录。");
      }
    } catch (err: any) {
      console.error("🚨 注册异常：", err);
      setErrorMsg("注册时发生错误：" + (err.message || JSON.stringify(err)));
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

      console.log("🔐 登录响应：", { data, error });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMsg("❌ 登录失败：账号或密码错误，或邮箱尚未验证。");
        } else if (error.status === 429) {
          setErrorMsg("⚠️ 登录频率过高，请稍后再试。");
        } else if (error.status === 400 && error.message.includes("email")) {
          setErrorMsg("⚠️ 邮箱格式无效或用户不存在。");
        } else {
          setErrorMsg(`❌ 登录失败（${error.status || "未知错误"}）：${error.message}`);
        }
      } else if (data?.session) {
        console.log("✅ 登录成功，会话信息：", data.session);
        router.push("/admin");
      } else {
        setErrorMsg("登录失败：无有效会话，请检查邮箱是否已验证。");
      }
    } catch (err: any) {
      console.error("🚨 登录异常：", err);
      setErrorMsg("登录时发生未知错误：" + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 shadow rounded w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">
          {mode === "login" ? "管理员登录" : "注册账号"}
        </h1>

        {errorMsg && (
          <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{errorMsg}</p>
        )}
        {infoMsg && (
          <p className="text-green-600 text-sm bg-green-50 p-2 rounded">{infoMsg}</p>
        )}

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="邮箱"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        {mode === "login" ? (
          <>
            <button
              disabled={loading}
              className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleLogin}
            >
              {loading ? "正在登录..." : "登录"}
            </button>
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
          </>
        ) : (
          <>
            <button
              disabled={loading}
              className={`w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSignup}
            >
              {loading ? "正在注册..." : "注册"}
            </button>
            <p className="text-center text-sm mt-2">
              已有账号？{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                  setInfoMsg("");
                }}
                disabled={loading}
              >
                登录
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
