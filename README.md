# Reality's Personal Blog

Welcome to **Reality's Personal Blog**, a modern, fast, and fully optimized Next.js project. This documentation will help you get started quickly and make the most out of the project.

## Getting Started

### Run the Development Server

Start your local development server using one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

打开 [http://localhost:3000](http://localhost:3000) in your browser to see your blog live locally. You can edit `app/page.tsx` to update the homepage, and changes will reflect instantly thanks to Next.js's fast refresh.

### Environment Variables

For local development, create a `.env.local` file at the root of your project and add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can obtain these credentials from your [Supabase dashboard](https://app.supabase.com).

### Supabase Configuration

This project uses **Supabase** as its backend service. Ensure your environment variables are set correctly to fetch and store your blog data seamlessly.

## Features

- **Optimized Fonts**: Utilizes [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize the beautiful [Geist font](https://vercel.com/font).
- **Fast Refresh**: Real-time updates while editing your blog.
- **Easy Deployment**: Deploy effortlessly to [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

## Learn More

Enhance your Next.js knowledge with these resources:

- [Next.js Documentation](https://nextjs.org/docs) - Official documentation with all features and APIs.
- [Learn Next.js](https://nextjs.org/learn) - Interactive tutorials for beginners and advanced users.
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - Explore the source code and contribute.

## Deploy on Vercel

The simplest way to publish your blog online is via the **Vercel Platform**. It's designed by the creators of Next.js and provides seamless integration.

- Deploy instantly: [Vercel Deployment](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
- Detailed instructions: [Next.js Deployment Guide](https://nextjs.org/docs/app/building-your-application/deploying)

---

Enjoy building and customizing **Reality's Personal Blog**! Make it your own, share your thoughts, and showcase your projects to the world.

