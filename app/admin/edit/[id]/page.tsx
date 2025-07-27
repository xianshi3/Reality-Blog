"use client";

import "./edit-article.css";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditArticle() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 新增状态：保存图片文件，和上传中状态
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("加载文章失败：" + error.message);
        router.push("/admin");
        return;
      }

      if (data) {
        setForm(data);
      }
      setLoading(false);
    })();
  }, [id, router]);

  // 选图片时只保存文件，不上传
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
  };

  // 点击保存时，先上传图片（如果有），然后更新文章
  const handleUpdate = async () => {
    if (!form || saving) return;
    if (!form.title) {
      alert("标题不能为空");
      return;
    }

    setSaving(true);

    let imageUrl = form.image_url || ""; // 默认用原来图片地址

    if (imageFile) {
      setUploading(true);
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      try {
        const { error: uploadError } = await supabase.storage
          .from("article-images")
          .upload(fileName, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("article-images").getPublicUrl(fileName);
        if (!data?.publicUrl) throw new Error("获取图片地址失败");
        imageUrl = data.publicUrl;
      } catch (error: any) {
        alert("图片上传失败：" + error.message);
        setUploading(false);
        setSaving(false);
        return;
      }
      setUploading(false);
    }

    // 准备更新的数据，排除 id
    const { id: _id, ...updateData } = form;
    // 更新 image_url
    updateData.image_url = imageUrl;

    // 清理空字段
    if (!updateData.date) delete updateData.date;
    if (!updateData.summary) delete updateData.summary;
    if (!updateData.content) delete updateData.content;
    if (!updateData.category) delete updateData.category;
    if (!updateData.tags) delete updateData.tags;
    if (!updateData.image_url) delete updateData.image_url;

    const { error } = await supabase.from("articles").update(updateData).eq("id", id);

    setSaving(false);

    if (error) {
      alert("更新失败：" + error.message);
    } else {
      router.push("/admin");
    }
  };

  const handleBack = () => {
    router.push("/admin");
  };

  const insertCodeBlock = () => {
    const codeBlockTemplate = "\n```js\n// 这里写代码\n```\n";
    setForm((f: any) => ({
      ...f,
      content: (f.content || "") + codeBlockTemplate,
    }));
  };

  if (loading || !form) {
    return <div className="text-center text-gray-500 mt-20">加载中...</div>;
  }

  return (
    <>
      <button
        onClick={handleBack}
        className="edit-back-button"
        aria-label="返回管理页"
        type="button"
      >
        ← 返回
      </button>

      <div className="edit-container" style={{ paddingTop: "3rem" }}>
        <h2 className="edit-title">编辑文章</h2>

        {/* 插入代码块按钮 */}
        <button
          type="button"
          onClick={insertCodeBlock}
          className="edit-button mb-4"
          style={{ backgroundColor: "#10b981" }} // 绿色按钮
          disabled={saving}
        >
          插入代码块
        </button>

        {/* 图片选择按钮 */}
        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="image-upload"
            className="edit-button cursor-pointer"
            style={{ backgroundColor: "#3b82f6" }} // 蓝色按钮
          >
            {uploading
              ? "上传中..."
              : imageFile
              ? "更改图片"
              : form.image_url
              ? "更改图片"
              : "选择封面图片"}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            disabled={uploading || saving}
            className="hidden"
          />
          {/* 预览图片：优先显示本地选中的图片，否则显示已有图片 */}
          {imageFile ? (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="预览封面"
              style={{ marginTop: 8, maxHeight: 160, borderRadius: 8, border: "1px solid #ddd", objectFit: "contain" }}
            />
          ) : form.image_url ? (
            <img
              src={form.image_url}
              alt="封面"
              style={{ marginTop: 8, maxHeight: 160, borderRadius: 8, border: "1px solid #ddd", objectFit: "contain" }}
            />
          ) : null}
        </div>

        <input
          className="edit-input"
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="文章标题"
          disabled={saving}
        />

        <input
          className="edit-input"
          value={form.summary || ""}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          placeholder="文章摘要"
          disabled={saving}
        />

        <textarea
          className="edit-textarea"
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="文章内容（支持 Markdown）"
          disabled={saving}
        />

        <input
          className="edit-input"
          value={form.category || ""}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="分类"
          disabled={saving}
        />

        <input
          className="edit-input"
          value={form.tags || ""}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="标签（逗号分隔）"
          disabled={saving}
        />

        <input
          className="edit-input"
          type="date"
          value={form.date || ""}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          disabled={saving}
        />

        <button
          onClick={handleUpdate}
          disabled={saving}
          className="edit-button mt-4"
        >
          {saving && <div className="spinner" />}
          {saving ? "保存中..." : "保存修改"}
        </button>
      </div>
    </>
  );
}
