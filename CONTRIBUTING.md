# 贡献指南

感谢你对 Reality Blog 的关注！欢迎提交 Issue 和 Pull Request。

## 开始之前

- 先搜索 [Issues](https://github.com/xianshi3/Reality-Blog/issues)，确认没有重复
- 新功能建议先开 Issue 讨论方案，避免白费功夫
- 安全漏洞请走 [SECURITY.md](./SECURITY.md) 的私密渠道

## 开发流程

```bash
# 1. Fork 并克隆
git clone https://github.com/<your-name>/Reality-Blog.git
cd Reality-Blog

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 填入你自己的 Supabase / ZhipuAI 密钥

# 4. 初始化数据库
# 在 Supabase SQL Editor 中执行 schema.sql

# 5. 启动开发服务器
npm run dev
```

## 提交规范

- 提交信息用中文描述，格式参考现有提交：`修复 xxx` / `新增 xxx` / `更新 xxx`
- 一个提交只做一件事
- 在 PR 描述中填写模板并勾选自查清单

## 代码规范

- 提交前必须通过：

```bash
npm run lint          # ESLint
npx tsc --noEmit      # TypeScript 类型检查
npm run build         # 生产构建
```

- 遵循现有目录结构：`src/app`（路由）、`src/components`（按领域分组的组件）、`src/lib`（工具）、`src/config`（站点配置，如 GitHub 精选仓库）
- 新增环境变量必须同步更新 `.env.example` 与 README 的「环境变量」章节

## 数据库变更

涉及数据库结构变更时，同步更新 [schema.sql](./schema.sql) 的建表脚本和升级脚本，保证新部署者可以一键初始化。

## 许可证

贡献的代码将在 [MIT](./LICENSE) 许可证下发布。
