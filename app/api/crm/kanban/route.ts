import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/logger';
import { getAdminClient, isAdminConfigured } from '@/lib/db/admin';

export const runtime = 'nodejs';

const GENERIC_ERROR = 'An error occurred processing your request';
const STAGES = ['prospect', 'proposal', 'authorized', 'completed'] as const;
type Stage = (typeof STAGES)[number];

interface KanbanCard {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  stage: Stage;
  value: number;
  deadline: string | null;
  notes: string | null;
  created_at: string;
}

/** GET — all CRM cards for the user, grouped client-side. Supports filters. */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!isAdminConfigured()) {
      return NextResponse.json({ success: true, cards: [] });
    }

    const supabase = getAdminClient();
    let query = supabase
      .from('clients')
      .select('id, name, company, email, phone, stage, value, deadline, notes, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const minValue = Number(req.nextUrl.searchParams.get('minValue'));
    if (Number.isFinite(minValue) && minValue > 0) query = query.gte('value', minValue);

    const { data, error } = await query;
    if (error) {
      logger.error('Kanban fetch failed', undefined, { code: error.code });
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }

    return NextResponse.json({ success: true, cards: (data ?? []) as KanbanCard[] });
  } catch (error) {
    logger.error('Kanban GET failed', error instanceof Error ? error : undefined);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}

/**
 * POST — move a card to a new stage, or update a card's detail fields.
 * Body: { action: 'move', id, stage } | { action: 'update', id, fields }
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let body: { action?: string; id?: string; stage?: string; fields?: Record<string, unknown> };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const id = typeof body.id === 'string' ? body.id.trim() : '';
    if (!id) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    if (!isAdminConfigured()) {
      // Acknowledge so UI optimistic updates persist within the session.
      return NextResponse.json({ success: true });
    }
    const supabase = getAdminClient();

    if (body.action === 'move') {
      const stage = STAGES.includes(body.stage as Stage) ? (body.stage as Stage) : null;
      if (!stage) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

      const { error } = await supabase
        .from('clients')
        .update({ stage, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        logger.error('Kanban move failed', undefined, { code: error.code });
        return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    if (body.action === 'update') {
      const f = body.fields ?? {};
      const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (typeof f.name === 'string') update.name = f.name.trim().slice(0, 200);
      if (typeof f.company === 'string') update.company = f.company.trim().slice(0, 200);
      if (typeof f.email === 'string') update.email = f.email.trim().slice(0, 254);
      if (typeof f.phone === 'string') update.phone = f.phone.trim().slice(0, 40);
      if (typeof f.notes === 'string') update.notes = f.notes.slice(0, 4000);
      if (typeof f.value === 'number' && Number.isFinite(f.value)) update.value = Math.max(0, f.value);
      if (typeof f.deadline === 'string') update.deadline = f.deadline.slice(0, 30) || null;

      const { error } = await supabase
        .from('clients')
        .update(update)
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        logger.error('Kanban update failed', undefined, { code: error.code });
        return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    logger.error('Kanban POST failed', error instanceof Error ? error : undefined);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
