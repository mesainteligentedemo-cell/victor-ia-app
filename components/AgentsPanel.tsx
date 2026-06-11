"use client";

import { useState, useEffect } from "react";

interface Agent {
  name: string;
  model: string;
  company: string;
  delay: number;
  progress: number;
}

function getAgentsForQuery(query: string): Agent[] {
  const q = (query || "").toLowerCase();
  const base: Agent[] = [
    { name: "Análisis de contexto", model: "Claude 4", company: "Anthropic", delay: 200, progress: 90 },
  ];

  if (q.match(/video|spot|cinemat|reels|tiktok/))
    base.push({ name: "Video Director", model: "Seedance 2.0", company: "Stability AI", delay: 600, progress: 55 });
  if (q.match(/imagen|foto|diseño|visual|render|banner/))
    base.push({ name: "Visual Designer", model: "Flux 2", company: "Black Forest Labs", delay: 700, progress: 48 });
  if (q.match(/copy|texto|redact|escribi|content/))
    base.push({ name: "Copywriter Senior", model: "Claude 4 Opus", company: "Anthropic", delay: 800, progress: 72 });
  if (q.match(/web|sitio|landing|pagina|page/))
    base.push({ name: "Web Builder", model: "Claude Code", company: "Anthropic", delay: 900, progress: 33 });
  if (q.match(/voz|narr|audio|voice|podcast/))
    base.push({ name: "Voice Producer", model: "ElevenLabs", company: "ElevenLabs", delay: 750, progress: 61 });
  if (q.match(/datos|analítica|dashboard|métricas|finanzas|report/))
    base.push({ name: "Data Analyst", model: "Gemini 2.5 Pro", company: "Google DeepMind", delay: 650, progress: 44 });
  if (q.match(/automat|pipeline|flujo|n8n|workflow/))
    base.push({ name: "Automation Engineer", model: "n8n + Claude", company: "Open Source", delay: 700, progress: 38 });
  if (q.match(/seo|ranking|búsqueda|google/))
    base.push({ name: "SEO Specialist", model: "Gemini 2.5", company: "Google DeepMind", delay: 600, progress: 67 });

  if (base.length < 3) {
    base.push({ name: "Planificación estratégica", model: "Gemini 2.5 Pro", company: "Google DeepMind", delay: 600, progress: 58 });
    base.push({ name: "Generación de contenido", model: "Claude 4 Opus", company: "Anthropic", delay: 950, progress: 41 });
  }

  return base.slice(0, 5);
}

const AVAILABLE_MODELS = [
  { name: "Claude 4 Opus", company: "Anthropic" },
  { name: "Gemini 2.5 Pro", company: "Google DeepMind" },
  { name: "GPT-4o", company: "OpenAI" },
  { name: "Seedance 2.0", company: "Stability AI" },
  { name: "Flux 2", company: "Black Forest Labs" },
  { name: "Kling 3.0", company: "Kling AI" },
  { name: "ElevenLabs", company: "ElevenLabs" },
  { name: "Claude Code", company: "Anthropic" },
];

interface AgentsPanelProps {
  isLoading: boolean;
  lastQuery: string;
  isVisible: boolean;
  onToggle: () => void;
}

export default function AgentsPanel({ isLoading, lastQuery, isVisible, onToggle }: AgentsPanelProps) {
  const [visibleAgents, setVisibleAgents] = useState<number[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (agents.length > 0) setDone(true);
      return;
    }
    setDone(false);
    const nextAgents = getAgentsForQuery(lastQuery);
    setAgents(nextAgents);
    setVisibleAgents([]);

    const timers = nextAgents.map((ag, i) =>
      setTimeout(() => setVisibleAgents((prev) => [...prev, i]), ag.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <div className="w-[280px] shrink-0 border-l border-warm-10 bg-ink flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-warm-10">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-amber animate-pulse-amber" : "bg-warm-20"}`} />
          <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-warm-45">
            {isLoading ? "Agentes activos" : "Actividad"}
          </span>
          {isLoading && (
            <span className="text-[9px] bg-amber-low border border-amber/20 text-amber rounded-full px-2 py-0.5 font-medium">
              {visibleAgents.length} / {agents.length}
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="text-warm-45 hover:text-warm transition-colors p-1 rounded-lg hover:bg-warm-5"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-3">
        {isLoading ? (
          /* Active agents */
          <div className="px-4 space-y-1">
            <p className="text-[11px] text-warm-45 mb-4 leading-relaxed">
              Victor está coordinando{" "}
              <span className="text-amber">~200 expertos</span>{" "}
              para esta tarea.
            </p>
            {agents.map((ag, i) => (
              <div
                key={i}
                className={`transition-all duration-500 ${
                  visibleAgents.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                <div className="bg-warm-5 border border-warm-10 rounded-xl p-3 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse-amber" />
                      <span className="text-[12px] font-medium text-warm-60">{ag.name}</span>
                    </div>
                    <span className="text-[9px] text-amber bg-amber-low border border-amber/15 rounded-full px-1.5 py-0.5 font-medium">
                      {ag.model}
                    </span>
                  </div>
                  <div className="h-1 bg-warm-10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber/60 to-amber rounded-full transition-all duration-[3000ms] ease-out"
                      style={{ width: visibleAgents.includes(i) ? `${ag.progress}%` : "0%" }}
                    />
                  </div>
                  <p className="text-[10px] text-warm-45 mt-1">{ag.company}</p>
                </div>
              </div>
            ))}
          </div>
        ) : done && agents.length > 0 ? (
          /* Completed state */
          <div className="px-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[11px] text-green-400 font-medium">Completado</span>
            </div>
            <p className="text-[11px] text-warm-45 mb-4">Agentes que trabajaron en esta respuesta:</p>
            {agents.map((ag, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-warm-10 last:border-0">
                <span className="text-[12px] text-warm-60">{ag.name}</span>
                <span className="text-[10px] text-warm-45">{ag.model}</span>
              </div>
            ))}
          </div>
        ) : (
          /* Idle state */
          <div className="px-4">
            <p className="text-[11px] text-warm-45 mb-5 leading-relaxed">
              Todos los modelos disponibles. Victor selecciona el óptimo para cada tarea.
            </p>
            <p className="text-[9px] font-medium tracking-[0.1em] uppercase text-warm-20 mb-3">Modelos disponibles</p>
            <div className="space-y-1">
              {AVAILABLE_MODELS.map((m) => (
                <div key={m.name} className="flex items-center justify-between py-2.5 border-b border-warm-10 last:border-0 group">
                  <div>
                    <p className="text-[12px] font-medium text-warm-45 group-hover:text-warm-60 transition-colors">{m.name}</p>
                    <p className="text-[10px] text-warm-20">{m.company}</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-warm-20" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-warm-10 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber" />
          <span className="text-[10px] text-warm-45">Deep learning · mejora continua</span>
        </div>
      </div>
    </div>
  );
}
