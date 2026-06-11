import { db } from '@/lib/db/supabase';

export const FinanceService = {
  async generatePandL(orgId: string, period: string): Promise<any> {
    const { data: expenses } = await db
      .from('expenses')
      .select('amount')
      .eq('org_id', orgId)
      .contains('period', [period]);

    const { data: invoices } = await db
      .from('invoices')
      .select('total')
      .eq('org_id', orgId)
      .eq('status', 'paid');

    const revenue = invoices?.reduce((sum: number, i: any) => sum + i.total, 0) || 0;
    const costs = expenses?.reduce((sum: number, e: any) => sum + e.amount, 0) || 0;

    return {
      period,
      revenue,
      expenses: costs,
      profit: revenue - costs
    };
  },

  async createBudget(orgId: string, data: any): Promise<void> {
    await db.from('budgets').insert({ org_id: orgId, ...data });
  },

  async logExpense(orgId: string, amount: number, category: string): Promise<void> {
    await db.from('expenses').insert({
      org_id: orgId,
      amount,
      category,
      date: new Date()
    });
  },

  async generateInvoice(clientId: string, items: any[]): Promise<string> {
    const invoiceId = Math.random().toString(36).substring(7);
    const total = items.reduce((sum: number, i: any) => sum + i.total, 0);

    await db.from('invoices').insert({
      id: invoiceId,
      client_id: clientId,
      items,
      total,
      issued_at: new Date()
    });

    return invoiceId;
  }
};
