"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "ai";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="max-w-[80%] sm:max-w-[65%] bg-gray-100 border border-gray-300 rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-[14px] text-warm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 animate-slide-up">
      <div className="shrink-0 w-7 h-7 rounded-full bg-black-low border border-gray-400 flex items-center justify-center mt-0.5">
        <span className="text-black font-serif text-sm italic">V</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-medium text-gray-600">Victor IA</span>
          <span className="text-[9px] text-gray-600 bg-black-low border border-gray-400 px-1.5 py-0.5 rounded-full">Claude 4</span>
        </div>
        <div className="prose-chat text-[14px] text-gray-600 leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content as string}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="shrink-0 w-7 h-7 rounded-full bg-black-low border border-gray-400 flex items-center justify-center mt-0.5">
        <span className="text-black font-serif text-sm italic">V</span>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-medium text-gray-600">Victor IA</span>
          <span className="text-[9px] text-black animate-pulse-amber">coordinando agentes...</span>
        </div>
        <div className="flex items-center gap-1.5 py-1">
          <div className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-100" />
          <div className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-100" />
          <div className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

