import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">
          未登录，请先访问{' '}
          <a href="/login" className="text-blue-500 underline">
            登录页面
          </a>
        </p>
      </div>
    );
  }

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, date')
    .order('date', { ascending: false });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">博客管理后台</h1>
      <Link href="/admin/create" className="text-blue-500 underline mb-4 block">
        ➕ 新建文章
      </Link>
      <ul className="space-y-4">
        {articles?.map((article) => (
          <li key={article.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <span className="font-medium">{article.title}</span> -{' '}
              <span className="text-sm text-gray-500">{article.date}</span>
            </div>
            <div>
              <Link href={`/admin/edit/${article.id}`} className="text-blue-600">
                编辑
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
