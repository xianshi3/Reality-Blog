import type { Article } from "@/types/article";
import CategoryPageClient from "./CategoryPageClient";
import { createServerSupabase } from "@/lib/supabaseServer";
import { parseTags } from "@/lib/parseTags";

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

  const articles: Article[] = data.map((item) => ({
    ...item,
    tags: parseTags(item.tags),
  }));

  return <CategoryPageClient articles={articles} />;
}
