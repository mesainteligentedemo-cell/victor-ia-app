'use client';

import { ReactNode, useEffect } from 'react';

interface StudioModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: number;
}

/**
 * Shared dark, CSS-vars modal shell for all Creative Studio generators.
 * Keeps every modal visually consistent and responsive.
 */
export default function StudioModalShell({
  isOpen,
  onClose,
  title,
  icon,
  children,
  footer,
  maxWidth = 620,
}: StudioModalShellProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <style>{`
        .sm-input, .sm-textarea, .sm-select {
          width: 100%; padding: 10px 12px; border: 1px solid var(--b);
          border-radius: 10px; background: var(--bg); color: var(--p);
          font-size: 13px; font-family: var(--font-body); outline: none;
          transition: border-color .15s;
        }
        .sm-input:focus, .sm-textarea:focus, .sm-select:focus { border-color: var(--blue); }
        .sm-textarea { resize: vertical; min-height: 90px; }
        .sm-label { display:block; font-size:12px; font-weight:600; color:var(--t1); margin-bottom:6px; }
        .sm-help { font-size:11px; color:var(--t3); margin-top:4px; }
        .sm-row { display:grid; gap:14px; }
        @media (min-width:560px){ .sm-row-2 { grid-template-columns:1fr 1fr; } }
        .sm-btn {
          padding:10px 16px; border-radius:10px; font-size:13px; font-weight:600;
          cursor:pointer; border:1px solid var(--b); background:var(--bg3); color:var(--p);
          transition:all .15s; display:inline-flex; align-items:center; gap:8px; justify-content:center;
        }
        .sm-btn:hover:not(:disabled){ border-color:var(--b2); }
        .sm-btn.primary { background:var(--blue); border-color:var(--blue); color:#fff; }
        .sm-btn.primary:hover:not(:disabled){ filter:brightness(1.08); }
        .sm-btn:disabled { opacity:.5; cursor:not-allowed; }
        .sm-chip {
          padding:7px 12px; border-radius:999px; font-size:12px; font-weight:600;
          border:1px solid var(--b); background:var(--bg); color:var(--t1); cursor:pointer;
          transition:all .15s;
        }
        .sm-chip.active { background:var(--blue); border-color:var(--blue); color:#fff; }
        .sm-error {
          display:flex; gap:8px; padding:10px 12px; border-radius:10px;
          background:rgba(248,113,113,.1); border:1px solid rgba(248,113,113,.25);
          color:var(--red); font-size:12px;
        }
        .sm-range { width:100%; accent-color:var(--blue); }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg2)',
          border: '1px solid var(--b)',
          borderRadius: 'var(--r)',
          boxShadow: 'var(--shadow-float)',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--b)',
            background: 'var(--bg2)',
            zIndex: 1,
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--p)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              margin: 0,
            }}
          >
            {icon}
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--t2)',
              cursor: 'pointer',
              fontSize: 20,
              lineHeight: 1,
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '20px' }}>{children}</div>

        {footer && (
          <div
            style={{
              display: 'flex',
              gap: 12,
              padding: '16px 20px',
              borderTop: '1px solid var(--b)',
              position: 'sticky',
              bottom: 0,
              background: 'var(--bg2)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
