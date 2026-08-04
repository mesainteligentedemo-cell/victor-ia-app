import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
// ICS (iCalendar) Generator — RFC 5545 Compliant
// ============================================================================
function generateICS(booking: {
  nombre: string;
  apellido: string;
  email: string;
  created_at: string;
}): string {
  // Event details
  const eventTitle = 'Reunión con Victor IA';
  const eventDescription = `Reunión agendada con ${booking.nombre} ${booking.apellido}`;

  // Cal.com video conference URL (will be populated from booking details)
  const videoUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://victor-ia-app.vercel.app';

  // Event datetime (start 2 days from now at 10:00 AM, duration 30 mins)
  const eventStart = new Date();
  eventStart.setDate(eventStart.getDate() + 2);
  eventStart.setHours(10, 0, 0, 0);

  const eventEnd = new Date(eventStart);
  eventEnd.setMinutes(eventEnd.getMinutes() + 30);

  // Format datetime for ICS (YYYYMMDDTHHMMSSZ)
  const formatDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  };

  const dtstartValue = formatDateTime(eventStart);
  const dtendValue = formatDateTime(eventEnd);
  const dtstampValue = formatDateTime(new Date());

  // Escape text for ICS
  const escapeICS = (text: string): string => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;')
      .replace(/\n/g, '\\n');
  };

  // Generate unique UID (based on booking email + timestamp)
  const uid = `booking-${booking.email}-${Date.now()}@victor-ia.com.mx`;

  // Build ICS content
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Victor IA//Victor IA App//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-TIMEZONE:America/Mexico_City
BEGIN:VEVENT
UID:${escapeICS(uid)}
DTSTAMP:${dtstampValue}
DTSTART:${dtstartValue}
DTEND:${dtendValue}
SUMMARY:${escapeICS(eventTitle)}
DESCRIPTION:${escapeICS(eventDescription)}
LOCATION:${escapeICS(videoUrl)}
ORGANIZER;CN=Victor IA:mailto:info@victor-ia.com.mx
ATTENDEE;CN=${escapeICS(booking.nombre)} ${escapeICS(booking.apellido)}:mailto:${booking.email}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}

// ============================================================================
// GET /api/bookings/:id
// ============================================================================
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 },
      );
    }

    // Fetch booking from Supabase
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('[Booking GET] Not found or error:', error);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 },
      );
    }

    // Generate ICS file content
    const icsContent = generateICS({
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      created_at: data.created_at,
    });

    // Generate video conferencing URL
    const calNamespace = process.env.CAL_COM_NAMESPACE || 'demo-mesa-inteligente-9icuas';
    const calEvent = process.env.CAL_COM_EVENT || 'victor-ia';
    const videoUrl = `https://${calNamespace}.cal.com/${calEvent}`;

    console.info('[Booking GET] Retrieved:', { bookingId: id, email: data.email });

    return NextResponse.json(
      {
        success: true,
        booking_details: {
          id: data.id,
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          telefono: data.telefono,
          whatsapp: data.whatsapp,
          sitio_web: data.sitio_web,
          num_empleados: data.num_empleados,
          empresa_desc: data.empresa_desc,
          status: data.status,
          created_at: data.created_at,
          booking_cal_id: data.booking_cal_id,
        },
        ics_content: icsContent,
        video_url: videoUrl,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('[Booking GET] Unexpected error:', message);

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}