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
// Email Template Generator
// ============================================================================
function generateAdminEmailHTML(
  bookingData: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    whatsapp: string;
    sitio_web?: string;
    num_empleados?: number;
    empresa_desc?: string;
  },
  bookingId: string,
): string {
  const adminDashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://victor-ia-app.vercel.app'}/admin/bookings/${bookingId}`;

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Nuevo Lead - Booking</title>
</head>
<body style="margin:0;background:#060609;font-family:'Plus Jakarta Sans',Arial,sans-serif;color:#e5e1e7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#060609;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#131317;border:1px solid rgba(255,255,255,0.09);border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.09);background:linear-gradient(135deg,#111316,#1a1a1f);">
          <span style="font-size:22px;font-weight:800;color:#E5B842;letter-spacing:-0.5px;">VICTOR IA</span>
          <span style="font-size:14px;color:rgba(229,225,231,0.6);margin-left:12px;">NUEVO LEAD</span>
        </td></tr>
        <tr><td style="padding:32px;font-size:15px;line-height:1.7;color:#e5e1e7;">
          <h2 style="margin:0 0 20px;color:#E5B842;">Nuevo Lead Registrado</h2>

          <p style="margin:0 0 16px;"><strong>Nombre:</strong> ${bookingData.nombre} ${bookingData.apellido}</p>
          <p style="margin:0 0 16px;"><strong>Email:</strong> <a href="mailto:${bookingData.email}" style="color:#3B82F6;text-decoration:none;">${bookingData.email}</a></p>
          <p style="margin:0 0 16px;"><strong>Teléfono:</strong> ${bookingData.telefono}</p>
          <p style="margin:0 0 16px;"><strong>WhatsApp:</strong> ${bookingData.whatsapp}</p>

          ${bookingData.sitio_web ? `<p style="margin:0 0 16px;"><strong>Sitio Web:</strong> <a href="${bookingData.sitio_web}" style="color:#3B82F6;text-decoration:none;" target="_blank">${bookingData.sitio_web}</a></p>` : ''}
          ${bookingData.num_empleados ? `<p style="margin:0 0 16px;"><strong>Número de Empleados:</strong> ${bookingData.num_empleados}</p>` : ''}
          ${bookingData.empresa_desc ? `<p style="margin:0 0 16px;"><strong>Descripción:</strong> ${bookingData.empresa_desc}</p>` : ''}

          <div style="margin:24px 0;padding:16px;background:rgba(59,130,246,0.1);border-left:4px solid #3B82F6;border-radius:4px;">
            <p style="margin:0;font-size:14px;color:rgba(229,225,231,0.8);">
              <strong>ID Booking:</strong> ${bookingId}
            </p>
          </div>

          <p style="margin:24px 0 0;">
            <a href="${adminDashboardUrl}" style="display:inline-block;padding:12px 24px;background:#E5B842;color:#060609;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
              Ver en Dashboard
            </a>
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

function generateUserEmailHTML(
  bookingData: {
    nombre: string;
    apellido: string;
  },
  videoUrl: string,
  icsBase64: string,
): string {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Confirmación de Booking</title>
</head>
<body style="margin:0;background:#060609;font-family:'Plus Jakarta Sans',Arial,sans-serif;color:#e5e1e7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#060609;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#131317;border:1px solid rgba(255,255,255,0.09);border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.09);background:linear-gradient(135deg,#111316,#1a1a1f);">
          <span style="font-size:22px;font-weight:800;color:#E5B842;letter-spacing:-0.5px;">VICTOR IA</span>
        </td></tr>
        <tr><td style="padding:32px;font-size:15px;line-height:1.7;color:#e5e1e7;">
          <h2 style="margin:0 0 20px;color:#E5B842;">¡Booking Confirmado!</h2>

          <p style="margin:0 0 16px;">Hola ${bookingData.nombre},</p>

          <p style="margin:0 0 16px;">Gracias por agendar una reunión con nosotros. Tu booking ha sido confirmado exitosamente.</p>

          <div style="margin:24px 0;padding:16px;background:rgba(59,130,246,0.1);border-left:4px solid #3B82F6;border-radius:4px;">
            <p style="margin:0 0 12px;font-size:14px;color:rgba(229,225,231,0.8);">
              <strong>Detalles de tu reunión:</strong>
            </p>
            <p style="margin:8px 0;font-size:14px;">
              <strong>Fecha:</strong> Los próximos 2 días laborales (se enviará link específico)
            </p>
            <p style="margin:8px 0;font-size:14px;">
              <strong>Duración:</strong> 30 minutos
            </p>
            <p style="margin:8px 0;font-size:14px;">
              <strong>Formato:</strong> Videollamada
            </p>
          </div>

          <p style="margin:24px 0 16px;">
            <strong>Accede a tu reunión aquí:</strong><br/>
            <a href="${videoUrl}" style="display:inline-block;padding:12px 24px;background:#E5B842;color:#060609;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;margin-top:12px;">
              Abrir Reunión
            </a>
          </p>

          <p style="margin:16px 0;">
            <strong>Archivo ICS adjunto:</strong> Hemos incluido un archivo .ics para que agregues la reunión a tu calendario (Outlook, Google Calendar, Apple Calendar, etc).
          </p>

          <hr style="margin:24px 0;border:none;border-top:1px solid rgba(255,255,255,0.09);">

          <p style="margin:16px 0 0;font-size:14px;color:rgba(229,225,231,0.6);">
            ¿Necesitas cambiar la fecha o cancelar? Responde a este email o accede a tu booking desde el link en el correo.
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
// Email Sending (Resend or fallback logger)
// ============================================================================
async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  attachments?: Array<{ filename: string; content: Buffer | string; contentType: string }>,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    // Fallback: log to console (no email service configured)
    console.info('[Email] Email service not configured (RESEND_API_KEY missing)');
    console.info('[Email] Would send to:', to);
    console.info('[Email] Subject:', subject);
    return { success: true, messageId: 'logged-to-console' };
  }

  try {
    // Build FormData for multipart email
    const formData = new FormData();
    formData.append('from', 'noreply@victor-ia.com.mx');
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('html', htmlContent);

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        const blob = new Blob(
          [typeof attachment.content === 'string' ? attachment.content : attachment.content],
          { type: attachment.contentType },
        );
        formData.append('attachments', blob, attachment.filename);
      }
    }

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
      return {
        success: false,
        error: `Resend error ${response.status}`,
      };
    }

    const data = await response.json();
    console.info('[Email] Sent successfully:', { to, messageId: data.id });

    return {
      success: true,
      messageId: data.id,
    };
  } catch (error) {
    console.error('[Email] Send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// POST /api/email/send-booking-confirmation
// ============================================================================
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as {
      bookingId: string;
      nombre: string;
      apellido: string;
      email: string;
      telefono: string;
      whatsapp: string;
      sitio_web?: string;
      num_empleados?: number;
      empresa_desc?: string;
      videoUrl: string;
      icsContent: string;
    };

    const {
      bookingId,
      nombre,
      apellido,
      email,
      telefono,
      whatsapp,
      sitio_web,
      num_empleados,
      empresa_desc,
      videoUrl,
      icsContent,
    } = body;

    if (!bookingId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Generate ICS as base64 for email attachment
    const icsBuffer = Buffer.from(icsContent, 'utf-8');
    const icsBase64 = icsBuffer.toString('base64');

    // Email 1: Send to admin
    const adminEmails = [
      'info@victor-ia.com.mx',
      process.env.ADMIN_EMAIL || 'mesainteligentedemo@gmail.com',
    ];

    const adminHTML = generateAdminEmailHTML(
      { nombre, apellido, email, telefono, whatsapp, sitio_web, num_empleados, empresa_desc },
      bookingId,
    );

    for (const adminEmail of adminEmails) {
      await sendEmail(
        adminEmail,
        `[VICTOR IA] Nuevo Lead - ${nombre} ${apellido}`,
        adminHTML,
      );
    }

    // Email 2: Send to user with ICS attachment
    const userHTML = generateUserEmailHTML(
      { nombre, apellido },
      videoUrl,
      icsBase64,
    );

    const userEmailResult = await sendEmail(
      email,
      'Tu booking está confirmado - Victor IA',
      userHTML,
      [
        {
          filename: 'booking.ics',
          content: icsContent,
          contentType: 'text/calendar; charset=utf-8',
        },
      ],
    );

    // Log in Supabase (fire-and-forget)
    if (supabaseAdmin) {
      supabaseAdmin
        .from('booking_emails')
        .insert({
          id: crypto.randomUUID(),
          booking_id: bookingId,
          email_to: email,
          email_type: 'confirmation',
          status: userEmailResult.success ? 'sent' : 'failed',
          resend_message_id: userEmailResult.messageId || null,
          created_at: new Date().toISOString(),
        })
        .catch((err) => console.error('[Supabase] Error logging email:', err));
    }

    if (!userEmailResult.success) {
      console.error('[Email] User confirmation email failed:', userEmailResult.error);
      return NextResponse.json(
        { error: 'Failed to send confirmation email' },
        { status: 500 },
      );
    }

    console.info('[Email] Booking confirmation sent:', { bookingId, email });

    return NextResponse.json(
      {
        success: true,
        message: 'Confirmation email sent',
        messageId: userEmailResult.messageId,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('[Email] Unexpected error:', message);

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}