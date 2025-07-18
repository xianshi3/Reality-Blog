"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github-dark.css';

/**
 * 组件 Props 类型
 */
type Props = {
  /** Markdown 格式的文章内容 */
  content: string;
};

/**
 * 渲染 Markdown 格式文章内容的组件，支持代码高亮。
 */
export default function ArticleContent({ content }: Props) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
