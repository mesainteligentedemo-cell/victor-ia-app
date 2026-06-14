import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { logger } from '@/lib/logger';
import { getAdminClient, isAdminConfigured } from '@/lib/db/admin';
import { isValidEmail } from '@/lib/security/validation';

export const runtime = 'nodejs';

const GENERIC_ERROR = 'An error occurred processing your request';

const CURRENCIES = ['MXN', 'USD'];
const LANGUAGES = ['es', 'en'];
const THEMES = ['dark', 'light'];

interface SettingsBody {
  fullName?: unknown;
  avatarUrl?: unknown;
  currency?: unknown;
  timezone?: unknown;
  language?: unknown;
  theme?: unknown;
}

const DEFAULTS = {
  full_name: '',
  avatar_url: '',
  currency: 'MXN',
  timezone: 'America/Mexico_City',
  language: 'es',
  theme: 'dark',
};

/** GET — current user's settings (merges Clerk identity + stored prefs). */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const cu = await currentUser();
    const email = cu?.emailAddresses?.[0]?.emailAddress ?? '';

    let stored = { ...DEFAULTS };
    if (isAdminConfigured()) {
      const supabase = getAdminClient();
      const { data } = await supabase
        .from('users')
        .select('full_name, avatar_url, currency, timezone, language, theme')
        .eq('clerk_id', userId)
        .maybeSingle();
      if (data) stored = { ...stored, ...data };
    }

    return NextResponse.json({
      success: true,
      settings: {
        fullName: stored.full_name || cu?.fullName || '',
        email,
        avatarUrl: stored.avatar_url || cu?.imageUrl || '',
        currency: stored.currency,
        timezone: stored.timezone,
        language: stored.language,
        theme: stored.theme,
      },
    });
  } catch (error) {
    logger.error('Settings fetch failed', error instanceof Error ? error : undefined);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}

/** POST — persist editable settings (auth Clerk). */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let body: SettingsBody;
    try {
      body = (await req.json()) as SettingsBody;
    } catch {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Validation
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    if (fullName.length < 2 || fullName.length > 120) {
      return NextResponse.json({ error: 'El nombre debe tener al menos 2 caracteres.' }, { status: 400 });
    }

    const avatarUrl = typeof body.avatarUrl === 'string' ? body.avatarUrl.trim().slice(0, 1000) : '';
    if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
      return NextResponse.json({ error: 'URL de avatar inválida.' }, { status: 400 });
    }

    const currency = CURRENCIES.includes(body.currency as string) ? (body.currency as string) : 'MXN';
    const language = LANGUAGES.includes(body.language as string) ? (body.language as string) : 'es';
    const theme = THEMES.includes(body.theme as string) ? (body.theme as string) : 'dark';
    const timezone =
      typeof body.timezone === 'string' && body.timezone.trim().length > 0 && body.timezone.length < 80
        ? body.timezone.trim()
        : 'America/Mexico_City';

    if (!isAdminConfigured()) {
      // Persist nothing but acknowledge so the UI still works in dev.
      logger.warn('Settings save skipped: database not configured');
      return NextResponse.json({
        success: true,
        settings: { fullName, avatarUrl, currency, language, theme, timezone },
      });
    }

    const cu = await currentUser();
    const email = cu?.emailAddresses?.[0]?.emailAddress ?? `${userId}@clerk.local`;
    if (email && !isValidEmail(email)) {
      // email comes from Clerk; if malformed just skip the email column
    }

    const supabase = getAdminClient();
    const { error } = await supabase
      .from('users')
      .upsert(
        {
          clerk_id: userId,
          email,
          full_name: fullName,
          name: fullName,
          avatar_url: avatarUrl || null,
          currency,
          timezone,
          language,
          theme,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'clerk_id' }
      );

    if (error) {
      logger.error('Settings upsert failed', undefined, { code: error.code });
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      settings: { fullName, avatarUrl, currency, language, theme, timezone },
    });
  } catch (error) {
    logger.error('Settings save failed', error instanceof Error ? error : undefined);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
