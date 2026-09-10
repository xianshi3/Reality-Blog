-- ============================================================
-- Reality Blog - 数据库完整建表脚本
-- 在 Supabase SQL Editor 中执行即可
-- ============================================================

-- ==================== 文章表 ====================
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date timestamp without time zone DEFAULT now(),
  category text,
  summary text,
  content text,
  tags text DEFAULT '{}',
  image_url text,
  likes integer DEFAULT 0,
  ai_summary text,
  CONSTRAINT articles_pkey PRIMARY KEY (id)
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 前台匿名可读
CREATE POLICY "articles_select_public" ON public.articles
  FOR SELECT USING (true);

-- 写操作（增删改）不开放给匿名/认证用户：
-- 所有写入统一经由服务端 API（/api/article），由 requireUser 校验会话后
-- 使用 service role key 落库（绕过 RLS）。因此这里不再创建任何写策略，
-- 任何注册用户都无法通过 anon key 直接修改文章。

-- ==================== 个人信息表 ====================
CREATE TABLE IF NOT EXISTS public.profile (
  id integer NOT NULL DEFAULT 1 CHECK (id = 1),
  name text NOT NULL DEFAULT 'Reality',
  title text NOT NULL DEFAULT 'Full Stack Developer',
  avatar_url text NOT NULL DEFAULT '/avatar.png',
  github_url text NOT NULL DEFAULT 'https://github.com/xianshi3',
  twitter_url text NOT NULL DEFAULT 'https://x.com/xianshi_3',
  parallax_image_url text NOT NULL DEFAULT '/parallax-bg.png',
  parallax_title text NOT NULL DEFAULT 'Reality Blog',
  parallax_subtitle text NOT NULL DEFAULT '探索技术与世界的边界',
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profile_pkey PRIMARY KEY (id)
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profile_select_public" ON public.profile
  FOR SELECT USING (true);

-- 写操作（upsert）同样经由服务端 API（/api/profile）使用 service role 落库，
-- 不开放任何写策略，防止任意注册用户越权修改个人信息。

-- 插入默认个人信息
INSERT INTO public.profile (id, name, title, avatar_url, github_url, twitter_url, parallax_image_url, parallax_title, parallax_subtitle)
VALUES (1, 'Reality', 'Full Stack Developer', '/avatar.png', 'https://github.com/xianshi3', 'https://x.com/xianshi_3', '/parallax-bg.png', 'Reality Blog', '探索技术与世界的边界')
ON CONFLICT (id) DO NOTHING;

-- ==================== 点赞原子自增函数 ====================
-- SECURITY DEFINER 绕过 RLS，允许匿名访客点赞，且 UPDATE 原子执行无竞态
-- 后台写接口已改为服务端鉴权，此函数仅允许自增 likes 字段，无越权风险
CREATE OR REPLACE FUNCTION public.increment_likes(article_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_likes integer;
BEGIN
  UPDATE public.articles
  SET likes = COALESCE(likes, 0) + 1
  WHERE id = article_id
  RETURNING likes INTO new_likes;

  IF new_likes IS NULL THEN
    RAISE EXCEPTION 'article not found';
  END IF;

  RETURN new_likes;
END;
$$;

-- ==================== 限流表（AI 聊天跨实例限流） ====================
-- 进程内限流在 Serverless 多实例下失效，这里用数据库做跨实例共享的计数
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key text NOT NULL,
  hits integer NOT NULL DEFAULT 0,
  window_start bigint NOT NULL,
  CONSTRAINT rate_limits_pkey PRIMARY KEY (key)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
-- 不开放任何策略：仅服务端 service role 通过下方 RPC 访问

-- 原子校验并计数：窗口过期则重置为 1，否则 +1；返回是否在限额内
CREATE OR REPLACE FUNCTION public.rate_limit_check(p_key text, p_window_ms bigint, p_max integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now bigint := (extract(epoch from clock_timestamp()) * 1000)::bigint;
  v_hits integer;
BEGIN
  UPDATE public.rate_limits
  SET hits = CASE WHEN window_start + p_window_ms <= v_now THEN 1 ELSE hits + 1 END,
      window_start = CASE WHEN window_start + p_window_ms <= v_now THEN v_now ELSE window_start END
  WHERE key = p_key
  RETURNING hits INTO v_hits;

  IF NOT FOUND THEN
    INSERT INTO public.rate_limits (key, hits, window_start)
    VALUES (p_key, 1, v_now)
    ON CONFLICT (key) DO NOTHING;
    RETURN true;
  END IF;

  RETURN v_hits <= p_max;
END;
$$;

-- 仅允许 service role 调用，避免匿名用户直接操纵计数
REVOKE ALL ON FUNCTION public.rate_limit_check(text, bigint, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.rate_limit_check(text, bigint, integer) TO service_role;

-- ==================== 存储桶 ====================
-- 在 Supabase Dashboard → Storage 手动创建 article-images 桶
-- 或者执行下方 SQL（需要 service_role key，建议在 Dashboard 操作）
-- INSERT INTO storage.buckets (id, name, public) VALUES ('article-images', 'article-images', true);

-- 上传已改为走服务端鉴权接口（service role），桶无需再对匿名用户开放上传。
-- 建议在 Dashboard → Storage → Policies 中撤销 article-images 的匿名 INSERT 策略，
-- 仅保留匿名 SELECT（公开读取）即可。

-- ==================== 已有数据库升级脚本 ====================
-- 如果 profile 表已存在但缺少视差字段，执行下方 SQL：
-- ALTER TABLE public.profile
--   ADD COLUMN IF NOT EXISTS parallax_image_url text NOT NULL DEFAULT '/parallax-bg.png',
--   ADD COLUMN IF NOT EXISTS parallax_title text NOT NULL DEFAULT 'Reality Blog',
--   ADD COLUMN IF NOT EXISTS parallax_subtitle text NOT NULL DEFAULT '探索技术与世界的边界';

-- 如果已按旧版 schema.sql 部署（存在认证用户写策略），执行下方 SQL 撤销，
-- 使 anon key 变为只读，写操作全部改走服务端 service role：
DROP POLICY IF EXISTS "articles_insert_auth" ON public.articles;
DROP POLICY IF EXISTS "articles_update_auth" ON public.articles;
DROP POLICY IF EXISTS "articles_delete_auth" ON public.articles;
DROP POLICY IF EXISTS "profile_insert_auth" ON public.profile;
DROP POLICY IF EXISTS "profile_update_auth" ON public.profile;

-- 如果 articles 表已存在但缺少 AI 摘要字段，执行下方 SQL：
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS ai_summary text;
