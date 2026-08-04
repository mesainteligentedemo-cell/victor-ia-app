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
// Reminder Email Template
// ============================================================================
function generateReminderEmailHTML(
  bookingData: {
    nombre: string;
    apellido: string;
    booking_time: string;
  },
  videoUrl: string,
): string {
  // Parse booking time to show how long until the meeting
  const bookingDate = new Date(bookingData.booking_time);
  const now = new Date();
  const diffMs = bookingDate.getTime() - now.getTime();
  const hoursUntil = Math.round(diffMs / (1000 * 60 * 60));
  const timeText = hoursUntil === 1 ? '1 hora' : `${hoursUntil} horas`;

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Recordatorio de Reunión</title>
</head>
<body style="margin:0;background:#060609;font-family:'Plus Jakarta Sans',Arial,sans-serif;color:#e5e1e7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#060609;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#131317;border:1px solid rgba(255,255,255,0.09);border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.09);background:linear-gradient(135deg,#111316,#1a1a1f);">
          <span style="font-size:22px;font-weight:800;color:#E5B842;letter-spacing:-0.5px;">VICTOR IA</span>
          <span style="font-size:14px;color:rgba(229,225,231,0.6);margin-left:12px;">RECORDATORIO</span>
        </td></tr>
        <tr><td style="padding:32px;font-size:15px;line-height:1.7;color:#e5e1e7;">
          <h2 style="margin:0 0 20px;color:#E5B842;">Tu reunión comienza en ${timeText}</h2>

          <p style="margin:0 0 16px;">Hola ${bookingData.nombre},</p>

          <p style="margin:0 0 16px;">Te recordamos que tienes una reunión agendada con el equipo de Victor IA en <strong>${timeText}</strong>.</p>

          <div style="margin:24px 0;padding:16px;background:rgba(59,130,246,0.1);border-left:4px solid #3B82F6;border-radius:4px;">
            <p style="margin:0 0 12px;font-size:14px;color:rgba(229,225,231,0.8);">
              <strong>Detalles de la reunión:</strong>
            </p>
            <p style="margin:8px 0;font-size:14px;">
              <strong>Hora:</strong> ${bookingDate.toLocaleString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Mexico_City'
              })}
            </p>
            <p style="margin:8px 0;font-size:14px;">
              <strong>Zona horaria:</strong> América/México_City
            </p>
          </div>

          <p style="margin:24px 0;">
            <a href="${videoUrl}" style="display:inline-block;padding:12px 24px;background:#E5B842;color:#060609;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
              Acceder a la Reunión
            </a>
          </p>

          <hr style="margin:24px 0;border:none;border-top:1px solid rgba(255,255,255,0.09);">

          <p style="margin:16px 0 0;font-size:14px;color:rgba(229,225,231,0.6);">
            Si necesitas cambiar la hora o tienes alguna pregunta, responde a este email.
          </p>

          <p style="margin:24px 0 0;color:rgba(229,225,231,0.6);">
            — Equipo Victor IA
          </p>
        </td></tr>
        <tr><td style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.09);font-size:12px;color:rgba(229,225,231,0.45);">
          Victor IA · Inteligencia Artificial aplicada a tu negocio<br/>
          <a href="https://victor-ia.com.mx" style="color:#3B82F6;text-decoration:none;">victor-ia.com.mx</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ============================================================================
// Email Sending (Resend)
// ============================================================================
async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
): Promise<{ success: boolean; messageId?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.info('[Email] Email service not configured (RESEND_API_KEY missing)');
    return { success: true, messageId: 'logged-to-console' };
  }

  try {
    const formData = new FormData();
    formData.append('from', 'noreply@victor-ia.com.mx');
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('html', htmlContent);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[Resend] API error:', response.status, errorData);
      return { success: false };
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('[Email] Send error:', error);
    return { success: false };
  }
}

// ============================================================================
// POST /api/reminders/schedule — Cron Job Handler
// ============================================================================
// Triggered by Vercel Cron (POST every hour)
// Vercel Cron passes Authorization header with cron secret
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify cron secret (optional but recommended)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn('[Reminders] Unauthorized cron request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    if (!supabaseAdmin) {
      console.error('[Reminders] Supabase not configured');
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 },
      );
    }

    // Find bookings within the next 24 hours and 1 hour
    const now = new Date();
    const in1Hour = new Date(now.getTime() + 1 * 60 * 60 * 1000);
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Fetch bookings that need reminders
    const { data: bookings, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('status', 'confirmed')
      .gte('booking_time', now.toISOString())
      .lte('booking_time', in24Hours.toISOString())
      .is('reminder_sent', false);

    if (fetchError) {
      console.error('[Reminders] Query error:', fetchError);
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 },
      );
    }

    console.info('[Reminders] Found bookings needing reminders:', bookings?.length ?? 0);

    if (!bookings || bookings.length === 0) {
      return NextResponse.json(
        { success: true, reminders_sent: 0 },
        { status: 200 },
      );
    }

    // Send reminders and track
    const remindersResult = [];
    const calNamespace = process.env.CAL_COM_NAMESPACE || 'demo-mesa-inteligente-9icuas';
    const calEvent = process.env.CAL_COM_EVENT || 'victor-ia';
    const videoUrl = `https://${calNamespace}.cal.com/${calEvent}`;

    for (const booking of bookings) {
      try {
        const reminderHTML = generateReminderEmailHTML(
          {
            nombre: booking.nombre,
            apellido: booking.apellido,
            booking_time: booking.booking_time || '',
          },
          videoUrl,
        );

        const emailResult = await sendEmail(
          booking.email,
          'Recordatorio: Tu reunión con Victor IA está próxima',
          reminderHTML,
        );

        // Log reminder sent
        await supabaseAdmin.from('reminders_sent').insert({
          id: crypto.randomUUID(),
          booking_id: booking.id,
          email: booking.email,
          sent_at: new Date().toISOString(),
          status: emailResult.success ? 'sent' : 'failed',
          resend_message_id: emailResult.messageId || null,
        });

        // Mark booking reminder as sent
        await supabaseAdmin
          .from('bookings')
          .update({ reminder_sent: true })
          .eq('id', booking.id);

        remindersResult.push({
          booking_id: booking.id,
          email: booking.email,
          status: emailResult.success ? 'sent' : 'failed',
        });

        console.info('[Reminders] Reminder sent:', { booking_id: booking.id, email: booking.email });
      } catch (error) {
        console.error('[Reminders] Error processing booking:', booking.id, error);
        remindersResult.push({
          booking_id: booking.id,
          email: booking.email,
          status: 'error',
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        reminders_sent: remindersResult.filter(r => r.status === 'sent').length,
        reminders_failed: remindersResult.filter(r => r.status !== 'sent').length,
        details: remindersResult,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('[Reminders] Unexpected error:', message);

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}