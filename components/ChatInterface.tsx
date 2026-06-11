"use client";

import { useRef, useEffect, FormEvent } from "react";
import { useChat } from "ai/react";
import type { Message } from "ai";
import MessageBubble, { TypingIndicator } from "./MessageBubble";
import ThemeToggle from "./ThemeToggle";
import { IconVideo, IconGlobe, IconZap, IconChart, IconPen, IconMic, IconGear } from "./Icons";
import { PROJECTS } from "@/lib/projects";
import { findSkillById } from "@/lib/skills";

const SUGGESTED_PROMPTS = [
  { Icon: IconVideo, text: "Crea un spot de video para campaÃ±a de marca" },
  { Icon: IconGlobe, text: "Construye el sitio web para un nuevo cliente" },
  { Icon: IconZap, text: "Automatiza el pipeline de ventas completo" },
  { Icon: IconChart, text: "Genera el dashboard BI del mes actual" },
  { Icon: IconPen, text: "Redacta copy para redes sociales Q3" },
  { Icon: IconMic, text: "Crea una narraciÃ³n de voz en IA para el spot" },
];

interface ChatInterfaceProps {
  activeProject: string | null;
  activeSkill: string | null;
  onOpenSidebar: () => void;
  onSelectProject: (id: string | null) => void;
  onSelectSkill: (id: string | null) => void;
  onLoadingChange: (loading: boolean, query: string) => void;
  agentsPanelVisible: boolean;
  onToggleAgentsPanel: () => void;
}

export default function ChatInterface({
  activeProject,
  activeSkill,
  onOpenSidebar,
  onSelectProject,
  onSelectSkill,
  onLoadingChange,
  agentsPanelVisible,
  onToggleAgentsPanel,
}: ChatInterfaceProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevLoadingRef = useRef(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: "/api/chat",
    body: { activeProject, activeSkill },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (prevLoadingRef.current !== isLoading) {
      prevLoadingRef.current = isLoading;
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      onLoadingChange(isLoading, lastUser?.content as string || "");
    }
  }, [isLoading, messages]);

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
    <div className="flex flex-col h-full min-w-0">

      {/* â”€â”€ Header â”€â”€ */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-300 shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <button
            onClick={onOpenSidebar}
            className="sm:hidden text-gray-600 hover:text-warm transition-colors"
            aria-label="Abrir menÃº"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Context badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {activeProjectData && (
              <button
                onClick={() => onSelectProject(null)}
                className="flex items-center gap-1.5 bg-black-low border border-gray-400 rounded-full px-3 py-1 text-[11px] text-black hover:bg-black transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                {activeProjectData.name}
                <span className="text-black ml-0.5">Ã—</span>
              </button>
            )}
            {activeSkillData && (
              <button
                onClick={() => onSelectSkill(null)}
                className="flex items-center gap-1.5 bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-[11px] text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {activeSkillData.name}
                <span className="text-gray-600 ml-0.5">Ã—</span>
              </button>
            )}
            {!activeProjectData && !activeSkillData && (
              <span className="text-[11px] text-gray-600 tracking-[0.04em]">Chat general</span>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <div className="hidden sm:flex items-center gap-1.5 mr-2 px-2.5 py-1 bg-gray-100 border border-gray-300 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-black" />
            <span className="text-[10px] text-gray-600">Claude 4 Opus</span>
          </div>
          <ThemeToggle />
          <button
            onClick={onToggleAgentsPanel}
            title="Panel de agentes"
            aria-label="Panel de agentes"
            className={`hidden lg:block p-2 rounded-lg transition-all ${
              agentsPanelVisible
                ? "bg-black-low border border-gray-400 text-black"
                : "text-gray-600 hover:text-warm hover:bg-gray-100"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect x="1.5" y="3" width="4" height="9" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="7" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="7" y="7.5" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
          </button>
          <button className="p-2 rounded-lg text-gray-600 hover:text-warm hover:bg-gray-100 transition-all" title="ConfiguraciÃ³n" aria-label="ConfiguraciÃ³n">
            <IconGear size={15} />
          </button>
        </div>
      </div>

      {/* â”€â”€ Messages â”€â”€ */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full px-8 py-12 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-2xl bg-black-low border border-gray-400 flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-serif text-3xl italic">V</span>
              </div>
              <h1 className="font-serif text-[22px] italic text-warm mb-1.5">
                Hola, soy Victor IA
              </h1>
              <p className="text-[13px] text-gray-600 max-w-[340px] leading-relaxed">
                El primer supercerebro de IA en LATAM. Dirijo ~200 agentes especializados para operar tu empresa.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full max-w-[640px]">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p.text}
                  onClick={() => handleSuggestion(p.text)}
                  className="text-left px-4 py-3 rounded-xl border border-gray-300 hover:border-gray-300 hover:bg-gray-100 transition-all group"
                >
                  <p.Icon size={16} className="block mb-2 text-black group-hover:text-black transition-colors" />
                  <span className="text-[12px] text-gray-600 group-hover:text-gray-600 leading-snug transition-colors">{p.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-[720px] mx-auto px-5 py-6 space-y-6">
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

      {/* â”€â”€ Input â”€â”€ */}
      <div className="shrink-0 px-5 pb-5 pt-3 vi-input-zone">
        <div className="max-w-[720px] mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative bg-gray-100 border border-gray-300 rounded-2xl focus-within:border-gray-300 focus-within:bg-gray-100 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje o usa / para comandos..."
                rows={1}
                className="w-full bg-transparent px-4 py-3.5 pr-14 text-[14px] text-warm placeholder-warm-20 resize-none focus:outline-none leading-relaxed"
                style={{ minHeight: "52px", maxHeight: "180px", overflowY: "auto" }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 180) + "px";
                }}
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg text-gray-600 hover:text-warm hover:bg-gray-100 transition-all flex items-center justify-center"
                  title="Adjuntar"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M11 6.5L6.5 11C5.1 12.4 2.9 12.4 1.5 11 0.1 9.6 0.1 7.4 1.5 6L7 0.5C8 -0.5 9.6 -0.5 10.5 0.5 11.5 1.5 11.5 3 10.5 4L5.5 9C5 9.5 4.3 9.5 3.8 9 3.3 8.5 3.3 7.8 3.8 7.3L8.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 rounded-xl bg-black text-on-amber flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed hover:bg-black-dk transition-colors"
                  aria-label="Enviar mensaje"
                >
                  {isLoading ? (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-ink/30 border-t-ink animate-spin" />
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M6.5 11V2M2 6.5l4.5-4.5 4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </form>
          <div className="flex items-center justify-between mt-2 px-1">
            <p className="text-[10px] text-gray-600">
              <kbd className="border border-gray-300 rounded px-1 py-0.5 text-[9px]">Enter</kbd> enviar Â·{" "}
              <kbd className="border border-gray-300 rounded px-1 py-0.5 text-[9px]">â‡§ Enter</kbd> nueva lÃ­nea
            </p>
            <p className="text-[10px] text-gray-600">Victor IA puede cometer errores</p>
          </div>
        </div>
      </div>
    </div>
  );
}

