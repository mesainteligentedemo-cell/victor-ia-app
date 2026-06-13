'use client';

import BottomNav from '@/components/navigation/BottomNav';
import Onboarding from '@/components/Onboarding';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--bg)',
      color: 'var(--p)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'row',
    }}>
      <Onboarding />

      {/* SIDEBAR */}
      <BottomNav />

      {/* MAIN CONTENT */}
      <main style={{
        marginLeft: '240px',
        flex: 1,
        overflowY: 'auto',
        maxHeight: '100vh',
        padding: '0',
      }}>
        {children}
      </main>
    </div>
  );
}
