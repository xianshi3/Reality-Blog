"use client";

import dynamic from "next/dynamic";

const AIChat = dynamic(() => import("./AIChat"), { ssr: false });

export default function DynamicAIChat() {
  return <AIChat />;
}
