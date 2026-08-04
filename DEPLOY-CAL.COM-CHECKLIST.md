# 🚀 Checklist: Deploy Completo Cal.com Integration

**Fecha inicio:** 2026-08-03  
**Proyectos:** 3 (victor-ia-app, victor-ia-training, cube-gallery-deploy)  
**Estado:** En progreso

---

## ✅ PASO 1: Supabase Schema (BASE DE DATOS)

### Opción A: Script Python (Automático)
```bash
# En victor-ia-app/
export SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJxxx..."
python scripts/setup-supabase-bookings.py
```

### Opción B: Copiar + Pegar en Supabase UI (Manual)
1. Ir a: https://app.supabase.com → SQL Editor
2. Crear "New Query"
3. Copiar TODO el contenido de: `C:\Users\inbou\victor-ia-app\docs\supabase-schema-bookings.sql`
4. Pegar en SQL Editor
5. Hacer clic en botón **Play** (arriba a la derecha)
6. Verificar que NO haya errores (status "Success")

### Verificación Post-Schema
```sql
-- Ejecutar en SQL Editor para confirmar
\dt
\d bookings
SELECT COUNT(*) FROM bookings;
SELECT COUNT(*) FROM reminders_sent;
SELECT COUNT(*) FROM webhook_logs;
```

**Estado:** [ ] Completado

---

## ✅ PASO 2: Vercel Environment Variables (SECRETOS)

### Variables Requeridas (Obtener de Vercel Dashboard)

Ir a: https://vercel.com → victor-ia-app → Settings → Environment Variables

Agregar estas 3 variables (si no existen):

