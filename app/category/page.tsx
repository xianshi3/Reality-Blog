import type { Article } from "@/types/article";
import CategoryPageClient from "./CategoryPageClient";

import { createServerSupabase } from "@/lib/supabaseServer";

export default async function CategoryPage() {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.from("articles").select("*");

  if (error || !data) {
    return (
      <div className="text-center mt-10 text-red-500">
        无法加载文章数据，请稍后重试。
      </div>
    );
  }

  const articles = data as Article[];

  return <CategoryPageClient articles={articles} />;
}
