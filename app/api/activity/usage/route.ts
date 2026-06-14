import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/logger';
import { getAdminClient, isAdminConfigured } from '@/lib/db/admin';

export const runtime = 'nodejs';

const GENERIC_ERROR = 'An error occurred processing your request';

// USD per 1M tokens (input/output). Conservative public list prices.
const MODEL_RATES: Record<string, { in: number; out: number }> = {
  'claude-opus': { in: 15, out: 75 },
  'claude-sonnet': { in: 3, out: 15 },
  'claude-haiku': { in: 0.8, out: 4 },
  'gpt-4o': { in: 2.5, out: 10 },
  'gpt-4o-mini': { in: 0.15, out: 0.6 },
  default: { in: 3, out: 15 },
};

function rateFor(model: string) {
  const key = Object.keys(MODEL_RATES).find((k) => model.toLowerCase().includes(k));
  return MODEL_RATES[key ?? 'default'];
}

interface UsageRow {
  date: string;
  prompt: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  cost: number;
  client: string;
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const days = Math.min(Math.max(Number(req.nextUrl.searchParams.get('days') ?? '30'), 1), 365);
    const since = new Date(Date.now() - days * 86400000).toISOString();

    const rows: UsageRow[] = [];
    let revenueByClient: Record<string, number> = {};

    if (isAdminConfigured()) {
      const supabase = getAdminClient();

      // analytics_events with token data in event_data
      const { data: events } = await supabase
        .from('analytics_events')
        .select('event_type, event_data, timestamp')
        .eq('user_id', userId)
        .gte('timestamp', since)
        .order('timestamp', { ascending: false })
        .limit(2000);

      for (const e of events ?? []) {
        const d = (e.event_data ?? {}) as Record<string, unknown>;
        const inputTokens = Number(d.inputTokens ?? d.input_tokens ?? d.tokensInput ?? 0) || 0;
        const outputTokens = Number(d.outputTokens ?? d.output_tokens ?? d.tokensOutput ?? 0) || 0;
        if (inputTokens === 0 && outputTokens === 0) continue;
        const model = String(d.model ?? 'default');
        const r = rateFor(model);
        const cost = (inputTokens / 1e6) * r.in + (outputTokens / 1e6) * r.out;
        rows.push({
          date: e.timestamp,
          prompt: String(d.prompt ?? d.action ?? e.event_type ?? '').slice(0, 120),
          model,
          inputTokens,
          outputTokens,
          durationMs: Number(d.durationMs ?? d.duration ?? 0) || 0,
          cost,
          client: String(d.client ?? d.project ?? 'General'),
        });
      }

      // roi_tracking → revenue per project for ROI
      const { data: roi } = await supabase
        .from('roi_tracking')
        .select('project_id, value_generated_usd')
        .eq('user_id', userId);
      for (const r of roi ?? []) {
        const key = r.project_id ?? 'General';
        revenueByClient[key] = (revenueByClient[key] ?? 0) + (Number(r.value_generated_usd) || 0);
      }
    }

    // Aggregations
    const window = (d: number) => {
      const cut = Date.now() - d * 86400000;
      const f = rows.filter((r) => new Date(r.date).getTime() >= cut);
      return {
        inputTokens: f.reduce((s, r) => s + r.inputTokens, 0),
        outputTokens: f.reduce((s, r) => s + r.outputTokens, 0),
        cost: f.reduce((s, r) => s + r.cost, 0),
      };
    };

    // tokens over time (daily)
    const dailyMap = new Map<string, { date: string; input: number; output: number }>();
    for (const r of rows) {
      const day = r.date.slice(0, 10);
      const ex = dailyMap.get(day) ?? { date: day, input: 0, output: 0 };
      ex.input += r.inputTokens;
      ex.output += r.outputTokens;
      dailyMap.set(day, ex);
    }
    const daily = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // by model
    const modelMap = new Map<string, { model: string; tokens: number; cost: number }>();
    for (const r of rows) {
      const ex = modelMap.get(r.model) ?? { model: r.model, tokens: 0, cost: 0 };
      ex.tokens += r.inputTokens + r.outputTokens;
      ex.cost += r.cost;
      modelMap.set(r.model, ex);
    }
    const byModel = Array.from(modelMap.values()).sort((a, b) => b.tokens - a.tokens);

    // by client (cost + ROI)
    const clientMap = new Map<string, { client: string; cost: number; tokens: number }>();
    for (const r of rows) {
      const ex = clientMap.get(r.client) ?? { client: r.client, cost: 0, tokens: 0 };
      ex.cost += r.cost;
      ex.tokens += r.inputTokens + r.outputTokens;
      clientMap.set(r.client, ex);
    }
    const byClient = Array.from(clientMap.values()).map((c) => ({
      ...c,
      revenue: revenueByClient[c.client] ?? 0,
      roi: c.cost > 0 ? ((revenueByClient[c.client] ?? 0) - c.cost) / c.cost : 0,
    }));

    const totalCost = rows.reduce((s, r) => s + r.cost, 0);
    const totalHours = rows.reduce((s, r) => s + r.durationMs, 0) / 3_600_000;
    const totalRevenue = Object.values(revenueByClient).reduce((s, v) => s + v, 0);

    return NextResponse.json({
      success: true,
      windows: { d7: window(7), d30: window(30), d90: window(90) },
      daily,
      byModel,
      byClient,
      table: rows.slice(0, 100),
      efficiency: {
        revenuePerHour: totalHours > 0 ? totalRevenue / totalHours : 0,
        roiOverall: totalCost > 0 ? (totalRevenue - totalCost) / totalCost : 0,
        totalCost,
        totalRevenue,
        totalHours,
      },
    });
  } catch (error) {
    logger.error('Activity usage failed', error instanceof Error ? error : undefined);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
