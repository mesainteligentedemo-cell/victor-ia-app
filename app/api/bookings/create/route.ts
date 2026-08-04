import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// ============================================================================
// Supabase Admin Client
// ============================================================================
const supabaseAdmin =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
      )
    : null;

// ============================================================================
// Rate Limiter (in-memory, simple)
// ============================================================================
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in ms
const RATE_LIMIT_MAX = 3; // max 3 requests per IP per hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Remove old timestamps outside window
  const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);

  if (recentTimestamps.length >= RATE_LIMIT_MAX) {
    return false; // Rate limited
  }

  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  return true; // OK
}

// ============================================================================
// Zod Schema Validation
// ============================================================================
const bookingSchema = z.object({
  nombre: z.string().min(2).max(100),
  apellido: z.string().min(2).max(100),
  telefono: z.string().regex(/^[+\d\s\-()]{10,20}$/, 'Invalid phone format'),
  whatsapp: z.string().regex(/^[+\d\s\-()]{10,20}$/, 'Invalid WhatsApp format'),
  email: z.string().email(),
  sitio_web: z.string().url().optional().or(z.literal('')),
  num_empleados: z.coerce.number().int().min(1).max(100000).optional(),
  empresa_desc: z.string().max(500).optional(),
});

type BookingPayload = z.infer<typeof bookingSchema>;

// ============================================================================
// cal.com API Integration
// ============================================================================
async function createCalComBooking(payload: BookingPayload): Promise<{
  success: boolean;
  bookingId?: string;
  calUrl?: string;
  error?: string;
}> {
  const calApiKey = process.env.CAL_COM_API_KEY;
  const calNamespace = process.env.CAL_COM_NAMESPACE;
  const calEvent = process.env.CAL_COM_EVENT || 'victor-ia';

  if (!calApiKey || !calNamespace) {
    console.error('[cal.com] Missing API key or namespace');
    return {
      success: false,
      error: 'cal.com not configured',
    };
  }

  try {
    // cal.com API v2: POST /attendees to create a booking
    // Reference: https://cal.com/docs/api/v2
    const response = await fetch(`https://api.cal.com/v2/attendees`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${calApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${payload.nombre} ${payload.apellido}`,
        email: payload.email,
        timeZone: 'America/Mexico_City',
        // Additional booking metadata
        metadata: {
          telefono: payload.telefono,
          whatsapp: payload.whatsapp,
          sitio_web: payload.sitio_web || null,
          num_empleados: payload.num_empleados || null,
          empresa_desc: payload.empresa_desc || null,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[cal.com] API error:', response.status, errorData);
      return {
        success: false,
        error: `cal.com error ${response.status}`,
      };
    }

    const data = await response.json();

    // cal.com returns attendeeId, we'll use this as our booking reference
    const bookingId = data.id || data.attendeeId || crypto.randomUUID();

    // Construct cal.com booking URL
    const calUrl = `https://${calNamespace}.cal.com/${calEvent}`;

    return {
      success: true,
      bookingId,
      calUrl,
    };
  } catch (error) {
    console.error('[cal.com] Network error:', error);
    return {
      success: false,
      error: 'Failed to create booking in cal.com',
    };
  }
}

// ============================================================================
// Supabase: Check if email already exists
// ============================================================================
async function checkEmailExists(email: string): Promise<boolean> {
  if (!supabaseAdmin) return false;

  try {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (error) {
      console.error('[Supabase] Error checking email:', error);
      return false;
    }

    return (data?.length ?? 0) > 0;
  } catch (error) {
    console.error('[Supabase] Unexpected error checking email:', error);
    return false;
  }
}

// ============================================================================
// Supabase: Save booking
// ============================================================================
async function saveBookingToSupabase(payload: BookingPayload, calBookingId: string): Promise<string | null> {
  if (!supabaseAdmin) {
    console.warn('[Supabase] Not configured, skipping save');
    return null;
  }

  try {
    const bookingId = crypto.randomUUID();

    const { data, error } = await supabaseAdmin.from('bookings').insert({
      id: bookingId,
      email: payload.email,
      nombre: payload.nombre,
      apellido: payload.apellido,
      telefono: payload.telefono,
      whatsapp: payload.whatsapp,
      sitio_web: payload.sitio_web || null,
      num_empleados: payload.num_empleados || null,
      empresa_desc: payload.empresa_desc || null,
      booking_cal_id: calBookingId,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[Supabase] Insert error:', error);
      return null;
    }

    return bookingId;
  } catch (error) {
    console.error('[Supabase] Unexpected error saving booking:', error);
    return null;
  }
}

// ============================================================================
// CORS Headers
// ============================================================================
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function withCors(response: NextResponse): NextResponse {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

// ============================================================================
// POST /api/bookings/create
// ============================================================================
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Rate limit check
    if (!checkRateLimit(ip)) {
      console.warn('[Booking] Rate limit exceeded for IP:', ip);
      return withCors(
        NextResponse.json(
          { error: 'Too many requests. Max 3 per hour.' },
          { status: 429 },
        ),
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate with Zod
    const validatedData = bookingSchema.parse(body);

    // Check if email already exists
    const emailExists = await checkEmailExists(validatedData.email);
    if (emailExists) {
      console.info('[Booking] Duplicate email attempt:', validatedData.email);
      return withCors(
        NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 },
        ),
      );
    }

    // Create booking in cal.com
    const calResult = await createCalComBooking(validatedData);
    if (!calResult.success) {
      console.error('[Booking] cal.com creation failed:', calResult.error);
      return withCors(
        NextResponse.json(
          { error: calResult.error || 'Failed to create booking' },
          { status: 500 },
        ),
      );
    }

    // Save to Supabase
    const bookingId = await saveBookingToSupabase(validatedData, calResult.bookingId || '');

    console.info('[Booking] Created successfully:', {
      bookingId,
      email: validatedData.email,
      calBookingId: calResult.bookingId,
    });

    return withCors(
      NextResponse.json(
        {
          success: true,
          bookingId,
          calUrl: calResult.calUrl,
          message: 'Booking created successfully. Check your email for confirmation.',
        },
        { status: 201 },
      ),
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('[Booking] Validation error:', error.errors);
      return withCors(
        NextResponse.json(
          { error: 'Validation failed', issues: error.errors },
          { status: 400 },
        ),
      );
    }

    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('[Booking] Unexpected error:', message, error);

    return withCors(
      NextResponse.json(
        { error: message },
        { status: 500 },
      ),
    );
  }
}