"use client";

import { useRef, useEffect, FormEvent } from "react";
import { useChat } from "ai/react";
import type { Message } from "ai";
import MessageBubble, { TypingIndicator } from "./MessageBubble";
import { PROJECTS } from "@/lib/projects";
import { findSkillById } from "@/lib/skills";

const SUGGESTED_PROMPTS = [
  "¿En qué estado están los proyectos activos?",
  "Redacta un follow-up para el cliente Seabird Hotel",
  "Activa el skill Web 4.0 y mejora el hero section",
  "¿Qué sigue pendiente con ROES & CO?",
  "Crea una propuesta rápida para un nuevo cliente",
  "Analiza las finanzas del mes actual",
];

interface ChatInterfaceProps {
  activeProject: string | null;
  activeSkill: string | null;
  onOpenSidebar: () => void;
  onSelectProject: (id: string | null) => void;
  onSelectSkill: (id: string | null) => void;
}

export default function ChatInterface({
  activeProject,
  activeSkill,
  onOpenSidebar,
  onSelectProject,
  onSelectSkill,
}: ChatInterfaceProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: "/api/chat",
    body: { activeProject, activeSkill },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        const fakeEvent = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
        handleSubmit(fakeEvent);
      }
    }
  }

  function handleSuggestion(text: string) {
    setInput(text);
    inputRef.current?.focus();
  }

  const activeProjectData = activeProject ? PROJECTS.find((p) => p.id === activeProject) : null;
  const activeSkillData = activeSkill ? findSkillById(activeSkill) : null;

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-warm-10 shrink-0">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden text-warm-45 hover:text-warm transition-colors p-1"
          aria-label="Abrir menú"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-0 lg:ml-0 ml-2">
          {activeProjectData || activeSkillData ? (
            <div className="flex items-center gap-2 flex-wrap">
              {activeProjectData && (
                <button
                  onClick={() => onSelectProject(null)}
                  className="flex items-center gap-1.5 bg-amber-low border border-amber/20 rounded-full px-3 py-1 text-[11px] text-amber hover:bg-amber/15 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                  {activeProjectData.name}
                  <span className="text-amber/60 ml-0.5">×</span>
                </button>
              )}
              {activeSkillData && (
                <button
                  onClick={() => onSelectSkill(null)}
                  className="flex items-center gap-1.5 bg-warm-5 border border-warm-10 rounded-full px-3 py-1 text-[11px] text-warm-60 hover:bg-warm-10 transition-colors"
                >
                  <span className="text-[10px]">{activeSkillData.icon ?? "◈"}</span>
                  {activeSkillData.name}
                  <span className="text-warm-45 ml-0.5">×</span>
                </button>
              )}
            </div>
          ) : (
            <span className="text-[12px] text-warm-45 tracking-[0.06em]">Chat general — selecciona un proyecto o skill</span>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-low border border-amber/20 flex items-center justify-center mb-5">
              <span className="text-amber font-serif text-2xl italic">V</span>
            </div>
            <h1 className="font-serif text-2xl italic text-warm mb-2">Hola, soy Victor IA</h1>
            <p className="text-[13px] text-warm-45 max-w-sm leading-relaxed mb-8">
              Tu agencia de inteligencia artificial. Puedo ayudarte con proyectos, clientes, diseño, código, automatización y mucho más.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestion(prompt)}
                  className="text-left px-4 py-3 rounded-xl border border-warm-10 hover:border-warm-20 hover:bg-warm-5 transition-all text-[12px] text-warm-60 hover:text-warm leading-snug"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((m: Message) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <TypingIndicator />
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-warm-10 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
              rows={1}
              className="w-full bg-warm-5 border border-warm-10 rounded-2xl px-4 py-3 pr-12 text-[14px] text-warm placeholder-warm-45 resize-none focus:outline-none focus:border-warm-20 focus:bg-warm-10 transition-all leading-relaxed"
              style={{ minHeight: "48px", maxHeight: "160px", overflowY: "auto" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 160) + "px";
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 bottom-3 w-8 h-8 rounded-xl bg-amber flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-dk transition-colors"
            >
              {isLoading ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-ink/30 border-t-ink animate-spin" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 12V2M2 7l5-5 5 5" stroke="#0E0F12" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </form>
          <p className="text-[10px] text-warm-45 text-center mt-2 tracking-[0.04em]">
            Victor IA puede cometer errores. Verifica información importante.
          </p>
        </div>
      </div>
    </div>
  );
}
