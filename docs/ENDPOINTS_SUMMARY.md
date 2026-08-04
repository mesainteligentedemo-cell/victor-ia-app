# Cal.com Integration — Endpoints Summary

## 4 Archivos Creados

| Archivo | Método | Ruta |
|---------|--------|------|
| app/api/bookings/create/route.ts | POST | /api/bookings/create |
| app/api/bookings/[id]/route.ts | GET | /api/bookings/:id |
| app/api/email/send-booking-confirmation/route.ts | POST | /api/email/send-booking-confirmation |
| app/api/reminders/schedule/route.ts | POST | /api/reminders/schedule |

## Zod Schemas

- nombre: string (2-100 chars)
- apellido: string (2-100 chars)
- email: valid email
- telefono: string regex ^[+\d\s\-()]{10,20}$
- whatsapp: string regex ^[+\d\s\-()]{10,20}$
- sitio_web: optional URL
- num_empleados: optional integer 1-100000
- empresa_desc: optional string 0-500

## Cal.com API Calls

POST https://api.cal.com/v2/attendees
- Auth: Bearer {CAL_COM_API_KEY}
- Body: name, email, timeZone, metadata
- Response: id, attendeeId

## .env Variables (Nueva)

`
CAL_COM_API_KEY=cal_live_bbbfcfc2949ce9e845b82ec8df1be29b
CAL_COM_NAMESPACE=demo-mesa-inteligente-9icuas
CAL_COM_EVENT=victor-ia
RESEND_API_KEY=re_xxxxx
ADMIN_EMAIL=mesainteligentedemo@gmail.com
CRON_SECRET=generated_secret
`

## Supabase Tables

### bookings
- id (UUID PK)
- email (TEXT UNIQUE)
- nombre, apellido, telefono, whatsapp
- sitio_web, empresa_desc, num_empleados (nullable)
- booking_cal_id
- status: confirmed, cancelled, pending
- reminder_sent: boolean default false
- created_at, updated_at

### booking_emails
- id, booking_id (FK), email_to, email_type, status, resend_message_id, created_at

### reminders_sent
- id, booking_id (FK), email, sent_at, status, resend_message_id, created_at

## HTTP Endpoints

### POST /api/bookings/create
- Rate limit: 3/hour per IP
- Validation: Zod schema
- Duplicate check: email UNIQUE
- Response: bookingId, calUrl
- Errors: 400, 409, 429, 500

### GET /api/bookings/:id
- Response: booking details, ICS content, video URL
- ICS: RFC 5545 compliant, 30min meeting 2 days from now
- Errors: 404, 500

### POST /api/email/send-booking-confirmation
- Emails: Admin (info@victor-ia.com.mx + ADMIN_EMAIL)
- Emails: User (email + ICS attachment)
- Service: Resend (if RESEND_API_KEY set)
- Logging: booking_emails table
- Errors: 400, 500

### POST /api/reminders/schedule
- Cron: hourly via Vercel Cron
- Auth: Bearer CRON_SECRET
- Logic: bookings within 24h, status confirmed, reminder_sent false
- Action: send email, log in reminders_sent, update reminder_sent = true
- Errors: 401, 500

## Flow

1. POST /api/bookings/create → Supabase + cal.com
2. POST /api/email/send-booking-confirmation → Resend + logging
3. Vercel Cron /api/reminders/schedule hourly

## Deployment

- .env: CAL_COM_API_KEY, RESEND_API_KEY, CRON_SECRET
- Supabase: execute 3 table migrations
- vercel.json: add crons config
- Resend: verify domain noreply@victor-ia.com.mx
- Test: curl POST /api/bookings/create
