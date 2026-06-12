'use client';

import { useState } from 'react';
import { X, GripHorizontal } from 'lucide-react';

interface LaserOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  content?: string;
}

export default function LaserOverlay({
  isOpen,
  onClose,
  title = 'Preview',
  children,
  content,
}: LaserOverlayProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setStartY('touches' in e ? e.touches[0].clientY : e.clientY);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const endY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
    if (endY - startY > 50) {
      onClose();
    }
    setIsDragging(false);
  };

  return (
    <>
      {/* Mobile Bottom Sheet */}
      <div
        className="laser-mobile"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '65vh',
          background: 'var(--bg2)',
          borderRadius: '20px 20px 0 0',
          borderTop: '1px solid var(--b)',
          zIndex: 999,
          flexDirection: 'column',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.28s, transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: '36px',
            height: '4px',
            borderRadius: '2px',
            background: 'var(--t4)',
            margin: '20px auto',
            cursor: 'grab',
            marginBottom: '20px',
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchEnd={handleDragEnd}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '20px',
            paddingRight: '20px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--t2)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
        >
          {children || (
            <div
              style={{
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--t2)',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
              }}
            >
              {content}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Right Panel */}
      <div
        className="laser-desktop"
        style={{
          display: 'none',
          position: 'fixed',
          right: 0,
          top: 0,
          width: '260px',
          height: '100vh',
          background: 'var(--bg2)',
          borderLeft: '1px solid var(--b)',
          zIndex: 999,
          flexDirection: 'column',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.28s',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            borderBottom: '1px solid var(--b)',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--t2)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
          }}
        >
          {children || (
            <div
              style={{
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--t2)',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
              }}
            >
              {content}
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.72)',
            zIndex: 998,
            transition: 'opacity 0.28s',
          }}
          onClick={onClose}
        />
      )}

      {/* Show mobile below 600px, desktop above 900px */}
      <style>{`
        @media (max-width: 599px) {
          .laser-mobile { display: flex !important; }
          .laser-desktop { display: none !important; }
        }
        @media (min-width: 600px) and (max-width: 899px) {
          .laser-mobile { display: none !important; }
          .laser-desktop { display: none !important; }
        }
        @media (min-width: 900px) {
          .laser-mobile { display: none !important; }
          .laser-desktop { display: flex !important; }
        }
      `}</style>
    </>
  );
}