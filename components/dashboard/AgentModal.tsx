'use client';

/**
 * AgentModal — detail overlay for a single agent.
 *
 * Renders QUÉ HACE / CÓMO LO HACE / PARA QUÉ LO HACE plus the invocation and a
 * pair of actions ([Cerrar] [Ejecutar Agente]). Implemented as an accessible
 * dialog: ESC closes, backdrop click closes, body scroll is locked while open,
 * focus moves to the close button on open and is restored on close, and Tab is
 * trapped inside the panel.
 */

import { useCallback, useEffect, useRef } from 'react';
import { VictorIcon } from '@/components/Icons/victor-icons/VictorIcons';
import type { Agent } from './agents-types';

export interface AgentModalProps {
  agent: Agent | null;
  onClose: () => void;
}

export default function AgentModal({ agent, onClose }: AgentModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const open = agent !== null;

  // Lock body scroll + remember the element that had focus before opening.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Defer focus until the panel is painted.
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  // ESC to close + simple focus trap on Tab.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  if (!open || !agent) return null;

  const handleRun = () => {
    // Opens the agent route deep-link in a new tab. The invocation slug also
    // doubles as the route segment under /dashboard/agents.
    const slug = agent.invocation.replace(/^\//, '');
    window.open(`/dashboard/agents?run=${encodeURIComponent(slug)}`, '_blank', 'noopener');
  };

  return (
    <div
      className="vi-modal"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={onKeyDown}
    >
      <div
        ref={panelRef}
        className="vi-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vi-modal-title"
        aria-describedby="vi-modal-what"
      >
        {/* Header */}
        <header className="vi-modal__head">
          <div className="vi-modal__id">
            <span className="vi-modal__emoji" aria-hidden>
              {agent.emoji}
            </span>
            <div>
              <h2 id="vi-modal-title" className="vi-modal__title">
                {agent.name}
              </h2>
              <span className="vi-modal__cat">{agent.categoryLabel}</span>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="vi-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <VictorIcon name="close" size={18} aria-hidden />
          </button>
        </header>

        {/* Body */}
        <div className="vi-modal__body">
          <Block icon={<svg width={15} height={15} viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2} strokeLinecap="butt" strokeLinejoin="miter"><polygon points="12 8 16 12 12 16 8 12"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="5" y1="5" x2="7" y2="7"/><line x1="17" y1="17" x2="19" y2="19"/><line x1="19" y1="5" x2="17" y2="7"/><line x1="7" y1="17" x2="5" y2="19"/></svg>} title="Qué hace" id="vi-modal-what">
            {agent.whatItDoes}
          </Block>
          <Block icon={<svg width={15} height={15} viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2} strokeLinecap="butt" strokeLinejoin="miter"><rect x="7" y="7" width="10" height="10"/><line x1="9" y1="4" x2="9" y2="7"/><line x1="12" y1="4" x2="12" y2="7"/><line x1="15" y1="4" x2="15" y2="7"/><line x1="9" y1="17" x2="9" y2="20"/><line x1="12" y1="17" x2="12" y2="20"/><line x1="15" y1="17" x2="15" y2="20"/><line x1="4" y1="9" x2="7" y2="9"/><line x1="4" y1="12" x2="7" y2="12"/><line x1="4" y1="15" x2="7" y2="15"/><line x1="17" y1="9" x2="20" y2="9"/><line x1="17" y1="12" x2="20" y2="12"/><line x1="17" y1="15" x2="20" y2="15"/></svg>} title="Cómo lo hace">
            {agent.howItDoes}
          </Block>
          <Block icon={<svg width={15} height={15} viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2} strokeLinecap="butt" strokeLinejoin="miter"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>} title="Para qué lo hace">
            {agent.whyItDoes}
          </Block>

          <div className="vi-modal__meta">
            <div className="vi-modal__invocation">
              <svg width={14} height={14} viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2} strokeLinecap="butt" strokeLinejoin="miter" aria-hidden><rect x="3" y="4" width="18" height="16"/><polyline points="7 9 10 12 7 15"/><line x1="12" y1="15" x2="17" y2="15"/></svg>
              <code>{agent.invocation}</code>
            </div>
            <div className="vi-modal__tags">
              {agent.tags.map((t) => (
                <span key={t} className="vi-modal__tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <footer className="vi-modal__foot">
          <button type="button" className="vi-modal__btn" onClick={onClose}>
            Cerrar
          </button>
          <button type="button" className="vi-modal__btn is-primary" onClick={handleRun}>
            Ejecutar Agente
            <svg width={15} height={15} viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2} strokeLinecap="butt" strokeLinejoin="miter" aria-hidden><polyline points="14 4 20 4 20 10"/><line x1="20" y1="4" x2="11" y2="13"/><polyline points="11 7 4 7 4 20 17 20 17 13"/></svg>
          </button>
        </footer>
      </div>

      <style jsx>{`
        .vi-modal {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(3, 3, 6, 0.66);
          backdrop-filter: blur(6px);
          animation: vi-modal-fade 0.18s ease;
        }
        .vi-modal__panel {
          width: 100%;
          max-width: 560px;
          max-height: calc(100vh - 48px);
          display: flex;
          flex-direction: column;
          background: var(--bg2);
          border: 1px solid var(--b2);
          border-radius: var(--r2);
          box-shadow: var(--shadow-float);
          animation: vi-modal-slide 0.24s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        .vi-modal__head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 22px 24px 16px;
          border-bottom: 1px solid var(--b);
        }
        .vi-modal__id {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }
        .vi-modal__emoji {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          font-size: 26px;
          line-height: 1;
          flex-shrink: 0;
          border-radius: 14px;
          background: var(--bg3);
          border: 1px solid var(--b);
        }
        .vi-modal__title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--p);
          line-height: 1.25;
        }
        .vi-modal__cat {
          font-size: 12px;
          color: var(--t3);
        }
        .vi-modal__close {
          appearance: none;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--bg3);
          border: 1px solid var(--b);
          color: var(--t1);
          cursor: pointer;
          transition: border-color 0.18s ease, color 0.18s ease;
        }
        .vi-modal__close:hover {
          border-color: var(--red);
          color: var(--red);
        }
        .vi-modal__close:focus-visible {
          outline: 2px solid var(--blue);
          outline-offset: 2px;
        }
        .vi-modal__body {
          padding: 8px 24px 4px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .vi-modal__meta {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 4px 0 8px;
        }
        .vi-modal__invocation {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          padding: 7px 12px;
          border-radius: 10px;
          background: var(--bg);
          border: 1px solid var(--b);
          color: var(--t2);
        }
        .vi-modal__invocation code {
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--blue);
        }
        .vi-modal__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .vi-modal__tag {
          font-size: 11px;
          color: var(--t3);
          padding: 3px 9px;
          border-radius: 999px;
          background: var(--bg);
          border: 1px solid var(--b);
        }
        .vi-modal__foot {
          display: flex;
          gap: 12px;
          padding: 16px 24px 22px;
          border-top: 1px solid var(--b);
        }
        .vi-modal__btn {
          appearance: none;
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          background: var(--bg3);
          border: 1px solid var(--b);
          color: var(--t1);
          transition: border-color 0.18s ease, background 0.18s ease,
            box-shadow 0.18s ease;
        }
        .vi-modal__btn:hover {
          border-color: var(--b2);
        }
        .vi-modal__btn:focus-visible {
          outline: 2px solid var(--blue);
          outline-offset: 2px;
        }
        .vi-modal__btn.is-primary {
          flex: 1.4;
          background: var(--blue);
          border-color: var(--blue);
          color: #fff;
        }
        .vi-modal__btn.is-primary:hover {
          box-shadow: 0 8px 22px rgba(59, 130, 246, 0.34);
        }

        @keyframes vi-modal-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes vi-modal-slide {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (max-width: 520px) {
          .vi-modal {
            padding: 0;
            align-items: flex-end;
          }
          .vi-modal__panel {
            max-width: 100%;
            max-height: 92vh;
            border-radius: var(--r2) var(--r2) 0 0;
          }
        }
      `}</style>
    </div>
  );
}

// ── Section block ────────────────────────────────────────────────────────────
function Block({
  icon,
  title,
  id,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="vi-block">
      <h3 className="vi-block__title">
        <span className="vi-block__icon" aria-hidden>
          {icon}
        </span>
        {title}
      </h3>
      <p id={id} className="vi-block__text">
        {children}
      </p>
      <style jsx>{`
        .vi-block {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .vi-block__title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--t3);
        }
        .vi-block__icon {
          display: inline-flex;
          color: var(--blue);
        }
        .vi-block__text {
          margin: 0;
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--t1);
        }
      `}</style>
    </section>
  );
}