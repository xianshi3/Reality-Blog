# 安全策略

## 报告漏洞

如果你发现安全漏洞，请通过 GitHub 的 **Private vulnerability reporting** 功能私密提交，或发送邮件至 [vm1784257751@foxmail.com](mailto:vm1784257751@foxmail.com)。

**请勿在公开 Issue 中披露安全漏洞。**

收到报告后，我们会尽快确认并修复，通常在 7 天内给出响应。

## 已修复问题

| 版本 | 说明 |
|------|------|
| 2026-09 | 后台写接口统一会话校验（`requireUser`），图片上传改走服务端鉴权接口，点赞改为 RPC 原子自增 |
| 2026-09 | 收紧 RLS：数据库只保留公开 `SELECT`，写操作全部改走 service role，杜绝任意注册用户越权增删改 |
| 2026-09 | AI 聊天限流升级为跨实例（数据库 RPC 计数 + 进程内兜底），点赞增加前端本地去重 |

## 安全边界说明

- **真正的安全边界在 API 层**：所有写接口（文章 / 资料 / 存储）由 `requireUser` 调用 `auth.getUser()` 向 Supabase 服务器验证会话，未登录或邮箱不在 `ADMIN_EMAIL` 白名单一律 401
- **写操作使用 service role 落库**：`/api/article`、`/api/profile`、`/api/storage` 校验通过后使用 `SUPABASE_SERVICE_ROLE_KEY`（绕过 RLS）执行写入；数据库仅保留公开 `SELECT` 策略，任何注册用户都无法通过 anon key 直接增删改
- **`proxy.ts` 只做体验层跳转**：后台 / 登录页跳转基于 `auth.getUser()`（经 Supabase 服务器验签）的邮箱判断，最终安全仍由 API 层保证

## 其他防护

- **AI 接口限流**：`/api/chat` 与 `/api/article/[id]/summary` 按 IP 限流，计数存储在 `rate_limits` 表中通过 `rate_limit_check` RPC 原子更新，跨 Serverless 实例共享；未配置 `SUPABASE_SERVICE_ROLE_KEY` 时回退到进程内限流
- **匿名点赞去重**：点赞为匿名操作，服务端无身份可依赖，前端通过 `localStorage` 记录已赞文章，避免同一浏览器重复点赞；如需强去重请引入登录态

## 已知限制

- 匿名点赞的去重是「客户端级」的（依赖 `localStorage`），清除浏览器数据后即可再次点赞，这是无身份系统的固有限制
