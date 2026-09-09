# 安全策略

## 报告漏洞

如果你发现安全漏洞，请通过 GitHub 的 **Private vulnerability reporting** 功能私密提交，或发送邮件至 [vm1784257751@foxmail.com](mailto:vm1784257751@foxmail.com)。

**请勿在公开 Issue 中披露安全漏洞。**

收到报告后，我们会尽快确认并修复，通常在 7 天内给出响应。

## 已修复问题

| 版本 | 说明 |
|------|------|
| 2026-09 | 后台写接口统一会话校验（`requireUser`），图片上传改走服务端鉴权接口，点赞改为 RPC 原子自增 |
