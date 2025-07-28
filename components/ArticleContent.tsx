"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github-dark.css';

type Props = {
  content: string;
};

// 把标题文本转换为 id
const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');

export default function ArticleContent({ content }: Props) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => {
            const id = slugify(String(props.children));
            return <h1 id={id} {...props} />;
          },
          h2: ({ node, ...props }) => {
            const id = slugify(String(props.children));
            return <h2 id={id} {...props} />;
          },
          h3: ({ node, ...props }) => {
            const id = slugify(String(props.children));
            return <h3 id={id} {...props} />;
          },
          h4: ({ node, ...props }) => {
            const id = slugify(String(props.children));
            return <h4 id={id} {...props} />;
          },
          h5: ({ node, ...props }) => {
            const id = slugify(String(props.children));
            return <h5 id={id} {...props} />;
          },
          h6: ({ node, ...props }) => {
            const id = slugify(String(props.children));
            return <h6 id={id} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
