// Finance: P&L, budgets, expenses, invoices

export type ExpenseCategory = 'salary' | 'marketing' | 'operations' | 'infrastructure' | 'other';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Budget {
  id: string;
  organizationId: string;
  category: ExpenseCategory;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  spent: number;
  startDate: Date;
  endDate: Date;
}

export interface Expense {
  id: string;
  organizationId: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
  receipt?: string;
  approved: boolean;
  approvedBy?: string;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  organizationId: string;
  clientId: string;
  clientName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  issuedAt: Date;
  dueAt: Date;
  paidAt?: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PandLStatement {
  organizationId: string;
  period: string; // YYYY-MM
  revenue: number;
  expenses: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  margin: number;
}

export interface CashFlow {
  organizationId: string;
  date: Date;
  inflows: number;
  outflows: number;
  netCashFlow: number;
  cumulativeFlow: number;
}

export interface FinancialReport {
  id: string;
  organizationId: string;
  period: string;
  pandl: PandLStatement;
  cashFlow: CashFlow[];
  metrics: {
    profitMargin: number;
    operatingRatio: number;
    burnRate?: number;
  };
  generatedAt: Date;
}