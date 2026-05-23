"use client";

import { useState } from "react";
import { PROJECTS, STATUS_LABELS, STATUS_COLORS } from "@/lib/projects";
import { SKILL_CATEGORIES } from "@/lib/skills";
import type { Project } from "@/lib/projects";
import type { Skill } from "@/lib/skills";

interface SidebarProps {
  activeProject: string | null;
  activeSkill: string | null;
  onSelectProject: (id: string | null) => void;
  onSelectSkill: (id: string | null) => void;
  onClose?: () => void;
}

export default function Sidebar({
  activeProject,
  activeSkill,
  onSelectProject,
  onSelectSkill,
  onClose,
}: SidebarProps) {
  const [tab, setTab] = useState<"projects" | "skills">("projects");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  function handleProject(p: Project) {
    onSelectProject(activeProject === p.id ? null : p.id);
    onClose?.();
  }

  function handleSkill(s: Skill) {
    onSelectSkill(activeSkill === s.id ? null : s.id);
    onClose?.();
  }

  return (
    <div className="flex flex-col h-full bg-ink border-r border-warm-10 w-[280px] shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-warm-10">
        <div className="flex items-center gap-2">
          <span className="text-amber font-serif text-lg font-normal italic">Victor IA</span>
          <span className="text-[9px] text-warm-45 tracking-[0.18em] uppercase font-sans mt-0.5">Studio</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-warm-45 hover:text-warm transition-colors p-1 lg:hidden">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-warm-10">
        {(["projects", "skills"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-[11px] tracking-[0.08em] uppercase font-medium transition-colors ${
              tab === t ? "text-warm border-b-2 border-amber -mb-px" : "text-warm-45 hover:text-warm-60"
            }`}
          >
            {t === "projects" ? "Proyectos" : "Skills"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-2">
        {tab === "projects" && (
          <div>
            {activeProject && (
              <button
                onClick={() => onSelectProject(null)}
                className="w-full flex items-center gap-2 px-4 py-2 text-[11px] text-amber hover:text-amber-dk transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" transform="rotate(45 6 6)"/>
                </svg>
                Sin contexto de proyecto
              </button>
            )}
            {PROJECTS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProject(p)}
                className={`w-full text-left px-4 py-3 transition-all group ${
                  activeProject === p.id
                    ? "bg-amber-low border-l-2 border-amber"
                    : "hover:bg-warm-5 border-l-2 border-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[13px] font-medium leading-tight ${activeProject === p.id ? "text-warm" : "text-warm-60 group-hover:text-warm"}`}>
                    {p.name}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 font-medium mt-0.5 ${STATUS_COLORS[p.status]}`}>
                    {STATUS_LABELS[p.status]}
                  </span>
                </div>
                <p className="text-[11px] text-warm-45 mt-0.5 leading-snug line-clamp-1">
                  {p.description}
                </p>
              </button>
            ))}
          </div>
        )}

        {tab === "skills" && (
          <div>
            {activeSkill && (
              <button
                onClick={() => onSelectSkill(null)}
                className="w-full flex items-center gap-2 px-4 py-2 text-[11px] text-amber hover:text-amber-dk transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" transform="rotate(45 6 6)"/>
                </svg>
                Desactivar skill
              </button>
            )}
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <button
                  onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-warm-5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <span className="text-[11px] text-warm-45 font-medium tracking-[0.06em] uppercase">{cat.name}</span>
                  </div>
                  <svg
                    width="10" height="10" viewBox="0 0 10 10" fill="none"
                    className={`text-warm-45 transition-transform ${expandedCategory === cat.id ? "rotate-180" : ""}`}
                  >
                    <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {expandedCategory === cat.id && (
                  <div className="pb-1">
                    {cat.skills.map((skill) => (
                      <button
                        key={skill.id}
                        onClick={() => handleSkill(skill)}
                        className={`w-full text-left px-4 pl-10 py-2.5 transition-all group ${
                          activeSkill === skill.id
                            ? "bg-amber-low border-l-2 border-amber"
                            : "hover:bg-warm-5 border-l-2 border-transparent"
                        }`}
                      >
                        <div className={`text-[13px] font-medium ${activeSkill === skill.id ? "text-amber" : "text-warm-60 group-hover:text-warm"}`}>
                          {skill.name}
                        </div>
                        <div className="text-[11px] text-warm-45 mt-0.5 leading-snug">{skill.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-warm-10 px-4 py-3">
        <div className="text-[10px] text-warm-45 tracking-[0.06em]">VICTOR IA © 2026</div>
      </div>
    </div>
  );
}
