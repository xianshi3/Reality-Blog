"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import 'highlight.js/styles/github-dark.css';

type Props = {
  content: string;
};

export default function ArticleContent({ content }: Props) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
