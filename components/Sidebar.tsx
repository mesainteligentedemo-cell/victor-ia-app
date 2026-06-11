"use client";

import { useState } from "react";
import { PROJECTS, STATUS_LABELS, STATUS_COLORS } from "@/lib/projects";
import { SKILL_CATEGORIES } from "@/lib/skills";
import type { Project } from "@/lib/projects";
import type { Skill } from "@/lib/skills";
import { IconGlobe, IconChart, IconZap, IconGrid, IconVideo, IconDocument, IconGear, IconUser } from "./Icons";

// Iconos SVG custom por categorÃ­a de skills (reemplazo de emojis)
const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  web: IconGlobe,
  marketing: IconChart,
  automation: IconZap,
  "ia-tech": IconGrid,
  video: IconVideo,
  negocio: IconDocument,
};

const RECENT_CHATS = [
  { id: "r1", title: "Spot video campaÃ±a verano Nexora", time: "Hace 5 min" },
  { id: "r2", title: "Landing page Lumina Studios", time: "Ayer" },
  { id: "r3", title: "AutomatizaciÃ³n pipeline CRM", time: "Ayer" },
  { id: "r4", title: "Copy redes sociales Q2", time: "Hace 3 dÃ­as" },
  { id: "r5", title: "Dashboard BI â€” anÃ¡lisis mensual", time: "Hace 3 dÃ­as" },
  { id: "r6", title: "Propuesta Meridian Group", time: "Hace 1 sem" },
];

interface SidebarProps {
  activeProject: string | null;
  activeSkill: string | null;
  onSelectProject: (id: string | null) => void;
  onSelectSkill: (id: string | null) => void;
  onNewChat: () => void;
  onClose?: () => void;
  activeModule?: "chat" | "prospeccion";
  onSelectModule?: (module: "chat" | "prospeccion") => void;
  /** docked: 160px tablet / 200px desktop Â· overlay: 280px (mobile) */
  variant?: "docked" | "overlay";
}

