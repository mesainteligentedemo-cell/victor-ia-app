import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/logger';
import { getAdminClient, isAdminConfigured } from '@/lib/db/admin';

export const runtime = 'nodejs';

const GENERIC_ERROR = 'An error occurred processing your request';

interface MonthBucket {
  month: string; // YYYY-MM
  label: string;
  ingresos: number;
  egresos: number;
  balance: number;
}

interface CategoryRow {
  category: string;
  direction: 'income' | 'expense';
  total: number;
}

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function buildEmptyMonths(count: number): MonthBucket[] {
  const out: MonthBucket[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      month: monthKey(d),
      label: MONTHS_ES[d.getMonth()],
      ingresos: 0,
      egresos: 0,
      balance: 0,
    });
  }
  return out;
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const months = buildEmptyMonths(12);
    const byKey = new Map(months.map((m) => [m.month, m]));
    const categories = new Map<string, CategoryRow>();

    let receivable = 0; // projects pending_payment
    let payable = 0; // active subscriptions

    if (isAdminConfigured()) {
      const supabase = getAdminClient();
      const since = new Date();
      since.setMonth(since.getMonth() - 11);
      since.setDate(1);
      const sinceIso = since.toISOString().slice(0, 10);

      // 1) finance_tracking entries
      const { data: tracking } = await supabase
        .from('finance_tracking')
        .select('direction, category, amount, occurred_on')
        .eq('user_id', userId)
        .gte('occurred_on', sinceIso);

      for (const row of tracking ?? []) {
        const d = new Date(row.occurred_on);
        const bucket = byKey.get(monthKey(d));
        const amt = Number(row.amount) || 0;
        if (bucket) {
          if (row.direction === 'income') bucket.ingresos += amt;
          else bucket.egresos += amt;
        }
        const ck = `${row.direction}:${row.category}`;
        const existing = categories.get(ck);
        if (existing) existing.total += amt;
        else categories.set(ck, { category: row.category, direction: row.direction, total: amt });
      }

      // 2) subscriptions = recurring income (amount) — current month
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('amount, status, created_at')
        .eq('user_id', userId);

      const thisMonth = byKey.get(monthKey(new Date()));
      for (const s of subs ?? []) {
        const amt = Number(s.amount) || 0;
        if (s.status === 'active') {
          payable += amt;
          if (thisMonth) thisMonth.ingresos += amt;
          const ck = 'income:subscriptions';
          const ex = categories.get(ck);
          if (ex) ex.total += amt;
          else categories.set(ck, { category: 'subscriptions', direction: 'income', total: amt });
        }
      }

      // 3) integrations = recurring egresos
      const { data: integrations } = await supabase
        .from('integrations')
        .select('cost, status, name')
        .eq('user_id', userId);

      for (const it of integrations ?? []) {
        const amt = Number(it.cost) || 0;
        if (it.status === 'active') {
          if (thisMonth) thisMonth.egresos += amt;
          const ck = 'expense:integrations';
          const ex = categories.get(ck);
          if (ex) ex.total += amt;
          else categories.set(ck, { category: 'integrations', direction: 'expense', total: amt });
        }
      }

      // 4) projects receivable (pending_payment) — supports legacy 'pending_payment' status
      const { data: projects } = await supabase
        .from('projects')
        .select('amount, status, stage')
        .eq('user_id', userId);

      for (const p of projects ?? []) {
        const amt = Number(p.amount) || 0;
        if (p.status === 'pending_payment' || p.stage === 'authorized') {
          receivable += amt;
        }
      }
    }

    for (const m of months) m.balance = m.ingresos - m.egresos;

    const current = months[months.length - 1];
    const ingresos = current.ingresos;
    const egresos = current.egresos;
    const balance = ingresos - egresos;

    return NextResponse.json({
      success: true,
      summary: { ingresos, egresos, balance, receivable, payable },
      monthly: months,
      categories: Array.from(categories.values()).sort((a, b) => b.total - a.total),
    });
  } catch (error) {
    logger.error('Finance summary failed', error instanceof Error ? error : undefined);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
