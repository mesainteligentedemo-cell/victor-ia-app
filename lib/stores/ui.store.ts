import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  activeModal: string | null;
  activeDrawer: string | null;
  toast: { message: string; type: 'success' | 'error' | 'info'; visible: boolean } | null;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  openModal: (name: string) => void;
  closeModal: () => void;
  openDrawer: (name: string) => void;
  closeDrawer: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  activeModal: null,
  activeDrawer: null,
  toast: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),
  openDrawer: (name) => set({ activeDrawer: name }),
  closeDrawer: () => set({ activeDrawer: null }),
  showToast: (message, type = 'info') => set({ toast: { message, type, visible: true } }),
  hideToast: () => set({ toast: null })
}));