export default function Sidebar({
  activeProject,
  activeSkill,
  onSelectProject,
  onSelectSkill,
  onNewChat,
  onClose,
  activeModule = "chat",
  onSelectModule,
  variant = "docked",
}: SidebarProps) {
  const [section, setSection] = useState<"chats" | "projects" | "skills">("chats");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState("r1");

  function handleProject(p: Project) {
    onSelectProject(activeProject === p.id ? null : p.id);
    onClose?.();
  }

  function handleSkill(s: Skill) {
    onSelectSkill(activeSkill === s.id ? null : s.id);
    onClose?.();
  }

  const widthClass =
    variant === "overlay"
      ? "w-[280px] max-w-[85vw]"
      : "vi-sidebar-docked w-[160px] lg:w-[200px]";

  return (
    <div className={`flex flex-col h-full bg-ink border-r border-gray-300 shrink-0 ${widthClass}`}>

      {/* Logo */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1.5L16 16.5L9 13L2 16.5Z" stroke="#FFAA17" strokeWidth="1.3" strokeLinejoin="round"/>
            <circle cx="9" cy="9.5" r="1.6" fill="white"/>
          </svg>
          <span className="font-serif italic text-warm text-[15px]">Victor IA</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-600 hover:text-warm transition-colors p-1 sm:hidden" aria-label="Cerrar menÃº">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M11 4L4 11M4 4l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Module Switcher */}
      <div className="px-3 pb-2 flex gap-1">
        <button
          onClick={() => onSelectModule?.("chat")}
          className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-medium transition-all ${
            activeModule === "chat"
              ? "bg-black text-black"
              : "bg-gray-100 text-gray-600 hover:bg-gray-100 hover:text-warm"
          }`}
          title="Chat con IA"
        >
          ðŸ’¬ Chat
        </button>
        <button
          onClick={() => onSelectModule?.("prospeccion")}
          className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-medium transition-all ${
            activeModule === "prospeccion"
              ? "bg-black text-black"
              : "bg-gray-100 text-gray-600 hover:bg-gray-100 hover:text-warm"
          }`}
          title="Generador de videos e imÃ¡genes"
        >
          âœ¨ Media
        </button>
      </div>

      {/* New chat button â€” solo visible en module chat */}
      {activeModule === "chat" && (
        <div className="px-3 pb-3">
          <button
            onClick={() => { onNewChat(); setActiveChat(""); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-300 hover:border-gray-300 hover:bg-gray-100 transition-all text-[12px] text-gray-600 hover:text-warm group"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-600 group-hover:text-black transition-colors">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="truncate">Nuevo chat</span>
            <span className="ml-auto text-[10px] text-gray-600 hidden lg:inline">âŒ˜K</span>
          </button>
        </div>
      )}

      {/* Section tabs */}
      <div className="flex px-3 pb-2 gap-1">
        {(["chats", "projects", "skills"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`flex-1 py-1.5 text-[10px] tracking-[0.06em] uppercase font-medium rounded-lg transition-all ${
              section === s
                ? "bg-gray-100 text-warm"
                : "text-gray-600 hover:text-gray-600 hover:bg-gray-100"
            }`}
          >
            {variant === "docked" ? (
              <>
                {/* Tablet 160px: etiquetas cortas Â· Desktop 200px: completas */}
                <span className="lg:hidden">{s === "chats" ? "Chat" : s === "projects" ? "Proy" : "Skill"}</span>
                <span className="hidden lg:inline">{s === "chats" ? "Chats" : s === "projects" ? "Proyectos" : "Skills"}</span>
              </>
            ) : (
              s === "chats" ? "Chats" : s === "projects" ? "Proyectos" : "Skills"
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {/* CHATS */}
        {section === "chats" && (
          <div className="py-1">
            <p className="text-[9px] font-medium tracking-[0.1em] uppercase text-gray-600 px-4 pb-1 pt-2">Reciente</p>
            {RECENT_CHATS.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`w-full text-left px-4 py-2.5 transition-all group ${
                  activeChat === chat.id
                    ? "bg-gray-100 border-l-2 border-gray-400"
                    : "border-l-2 border-transparent hover:bg-gray-100 hover:border-l-2 hover:border-gray-300"
                }`}
              >
                <p className={`text-[12px] font-medium leading-tight line-clamp-1 ${
                  activeChat === chat.id ? "text-warm" : "text-gray-600 group-hover:text-warm"
                }`}>
                  {chat.title}
                </p>
                <p className="text-[10px] text-gray-600 mt-0.5">{chat.time}</p>
              </button>
            ))}
          </div>
        )}

        {/* PROJECTS */}
        {section === "projects" && (
          <div className="py-1">
            {activeProject && (
              <button
                onClick={() => onSelectProject(null)}
                className="w-full flex items-center gap-2 px-4 py-2 text-[11px] text-black hover:text-black-dk transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M7 3L3 7M3 3l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Limpiar contexto
              </button>
            )}
            {PROJECTS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProject(p)}
                className={`w-full text-left px-4 py-2.5 transition-all group ${
                  activeProject === p.id
                    ? "bg-black-low border-l-2 border-gray-400"
                    : "border-l-2 border-transparent hover:bg-gray-100"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[12px] font-medium leading-tight ${
                    activeProject === p.id ? "text-warm" : "text-gray-600 group-hover:text-warm"
                  }`}>
                    {p.name}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 font-medium mt-0.5 ${STATUS_COLORS[p.status]}`}>
                    {STATUS_LABELS[p.status]}
                  </span>
                </div>
                <p className="text-[10px] text-gray-600 mt-0.5 leading-snug line-clamp-1">{p.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* SKILLS */}
        {section === "skills" && (
          <div className="py-1">
            {activeSkill && (
              <button
                onClick={() => onSelectSkill(null)}
                className="w-full flex items-center gap-2 px-4 py-2 text-[11px] text-black hover:text-black-dk transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M7 3L3 7M3 3l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Desactivar skill
              </button>
            )}
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <button
                  onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {(() => {
                      const Icon = CATEGORY_ICONS[cat.id] ?? IconGrid;
                      return <Icon size={13} className="text-black shrink-0" />;
                    })()}
                    <span className="text-[10px] text-gray-600 font-medium tracking-[0.06em] uppercase truncate">{cat.name}</span>
                  </div>
                  <svg
                    width="9" height="9" viewBox="0 0 9 9" fill="none"
                    className={`text-gray-600 transition-transform duration-200 ${expandedCategory === cat.id ? "rotate-180" : ""}`}
                  >
                    <path d="M1.5 3l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {expandedCategory === cat.id && (
                  <div className="pb-1">
                    {cat.skills.map((skill) => (
                      <button
                        key={skill.id}
                        onClick={() => handleSkill(skill)}
                        className={`w-full text-left px-4 pl-9 py-2 transition-all group ${
                          activeSkill === skill.id
                            ? "bg-black-low border-l-2 border-gray-400"
                            : "border-l-2 border-transparent hover:bg-gray-100"
                        }`}
                      >
                        <div className={`text-[12px] font-medium ${
                          activeSkill === skill.id ? "text-black" : "text-gray-600 group-hover:text-warm"
                        }`}>
                          {skill.name}
                        </div>
                        <div className="text-[10px] text-gray-600 mt-0.5 leading-snug line-clamp-1">{skill.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer: model + user */}
      <div className="border-t border-gray-300 px-4 py-3 space-y-2 vi-side-pad">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
          <span className="text-[10px] text-gray-600 truncate">Claude 4 Opus Â· Anthropic</span>
        </div>
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-black-low border border-gray-400 flex items-center justify-center shrink-0">
              <IconUser size={10} className="text-black" />
            </div>
            <span className="text-[11px] text-gray-600 truncate">Victor GonzÃ¡lez</span>
          </div>
          <button className="text-gray-600 hover:text-gray-600 transition-colors p-1 shrink-0" title="ConfiguraciÃ³n" aria-label="ConfiguraciÃ³n">
            <IconGear size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

