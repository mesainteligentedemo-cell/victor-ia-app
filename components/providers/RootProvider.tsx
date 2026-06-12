'use client';

import { ToastProvider } from '@/components/notifications/Toast';

export function RootProvider({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}