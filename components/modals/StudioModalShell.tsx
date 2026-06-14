'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface StudioModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  /** Footer actions (e.g. generate / close buttons). */
  footer?: React.ReactNode;
  /** Max width of the dialog in px. */
  maxWidth?: number;
  children: React.ReactNode;
}

/**
 * Reusable dark, accessible modal shell for every studio generator.
 *
 * - Closes on backdrop click + Escape.
 * - Locks body scroll while open.
 * - Pure CSS-vars styling (responsive, dark-mode native).
 * - No external UI deps.
 */
export default function StudioModalShell({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  footer,
  maxWidth = 560,
  children,
}: StudioModalShellProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.62)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '5vh 16px',
        overflowY: 'auto',
      }}
    >
      <style>{`
        .sm-modal { animation: smIn .18s ease; }
        @keyframes smIn { from { opacity:0; transform:translateY(8px) scale(.99); } to { opacity:1; transform:none; } }
        .sm-field { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; }
        .sm-label { font-size:13px; font-weight:600; color:var(--t2); }
        .sm-input, .sm-textarea, .sm-select {
          width:100%; box-sizing:border-box; padding:11px 13px; border-radius:10px;
          background:var(--bg); border:1px solid var(--b); color:var(--p);
          font-size:14px; font-family:inherit; outline:none; transition:border-color .15s;
        }
        .sm-input:focus, .sm-textarea:focus, .sm-select:focus { border-color:var(--blue); }
        .sm-textarea { resize:vertical; min-height:90px; line-height:1.5; }
        .sm-btn {
          display:inline-flex; align-items:center; justify-content:center; gap:7px;
          padding:11px 18px; border-radius:10px; font-size:14px; font-weight:600;
          cursor:pointer; border:1px solid var(--b); background:var(--bg2); color:var(--p);
          transition:all .15s; font-family:inherit;
        }
        .sm-btn:hover:not(:disabled) { border-color:var(--blue); }
        .sm-btn.primary { background:var(--blue); border-color:var(--blue); color:#fff; }
        .sm-btn.primary:hover:not(:disabled) { filter:brightness(1.08); }
        .sm-btn:disabled { opacity:.55; cursor:not-allowed; }
        .sm-error {
          padding:10px 13px; border-radius:10px; font-size:13px; margin-bottom:14px;
          background:rgba(239,68,68,.12); border:1px solid rgba(239,68,68,.3); color:var(--red);
        }
        .sm-range { width:100%; accent-color:var(--blue); }
        .sm-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        @media (max-width:520px){ .sm-row { grid-template-columns:1fr; } }
      `}</style>

      <div
        className="sm-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth,
          background: 'var(--bg2)',
          border: '1px solid var(--b)',
          borderRadius: 16,
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          color: 'var(--p)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '18px 20px',
            borderBottom: '1px solid var(--b)',
          }}
        >
          {icon && (
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'var(--gd)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--blue)',
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
            {subtitle && (
              <div style={{ fontSize: 13, color: 'var(--t2)', marginTop: 2 }}>{subtitle}</div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid var(--b)',
              background: 'transparent',
              color: 'var(--t2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 20 }}>{children}</div>

        {footer && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              padding: '16px 20px',
              borderTop: '1px solid var(--b)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
