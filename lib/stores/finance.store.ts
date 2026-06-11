import { create } from 'zustand';
import { Budget, Invoice, PandLStatement } from '@/lib/types';

interface FinanceState {
  budgets: Budget[];
  invoices: Invoice[];
  pandl: PandLStatement | null;
  isLoading: boolean;
  setBudgets: (budgets: Budget[]) => void;
  setInvoices: (invoices: Invoice[]) => void;
  setPandL: (pandl: PandLStatement) => void;
  setLoading: (loading: boolean) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  budgets: [],
  invoices: [],
  pandl: null,
  isLoading: false,
  setBudgets: (budgets) => set({ budgets }),
  setInvoices: (invoices) => set({ invoices }),
  setPandL: (pandl) => set({ pandl }),
  setLoading: (loading) => set({ isLoading: loading })
}));
