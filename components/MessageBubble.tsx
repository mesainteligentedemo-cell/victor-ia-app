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
        <div className="max-w-[85%] sm:max-w-[70%] bg-warm-10 border border-warm-10 rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-[14px] text-warm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 animate-slide-up">
      <div className="shrink-0 w-7 h-7 rounded-full bg-amber-low border border-amber/30 flex items-center justify-center mt-0.5">
        <span className="text-amber font-serif text-sm italic">V</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="prose-chat text-[14px] text-warm-60 leading-relaxed">
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
      <div className="shrink-0 w-7 h-7 rounded-full bg-amber-low border border-amber/30 flex items-center justify-center mt-0.5">
        <span className="text-amber font-serif text-sm italic">V</span>
      </div>
      <div className="flex items-center gap-1.5 py-3">
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-warm-45" />
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-warm-45" />
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-warm-45" />
      </div>
    </div>
  );
}
