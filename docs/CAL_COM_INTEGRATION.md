# Cal.com Integration — API Endpoints Documentation

## Overview
4 endpoints para integración completa con cal.com: creación de bookings, recuperación de detalles, confirmaciones por email y recordatorios automáticos.

---

## 1. Rutas Creadas

### ✅ POST `/api/bookings/create`
**Ruta:** `C:\Users\inbou\victor-ia-app\app\api\bookings\create\route.ts`

Crea un nuevo booking en cal.com y lo guarda en Supabase.

**Request:**
```json
{
  "nombre": "Pablo",
  "apellido": "González",
  "email": "pablo@victor-ia.com.mx",
  "telefono": "+52 55 1234 5678",
  "whatsapp": "+52 55 1234 5678",
  "sitio_web": "https://victor-ia.com.mx",
  "num_empleados": 50,
  "empresa_desc": "Agencia de IA especializada en automatización"
}
```

**Response (201):**
```json
{
  "success": true,
  "bookingId": "550e8400-e29b-41d4-a716-446655440000",
  "calUrl": "https://demo-mesa-inteligente-9icuas.cal.com/victor-ia",
  "message": "Booking created successfully. Check your email for confirmation."
}
```

**Validación (Zod):**
- nombre: string, 2-100 chars
- apellido: string, 2-100 chars
- email: valid email format
- telefono: regex /^[+\d\s\-()]{10,20}$/
- whatsapp: regex /^[+\d\s\-()]{10,20}$/
- sitio_web: valid URL (opcional)
- num_empleados: integer 1-100000 (opcional)
- empresa_desc: string 0-500 chars (opcional)

**Rate Limiting:**
- 3 requests por IP por hora
- Response 429 si se excede

---

### ✅ GET `/api/bookings/:id`
**Ruta:** `C:\Users\inbou\victor-ia-app\app\api\bookings\[id]\route.ts`

Obtiene detalles del booking y genera archivo ICS (RFC 5545 compatible).

**Response (200):**
```json
{
  "success": true,
  "booking_details": {...},
  "ics_content": "BEGIN:VCALENDAR...",
  "video_url": "https://demo-mesa-inteligente-9icuas.cal.com/victor-ia"
}
```

---

### ✅ POST `/api/email/send-booking-confirmation`
**Ruta:** `C:\Users\inbou\victor-ia-app\app\api\email\send-booking-confirmation\route.ts`

Envía emails de confirmación (admin + usuario) con ICS adjunto.

**Emails:**
1. Admin: Nuevo Lead + dashboard link
2. User: Confirmación + detalles + ICS adjunto

---

### ✅ POST `/api/reminders/schedule`
**Ruta:** `C:\Users\inbou\victor-ia-app\app\api\reminders\schedule\route.ts`

Cron job que envía recordatorios 24h antes de reuniones.

---

## 2. Variables .env Requeridas

```bash
CAL_COM_API_KEY=cal_live_bbbfcfc2949ce9e845b82ec8df1be29b
CAL_COM_NAMESPACE=demo-mesa-inteligente-9icuas
CAL_COM_EVENT=victor-ia
RESEND_API_KEY=re_xxxxx
ADMIN_EMAIL=mesainteligentedemo@gmail.com
CRON_SECRET=your_cron_secret_here
```

---

## 3. Migraciones Supabase (SQL)

Ejecutar en Supabase SQL Editor:

**Tabla: bookings**
```sql
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  telefono TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  sitio_web TEXT,
  num_empleados INTEGER,
  empresa_desc TEXT,
  booking_cal_id TEXT,
  status TEXT DEFAULT 'confirmed',
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bookings_email ON public.bookings(email);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_reminder_sent ON public.bookings(reminder_sent);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
```

**Tabla: booking_emails**
```sql
CREATE TABLE IF NOT EXISTS public.booking_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  email_to TEXT NOT NULL,
  email_type TEXT NOT NULL,
  status TEXT DEFAULT 'sent',
  resend_message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_booking_emails_booking_id ON public.booking_emails(booking_id);
ALTER TABLE public.booking_emails ENABLE ROW LEVEL SECURITY;
```

**Tabla: reminders_sent**
```sql
CREATE TABLE IF NOT EXISTS public.reminders_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent',
  resend_message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reminders_sent_booking_id ON public.reminders_sent(booking_id);
ALTER TABLE public.reminders_sent ENABLE ROW LEVEL SECURITY;
```

---

## 4. Vercel Cron (vercel.json)

```json
{
  "crons": [
    {
      "path": "/api/reminders/schedule",
      "schedule": "0 * * * *"
    }
  ]
}
```

---

## 5. Checklist Deploying

- [ ] Variables .env configuradas
- [ ] Migraciones SQL ejecutadas en Supabase
- [ ] Vercel Cron configurado en vercel.json
- [ ] Resend domain verificado
- [ ] Cal.com API key activa
- [ ] Tests locales pasando
