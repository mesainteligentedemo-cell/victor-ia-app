'use client';

/**
 * DashboardLayout — content shell for the redesigned dashboard.
 *
 * The fixed left sidebar (240px) is already provided by app/dashboard/layout.tsx
 * via <BottomNav/>. This component owns everything to the RIGHT of it: it
 * constrains the max content width, applies the page padding and the 24px
 * vertical rhythm between sections, and slots in the sticky header.
 *
 * Layout pattern:
 *   <DashboardLayout header={<DashboardHeader .../>}>
 *     ...sections...
 *   </DashboardLayout>
 */

import type { ReactNode } from 'react';

export interface DashboardLayoutProps {
  /** Rendered inside the sticky top bar of the content column */
  header?: ReactNode;
  children: ReactNode;
}

export default function DashboardLayout({ header, children }: DashboardLayoutProps) {
  return (
    <div className="vi-dash">
      {header && <div className="vi-dash__header">{header}</div>}
      <div className="vi-dash__body">{children}</div>

      <style jsx>{`
        .vi-dash {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 28px 32px 56px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-height: 100vh;
        }
        .vi-dash__header {
          position: sticky;
          top: 0;
          z-index: 10;
          padding-top: 4px;
          padding-bottom: 20px;
          margin-bottom: -4px;
          background: linear-gradient(
            180deg,
            var(--bg) 0%,
            var(--bg) 70%,
            rgba(6, 6, 9, 0) 100%
          );
          backdrop-filter: blur(2px);
        }
        .vi-dash__body {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .vi-dash {
            padding: 20px 18px 48px;
          }
        }
      `}</style>
    </div>
  );
}