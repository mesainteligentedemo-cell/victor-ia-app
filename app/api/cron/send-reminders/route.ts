import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { z } from 'zod';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

// Initialize clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const resendApiKey = process.env.RESEND_API_KEY || '';
const cronSecret = process.env.CRON_SECRET || '';
const victorEmail = process.env.VICTOR_EMAIL || 'info@victor-ia.com.mx';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

// Validation schemas
const BookingSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  booking_datetime: z.string().datetime(),
  timezone: z.string().default('America/Mexico_City'),
  video_url: z.string().url(),
  reminder_1day_sent: z.boolean().default(false),
  reminder_1hour_sent: z.boolean().default(false),
  cal_com_event_id: z.string(),
});

type Booking = z.infer<typeof BookingSchema>;

interface ReminderSentRecord {
  id?: string;
  booking_id: string;
  reminder_type: '1day' | '1hour';
  sent_at: string;
  status: 'sent' | 'failed';
  error_message?: string;
}

// Helper: Format date/time in user's timezone
function formatDateTimeInTimezone(isoDateTime: string, timezone: string): string {
  try {
    const date = new Date(isoDateTime);
    const formatter = new Intl.DateTimeFormat('es-MX', {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return formatter.format(date);
  } catch (error) {
    logger.error('Error formatting date', error as Error);
    return new Date(isoDateTime).toISOString();
  }
}

// Helper: Calculate time until booking
function getTimeUntilBooking(isoDateTime: string): {
  hours: number;
  minutes: number;
} {
  const now = new Date();
  const booking = new Date(isoDateTime);
  const diffMs = booking.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes };
}

// Helper: Generate Cal.com links
interface CalComLinks {
  joinUrl: string;
  rescheduleUrl: string;
  cancelUrl: string;
}

function generateCalcomLinks(
  bookingId: string,
  calComEventId: string,
  email: string
): CalComLinks {
  const baseCalUrl = 'https://cal.com';
  const encodedEmail = encodeURIComponent(email);

  return {
    joinUrl: `${baseCalUrl}/event/${calComEventId}?email=${encodedEmail}`,
    rescheduleUrl: `${baseCalUrl}/event/${calComEventId}/reschedule?email=${encodedEmail}`,
    cancelUrl: `${baseCalUrl}/event/${calComEventId}/cancel?email=${encodedEmail}`,
  };
}

// Helper: Send 1-day reminder email
async function sendOneDayReminder(booking: Booking): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const formattedDateTime = formatDateTimeInTimezone(
      booking.booking_datetime,
      booking.timezone
    );
    const { joinUrl, rescheduleUrl, cancelUrl } = generateCalcomLinks(
      booking.id,
      booking.cal_com_event_id,
      booking.email
    );

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px; }
    .info-box p { margin: 8px 0; }
    .info-box strong { color: #667eea; }
    .button { display: inline-block; padding: 12px 24px; margin: 10px 5px 10px 0; border-radius: 4px; text-decoration: none; font-weight: 600; }
    .button-primary { background: #667eea; color: white; }
    .button-secondary { background: #e0e7ff; color: #667eea; }
    .button-danger { background: #fee2e2; color: #dc2626; }
    .button:hover { opacity: 0.9; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
    .footer p { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Recordatorio: Videollamada Mañana</h1>
    </div>
    <div class="content">
      <p>¡Hola ${booking.name}! 👋</p>
      <p>Te recordamos que tu videollamada con <strong>Victor IA</strong> está programada para <strong>mañana</strong>.</p>

      <div class="info-box">
        <p><strong>📅 Fecha y Hora:</strong></p>
        <p>${formattedDateTime}</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">Zona horaria: ${booking.timezone}</p>
      </div>

      <p>Haz clic en el botón de abajo para unirte a la videollamada:</p>
      <a href="${joinUrl}" class="button button-primary">Unirme a la Videollamada</a>

      <p style="margin-top: 20px;">¿Necesitas hacer cambios?</p>
      <a href="${rescheduleUrl}" class="button button-secondary">Reprogramar</a>
      <a href="${cancelUrl}" class="button button-danger">Cancelar</a>

      <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
        Si tienes preguntas o problemas, no dudes en contactarnos en ${victorEmail}
      </p>

      <div class="footer">
        <p>© 2026 Victor IA. Todos los derechos reservados.</p>
        <p>Este es un correo automático, por favor no responder a este mensaje.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const result = await resend.emails.send({
      from: `Victor IA <${victorEmail}>`,
      to: booking.email,
      subject: `Recordatorio: Tu videollamada con Victor IA es mañana 📅`,
      html: emailHtml,
      replyTo: victorEmail,
    });

    if (result.error) {
      logger.error('Resend error:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error sending 1-day reminder:', error as Error);
    return { success: false, error: errorMsg };
  }
}

// Helper: Send 1-hour reminder email
async function sendOneHourReminder(booking: Booking): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const formattedDateTime = formatDateTimeInTimezone(
      booking.booking_datetime,
      booking.timezone
    );
    const { hours, minutes } = getTimeUntilBooking(booking.booking_datetime);
    const { joinUrl } = generateCalcomLinks(
      booking.id,
      booking.cal_com_event_id,
      booking.email
    );

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 10px 0 0 0; font-size: 18px; opacity: 0.9; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .urgency-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .urgency-box p { margin: 8px 0; font-weight: 600; }
    .info-box { background: white; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px; }
    .info-box p { margin: 8px 0; }
    .info-box strong { color: #f59e0b; }
    .button { display: inline-block; padding: 14px 28px; margin: 15px 5px 15px 0; border-radius: 4px; text-decoration: none; font-weight: 700; font-size: 16px; }
    .button-primary { background: #f59e0b; color: white; }
    .button-primary:hover { background: #d97706; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
    .footer p { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>¡Tu Videollamada es en 1 Hora! ⏰</h1>
      <p>${hours}h ${minutes}m</p>
    </div>
    <div class="content">
      <p>¡Hola ${booking.name}! 👋</p>

      <div class="urgency-box">
        <p>⚠️ Tu videollamada con <strong>Victor IA</strong> comienza en aproximadamente 1 hora.</p>
      </div>

      <div class="info-box">
        <p><strong>📅 Hora Exacta:</strong></p>
        <p>${formattedDateTime}</p>
      </div>

      <p style="font-weight: 600; color: #1f2937;">¡Únete ahora para no perderla!</p>
      <a href="${joinUrl}" class="button button-primary">Unirme a la Videollamada Ahora →</a>

      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        Si tienes preguntas, contáctanos en ${victorEmail}
      </p>

      <div class="footer">
        <p>© 2026 Victor IA. Todos los derechos reservados.</p>
        <p>Este es un correo automático, por favor no responder a este mensaje.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const result = await resend.emails.send({
      from: `Victor IA <${victorEmail}>`,
      to: booking.email,
      subject: `¡Tu videollamada con Victor IA es en 1 hora! ⏰`,
      html: emailHtml,
      replyTo: victorEmail,
    });

    if (result.error) {
      logger.error('Resend error:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error sending 1-hour reminder:', error as Error);
    return { success: false, error: errorMsg };
  }
}

// Main cron handler
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Verify CRON_SECRET
    const authHeader = req.headers.get('authorization') || '';
    const providedSecret = authHeader.replace('Bearer ', '');

    if (!cronSecret || providedSecret !== cronSecret) {
      logger.warn('Unauthorized cron request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      logger.error('Missing Supabase configuration');
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    if (!resendApiKey) {
      logger.error('Missing Resend API key');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Calculate time windows (all times in UTC)
    const now = new Date();

    // 1-day reminder: 23h59m to 24h01m
    const oneDayMinusTime = new Date(now.getTime() + 23 * 60 * 60 * 1000 - 60 * 1000);
    const oneDayPlusTime = new Date(now.getTime() + 24 * 60 * 60 * 1000 + 60 * 1000);

    // 1-hour reminder: 59m to 61m
    const oneHourMinusTime = new Date(now.getTime() + 59 * 60 * 1000);
    const oneHourPlusTime = new Date(now.getTime() + 61 * 60 * 1000);

    // Query bookings needing 1-day reminder
    const { data: bookings1Day, error: error1Day } = await supabase
      .from('bookings')
      .select('*')
      .eq('reminder_1day_sent', false)
      .gte('booking_datetime', oneDayMinusTime.toISOString())
      .lte('booking_datetime', oneDayPlusTime.toISOString())
      .limit(500);

    if (error1Day) {
      logger.error('Error querying 1-day reminders:', error1Day);
      return NextResponse.json(
        { error: 'Database error', details: error1Day.message },
        { status: 500 }
      );
    }

    // Query bookings needing 1-hour reminder
    const { data: bookings1Hour, error: error1Hour } = await supabase
      .from('bookings')
      .select('*')
      .eq('reminder_1hour_sent', false)
      .gte('booking_datetime', oneHourMinusTime.toISOString())
      .lte('booking_datetime', oneHourPlusTime.toISOString())
      .limit(500);

    if (error1Hour) {
      logger.error('Error querying 1-hour reminders:', error1Hour);
      return NextResponse.json(
        { error: 'Database error', details: error1Hour.message },
        { status: 500 }
      );
    }

    let reminders1DaySent = 0;
    let reminders1HourSent = 0;
    const errors: Array<{ bookingId: string; type: string; error: string }> = [];

    // Send 1-day reminders
    for (const booking of bookings1Day || []) {
      try {
        const validated = BookingSchema.parse(booking);
        const { success, error } = await sendOneDayReminder(validated);

        if (success) {
          // Update database
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              reminder_1day_sent: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', booking.id);

          if (updateError) {
            logger.error('Error updating booking:', updateError);
            errors.push({
              bookingId: booking.id,
              type: '1day',
              error: `Update failed: ${updateError.message}`,
            });
          } else {
            // Log in reminders_sent table
            await supabase.from('reminders_sent').insert({
              booking_id: booking.id,
              reminder_type: '1day',
              sent_at: new Date().toISOString(),
              status: 'sent',
            });
            reminders1DaySent++;
          }
        } else {
          errors.push({
            bookingId: booking.id,
            type: '1day',
            error: error || 'Unknown error',
          });

          // Log failed attempt
          await supabase.from('reminders_sent').insert({
            booking_id: booking.id,
            reminder_type: '1day',
            sent_at: new Date().toISOString(),
            status: 'failed',
            error_message: error,
          });
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push({
          bookingId: booking.id,
          type: '1day',
          error: errorMsg,
        });
      }
    }

    // Send 1-hour reminders
    for (const booking of bookings1Hour || []) {
      try {
        const validated = BookingSchema.parse(booking);
        const { success, error } = await sendOneHourReminder(validated);

        if (success) {
          // Update database
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              reminder_1hour_sent: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', booking.id);

          if (updateError) {
            logger.error('Error updating booking:', updateError);
            errors.push({
              bookingId: booking.id,
              type: '1hour',
              error: `Update failed: ${updateError.message}`,
            });
          } else {
            // Log in reminders_sent table
            await supabase.from('reminders_sent').insert({
              booking_id: booking.id,
              reminder_type: '1hour',
              sent_at: new Date().toISOString(),
              status: 'sent',
            });
            reminders1HourSent++;
          }
        } else {
          errors.push({
            bookingId: booking.id,
            type: '1hour',
            error: error || 'Unknown error',
          });

          // Log failed attempt
          await supabase.from('reminders_sent').insert({
            booking_id: booking.id,
            reminder_type: '1hour',
            sent_at: new Date().toISOString(),
            status: 'failed',
            error_message: error,
          });
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push({
          bookingId: booking.id,
          type: '1hour',
          error: errorMsg,
        });
      }
    }

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      reminders_sent_1day: reminders1DaySent,
      reminders_sent_1hour: reminders1HourSent,
      total_sent: reminders1DaySent + reminders1HourSent,
      total_processed: (bookings1Day?.length || 0) + (bookings1Hour?.length || 0),
      errors: errors.length > 0 ? errors : undefined,
    };

    logger.info('Cron job completed', response);

    return NextResponse.json(response);
  } catch (error) {
    logger.error('Cron job error:', error as Error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Allow POST as well for manual testing
export async function POST(req: NextRequest): Promise<NextResponse> {
  return GET(req);
}