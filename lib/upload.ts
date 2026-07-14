import { supabase } from "./supabaseClient";

export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("article-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("article-images").getPublicUrl(fileName);
  if (!data?.publicUrl) throw new Error("获取图片地址失败");

  return data.publicUrl;
}
