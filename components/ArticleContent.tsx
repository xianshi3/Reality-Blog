"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github.css'; // 代码高亮主题，可替换

type Props = {
  content: string;
};

export default function ArticleContent({ content }: Props) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
    </div>
  );
}
