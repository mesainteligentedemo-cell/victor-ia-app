import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase admin client (service role).
 *
 * - Uses SUPABASE_SERVICE_ROLE_KEY → bypasses RLS.
 * - MUST only be imported from server code (API routes / server actions).
 * - All user scoping is enforced in application code AFTER Clerk auth().
 *
 * Never import this from a "use client" component.
 */
let cached: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    // Surfaced as a generic error by callers; details only in server logs.
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}

/** True when the service-role client can be constructed. */
export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