| Variable | Valor | Tipo | Entorno |
|---|---|---|---|
| `SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` | Privada | Production + Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | (obtener de https://app.supabase.com → Settings → API → service_role key) | Privada | Production + Preview |
| `RESEND_API_KEY` | (obtener de https://resend.com → API Keys) | Privada | Production + Preview |

### Variables que YA EXISTEN (Verificar)
- `NEXT_PUBLIC_CAL_COM_API_KEY=cal_live_bbbfcfc2949ce9e845b82ec8df1be29b` ✅
- `NEXT_PUBLIC_CAL_COM_NAMESPACE=demo-mesa-inteligente-9icuas` ✅
- `NEXT_PUBLIC_CAL_COM_EVENT=victor-ia` ✅

**Estado:** [ ] Completado

---

## ✅ PASO 3: .env.local Actualizados (Proyectos Locales)

### Proyecto 1: victor-ia-app
Archivo: `C:\Users\inbou\victor-ia-app\.env.local`
- ✅ Cal.com vars configuradas
- [ ] SUPABASE_URL debe actualizarse aquí también
- [ ] SUPABASE_SERVICE_ROLE_KEY debe actualizarse aquí también
- [ ] RESEND_API_KEY debe actualizarse aquí también

### Proyecto 2: victor-ia-training
Archivo: `C:\Users\inbou\victor-ia-training\.env.local`
- ✅ Cal.com vars configuradas
- [ ] SUPABASE_URL
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] RESEND_API_KEY

### Proyecto 3: cube-gallery-deploy
Archivo: `C:\Users\inbou\cube-gallery-deploy\.env.local`
- ✅ Cal.com vars configuradas
- [ ] RESEND_API_KEY

**Estado:** [ ] Completado

---

## ✅ PASO 4: Git Commits (3 Repositorios)

### Proyecto 1: victor-ia-app
```bash
cd C:\Users\inbou\victor-ia-app
git status
git add .env.local scripts/setup-supabase-bookings.py docs/supabase-schema-bookings.sql DEPLOY-CAL.COM-CHECKLIST.md
git commit -m "feat: Add complete cal.com booking system - API endpoints, cron jobs, emails

- Schema Supabase: bookings, reminders_sent, webhook_logs
- POST /api/bookings/create — crear reserva
- GET /api/bookings/:id — obtener reserva
- POST /api/email/send-booking-confirmation — email confirmación
- POST /api/reminders/schedule — cron reminders automáticos
- Reminders: 1 día + 1 hora antes
- ICS generation para todos los dispositivos
- Integración completa con cal.com
- Emails automáticos a info@victor-ia.com.mx y mesainteligentedemo@gmail.com"
git push origin main
```

### Proyecto 2: victor-ia-training
```bash
cd C:\Users\inbou\victor-ia-training
git status
git add .env.local
git commit -m "feat: Add complete cal.com booking system to training pages

- Form integrado en /training y /training/reentrenar
- Footer con cal.com booking widget
- Confirmaciones automáticas por email
- ICS calendar support para todos los dispositivos
- Reminders automáticos (1 día + 1 hora antes)"
git push origin main
```

### Proyecto 3: cube-gallery-deploy
```bash
cd C:\Users\inbou\cube-gallery-deploy
git status
git add .env.local
git commit -m "feat: Add complete cal.com booking system - footer integration

- Enhanced form con 8 campos (nombre, teléfono, WhatsApp, email, etc)
- Personalizado interface de cal.com
- Responsive design mobile/desktop
- Ready para producción"
git push origin master
```

**Estado:** [ ] Completado

---

## ✅ PASO 5: Vercel Deployments (ESPERAR)

Después de push, Vercel desplegará automáticamente.

| Proyecto | URL Vercel | URL Custom | Status |
|---|---|---|---|
| victor-ia-app | victor-ia-app.vercel.app | (backend API) | [ ] Deploy OK |
| victor-ia-training | victor-ia-training.vercel.app | www.victor-ia.com.mx/training | [ ] Deploy OK |
| cube-gallery-deploy | cube-gallery-deploy.vercel.app | www.victor-ia.com.mx | [ ] Deploy OK |

Tiempo estimado: 2-3 minutos

**Estado:** [ ] Completado

---

## ✅ PASO 6: Testing en Producción

### Test 1: Footer Booking Form
```
URL: https://www.victor-ia.com.mx (o cube-gallery-deploy.vercel.app)
1. Scroll hasta footer
2. Llenar form (nombre, email, teléfono, etc.)
3. Hacer clic "Agendar Llamada"
4. ✅ Debe redirigir a cal.com
5. ✅ Email de confirmación debe llegar a mesainteligentedemo@gmail.com
```

### Test 2: Training Pages
```
URL: https://www.victor-ia.com.mx/training
1. Footer visible en página de training
2. Form de cal.com funciona
3. ✅ Agendar llamada exitosa
```

### Test 3: API Endpoints (si tienes Postman)
```bash
# Test POST /api/bookings/create
curl -X POST https://victor-ia-app.vercel.app/api/bookings/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "nombre": "Test",
    "booking_datetime": "2026-08-10T14:00:00Z",
    "timezone": "America/Mexico_City"
  }'
```

**Estado:** [ ] Completado

---

## 📋 NOTAS IMPORTANTES

1. **Credenciales:**
   - Supabase URL y keys deben estar en Vercel ENV VARS
   - RESEND_API_KEY debe estar en Vercel ENV VARS
   - .env.local locales son solo para desarrollo

2. **RLS (Row Level Security):**
   - Está habilitado en el SQL
   - Verificar en Supabase: Settings → Authentication → Policies

3. **Webhooks Cal.com:**
   - Configurar en https://app.cal.com → Settings → Webhooks
   - Endpoint: `https://victor-ia-app.vercel.app/api/webhooks/cal-com`
   - Eventos: `booking.created`, `booking.cancelled`

4. **Cron Jobs:**
   - Reminders se envían automáticamente cada hora
   - Configuración: `/api/cron/reminders` (trigger cada 1 hora)

---

## ✅ SEÑAL DE ÉXITO

Cuando TODO esté hecho:
- ✅ 3 proyectos deployados en Vercel
- ✅ Supabase schema creado (3 tablas + índices)
- ✅ Cal.com integrado en footer de 3 sitios
- ✅ Emails automáticos funcionando
- ✅ Reminders automáticos cada 1 día + 1 hora antes
- ✅ Zero 404 errors
- ✅ Conversión de visitante → booking en todos los 3 sitios

---

**Próximas fases:**
- [ ] Analytics integration (trackear conversiones)
- [ ] A/B testing de formularios
- [ ] SMS reminders (opcional)
- [ ] Integraciones adicionales (HubSpot CRM, etc.)