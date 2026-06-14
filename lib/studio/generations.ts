import { getAdminClient, isAdminConfigured } from '@/lib/db/admin';
import { logger } from '@/lib/logger';

export type GenerationType =
  | 'voice'
  | 'music'
  | 'presentation'
  | 'proposal'
  | 'email'
  | 'image'
  | 'video'
  | 'document'
  | 'website';

export interface GenerationRecord {
  id: string;
  user_id: string;
  type: GenerationType;
  prompt: string | null;
  status: 'processing' | 'completed' | 'failed';
  file_url: string | null;
  content: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface SaveInput {
  userId: string;
  type: GenerationType;
  prompt?: string | null;
  status?: 'processing' | 'completed' | 'failed';
  fileUrl?: string | null;
  content?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Persist a generation. Returns the saved row, or null when the database is not
 * configured (the API still returns its inline result so the UX never breaks).
 */
export async function saveGeneration(input: SaveInput): Promise<GenerationRecord | null> {
  if (!isAdminConfigured()) {
    logger.warn('saveGeneration skipped: database not configured');
    return null;
  }

  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('generations')
      .insert({
        user_id: input.userId,
        type: input.type,
        prompt: input.prompt ?? null,
        status: input.status ?? 'completed',
        file_url: input.fileUrl ?? null,
        content: input.content ?? null,
        metadata: input.metadata ?? null,
      })
      .select()
      .single();

    if (error) {
      logger.error('saveGeneration failed', undefined, { code: error.code });
      return null;
    }
    return data as GenerationRecord;
  } catch (err) {
    logger.error('saveGeneration threw', err instanceof Error ? err : undefined);
    return null;
  }
}

/**
 * List recent generations for a user, optionally filtered by type.
 */
export async function listGenerations(
  userId: string,
  type?: GenerationType,
  limit = 5
): Promise<GenerationRecord[]> {
  if (!isAdminConfigured()) return [];

  try {
    const supabase = getAdminClient();
    let query = supabase
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (type) query = query.eq('type', type);

    const { data, error } = await query;
    if (error) {
      logger.error('listGenerations failed', undefined, { code: error.code });
      return [];
    }
    return (data ?? []) as GenerationRecord[];
  } catch (err) {
    logger.error('listGenerations threw', err instanceof Error ? err : undefined);
    return [];
  }
}
