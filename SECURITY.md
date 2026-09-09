# 安全策略

## 报告漏洞

如果你发现安全漏洞，请通过 GitHub 的 **Private vulnerability reporting** 功能私密提交，或发送邮件至 [vm1784257751@foxmail.com](mailto:vm1784257751@foxmail.com)。

**请勿在公开 Issue 中披露安全漏洞。**

收到报告后，我们会尽快确认并修复，通常在 7 天内给出响应。

## 已修复问题

| 版本 | 说明 |
|------|------|
| 2026-09 | 后台写接口统一会话校验（`requireUser`），图片上传改走服务端鉴权接口，点赞改为 RPC 原子自增 |

## 安全边界说明

- **真正的安全边界在 API 层**：所有写接口（文章 / 资料 / 存储）由 `requireUser` 调用 `auth.getUser()` 向 Supabase 服务器验证会话，未登录或邮箱不在 `ADMIN_EMAIL` 白名单一律 401
- **`proxy.ts` 只做体验层跳转**：其中从 access_token 本地解码的 email 未经签名验证，仅用于决定是否重定向到登录页，不能作为鉴权依据
