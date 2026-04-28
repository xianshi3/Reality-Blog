# Reality's Personal Blog

Reality's Personal Blog 是一个基于 Next.js 构建的现代化个人博客系统。本项目提供博客展示、文章管理以及后台管理功能，并使用 Supabase 作为后端服务与数据库。项目支持 Markdown 文章渲染、代码高亮以及 AI 对话功能，适合作为个人博客或技术分享平台。

该项目采用 Next.js App Router 架构，并结合 TailwindCSS 实现现代化的前端界面，同时通过 Supabase 提供数据存储与用户认证能力。

<img width="2540" height="1263" alt="TPT" src="https://github.com/user-attachments/assets/2b94da33-2671-4484-9ce2-9c9633c18f6a" />

---

<img width="2539" height="1269" alt="QQ20260306-173221" src="https://github.com/user-attachments/assets/a888e74c-a450-4bdf-82da-0eae6d4a41d5" />

---

<img width="2558" height="1266" alt="QQ20260306-173243" src="https://github.com/user-attachments/assets/29dd8d70-bd2f-4079-b3b6-dfd21dcf0fad" />

## 技术栈

前端框架

- Next.js 16
- React 19
- TypeScript
- TailwindCSS 4

后端服务

- Supabase

内容渲染

- React Markdown
- Remark GFM
- Rehype Highlight
- Highlight.js

动画与交互

- Framer Motion

其他依赖

- Axios
- React Icons
- ZhipuAI SDK


## 本地开发

### 安装依赖

在项目目录中执行：

```bash
npm install
```


### 启动开发服务器

```bash
npm run dev
```

启动成功后，在浏览器访问：

http://localhost:3000

你可以修改 `app/page.tsx` 文件来更新首页内容。Next.js 的热更新机制会自动刷新页面。


## 环境变量配置

在项目根目录创建 `.env.local` 文件，并添加以下环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ZHIPU_API_KEY=your_zhipu_api_key
```

这些配置可以在 Supabase 控制台中获取。


## Supabase 配置

本项目使用 Supabase 作为数据库与用户认证服务。在运行项目之前，需要完成以下配置。


### 创建 Supabase 项目

1. 打开 Supabase 官网

https://supabase.com

2. 登录账号并创建一个新的 Project。

3. 项目创建完成后进入 Project Dashboard。


### 获取 API 配置

进入 Supabase 控制台：

Settings -> API

获取以下信息：

- Project URL
- anon public key
- service role key

然后将这些信息填写到 `.env.local` 文件中。


## 数据库表结构

在 Supabase 的 SQL Editor 中创建文章表：

```sql
create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date timestamp default now(),
  category text,
  summary text,
  content text,
  tags text,
  likes integer default 0,
  image_url text
);
```

字段说明：

- id：文章唯一标识
- title：文章标题
- date：发布时间
- category：文章分类
- summary：文章摘要
- content：文章内容
- tags：文章标签
- likes：点赞数量
- image_url：文章封面图片


## 启用认证系统

后台管理系统依赖 Supabase Auth 进行用户登录。

在 Supabase 控制台中完成以下配置：

1. 进入 Authentication 页面
2. 打开 Providers
3. 启用 Email 登录方式

然后在 Users 页面创建一个管理员账号，用于登录后台系统。


## 后台管理系统

项目提供一个后台管理页面用于管理博客文章。

后台地址：
本地：http://localhost:3000/login
线上：https://reality-blog.vercel.app/login

登录后可以进行以下操作：

- 创建文章
- 编辑文章
- 删除文章
- 管理文章内容

后台管理系统通过 Supabase Auth 进行身份验证，并通过 Supabase 数据库存储文章数据。


## 构建项目

执行以下命令构建生产版本：

```bash
npm run build
```

构建完成后可以运行：

```bash
npm start
```


## 部署

推荐使用 Vercel 部署该项目。

部署步骤：

1. 将项目上传到 GitHub。
2. 在 Vercel 中导入 GitHub 仓库。
3. 配置项目环境变量。
4. 完成部署。

Next.js 项目在 Vercel 平台上可以获得最佳性能与自动化部署能力。


## 相关资源

Next.js 官方文档：
https://nextjs.org/docs

Supabase 官方文档：
https://supabase.com/docs


## License

本项目为开源项目，具体许可协议请参考 LICENSE 文件。
