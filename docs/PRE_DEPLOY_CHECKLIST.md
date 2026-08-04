# PRE-DEPLOY CHECKLIST — CAL.COM INTEGRATION

## Antes de deployar a producción, completar este checklist 100%.

---

## 1. VARIABLES DE ENTORNO (.env.local)

- [ ] `.env.local` EXISTE y está en `.gitignore`
  ```bash
  grep -i "\.env" .gitignore
  # Debe mostrar: .env.local, .env.*.local, .env.production
  ```

- [ ] `NEXT_PUBLIC_CAL_COM_API_KEY` = valor real (comienza con `cal_live_`)
  ```bash
  echo $NEXT_PUBLIC_CAL_COM_API_KEY
  # Debería mostrar: cal_live_bbbfcfc2949ce9e845b82ec8df1be29b
  ```

- [ ] `NEXT_PUBLIC_CAL_COM_NAMESPACE` = nombre real del namespace
  ```bash
  # Debería ser: demo-mesa-inteligente-9icuas
  ```

- [ ] `NEXT_PUBLIC_CAL_COM_EVENT` = nombre real del event type
  ```bash
  # Debería ser: victor-ia
  ```

- [ ] `CAL_COM_WEBHOOK_SECRET` = valor generado con openssl
  ```bash
  # Debería tener 64+ caracteres (openssl rand -hex 32)
  ```

- [ ] `RESEND_API_KEY` = valor real (comienza con `re_`)
  ```bash
  # Verificar en: https://resend.com → API Keys
  ```

- [ ] `CRON_SECRET` = valor generado (32+ caracteres)
  ```bash
  # Generar si no existe: openssl rand -hex 32
  ```

- [ ] `ADMIN_EMAIL_PRIMARY` = email real
  ```bash
  # info@victor-ia.com.mx
  ```

- [ ] `ADMIN_EMAIL_SECONDARY` = email real
  ```bash
  # mesainteligentedemo@gmail.com
  ```

- [ ] `JWT_SECRET` = generado con openssl (si no existe)
  ```bash
  # openssl rand -base64 32
  ```

- [ ] `ENCRYPTION_KEY` = generado con openssl (si no existe)
  ```bash
  # openssl rand -base64 32 | head -c 24
  ```

**Verificación rápida:**
```bash
# Todos los valores deben estar presentes (no vacíos)
grep -E "NEXT_PUBLIC_CAL_COM|CAL_COM_WEBHOOK|RESEND_API|CRON_SECRET|ADMIN_EMAIL" .env.local | wc -l
# Debe mostrar: 8 líneas
```

---

## 2. SUPABASE — TABLAS Y SCHEMA

- [ ] Acceso a https://app.supabase.com con credenciales correctas

- [ ] Proyecto correcto seleccionado (verificar nombre en UI)

- [ ] Tablas `bookings` y `reminders_sent` EXISTEN
  ```sql
  -- Ejecutar en Supabase → SQL Editor
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public';
  -- Debe mostrar: bookings, reminders_sent, webhook_logs
  ```

- [ ] Estructura de `bookings` tabla es correcta
  ```sql
  \d bookings;
  -- Debe tener: id, email, nombre, apellido, booking_cal_id, booking_datetime, etc
  ```

- [ ] Índices creados
  ```sql
  SELECT indexname FROM pg_indexes WHERE tablename = 'bookings';
  -- Debe mostrar: idx_bookings_email, idx_bookings_datetime, etc
  ```

- [ ] Row Level Security (RLS) HABILITADO
  ```sql
  SELECT tablename, rowsecurity FROM pg_tables
  WHERE tablename IN ('bookings', 'reminders_sent');
  -- rowsecurity debe ser: TRUE para ambas
  ```

- [ ] Inserción de test funciona
  ```sql
  INSERT INTO bookings (
    email, nombre, booking_datetime, timezone, status
  ) VALUES (
    'test@ejemplo.com',
    'Test',
    NOW() + INTERVAL '7 days',
    'America/Mexico_City',
    'active'
  );
  -- Debe retornar: INSERT 0 1
  
  -- Limpiar después
  DELETE FROM bookings WHERE email = 'test@ejemplo.com';
  ```

---

## 3. CAL.COM — CONFIGURACIÓN

- [ ] Acceso a https://app.cal.com como admin

- [ ] Event Type "victor-ia" EXISTE y está habilitado
  ```
  Settings → Event Types → victor-ia
  Verificar: duración, availability, etc
  ```

- [ ] API Key generada y guardada
  ```
  Settings → Admin Settings → API Keys
  Copiar value → comparar con .env.local NEXT_PUBLIC_CAL_COM_API_KEY
  ```

- [ ] Webhook URL configurada en cal.com
  ```
  Settings → Integrations → Webhooks
  URL: https://victor-ia-app.vercel.app/api/webhooks/cal-com
  (En dev local: no es verificable, usar ngrok si quieres testar)
  Eventos: booking.created, booking.cancelled
  Signing Secret: copiar → CAL_COM_WEBHOOK_SECRET en .env.local
  ```

- [ ] Namespace obtenido correctamente
  ```
  Perfil → URL de tu página
  Ejemplo: https://cal.com/demo-mesa-inteligente-9icuas
  Namespace = demo-mesa-inteligente-9icuas
  ```

---

## 4. RESEND — EMAILS

- [ ] Acceso a https://resend.com con credenciales

- [ ] API Key generada
  ```
  API Keys → Crear nueva key
  Debe comenzar con: re_
  Guardar en .env.local: RESEND_API_KEY
  ```

- [ ] Domain verificado (si usas dominio custom)
  ```
  Domains → Verificar que victor-ia.com.mx está verificado
  ```

- [ ] Email de prueba enviado exitosamente
  ```bash
  # Usando curl (o API de Resend)
  curl -X POST "https://api.resend.com/emails" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer re_YOUR_KEY" \
    -d '{
      "from": "Victor IA <noreply@victor-ia.com.mx>",
      "to": "mesainteligentedemo@gmail.com",
      "subject": "Test Email",
      "html": "<p>Test email from Victor IA</p>"
    }'
  # Debe retornar: 200 OK + id de email
  ```

- [ ] Email de confirmación se envía correctamente (testing manual después)

---

## 5. ENDPOINTS API — FUNCIONAN CORRECTAMENTE

### A. Crear Booking
```bash
# En terminal, en raíz del proyecto
npm run dev
# Esperar a que compile

# En otra terminal
curl -X POST http://localhost:3000/api/bookings/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-deploy-check@ejemplo.com",
    "nombre": "Deploy",
    "apellido": "Check",
    "telefono": "+1 234 567 8900",
    "sitio_web": "https://test.com",
    "num_empleados": "5",
    "empresa_desc": "Deploy test",
    "booking_datetime": "2026-08-20T15:00:00Z",
    "timezone": "America/Mexico_City"
  }'

# Esperado: 200 OK
# {
#   "success": true,
#   "booking": { ... }
# }
```

- [ ] Endpoint retorna 200 OK
- [ ] `booking.id` está presente (UUID)
- [ ] `booking.booking_cal_id` está presente (sincronizó con cal.com)
- [ ] Email de confirmación enviado a `test-deploy-check@ejemplo.com`
- [ ] Email de notificación enviado a admin

### B. Listar Bookings
```bash
curl -X POST http://localhost:3000/api/bookings/list \
  -H "Content-Type: application/json"

# Esperado: 200 OK
# {
#   "bookings": [...]
# }
```

- [ ] Endpoint retorna 200 OK
- [ ] Lista incluye el booking de prueba

### C. Cancelar Booking (opcional)
```bash
curl -X POST http://localhost:3000/api/bookings/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": "UUID_DEL_BOOKING",
    "cron_secret": "TU_CRON_SECRET"
  }'

# Esperado: 200 OK
# {
#   "success": true
# }
```

- [ ] Endpoint retorna 200 OK
- [ ] Booking desaparece de lista (status = 'cancelled')
- [ ] Evento eliminado de cal.com

---

## 6. SUPABASE — VERIFICAR DATOS

```sql
-- Ejecutar en Supabase → SQL Editor

-- Ver booking creado
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 1;
-- Debe mostrar: 1 fila con test data

-- Ver que record tiene booking_cal_id (sincronizó)
SELECT email, booking_cal_id, status FROM bookings
WHERE email = 'test-deploy-check@ejemplo.com';
-- booking_cal_id debe tener valor (no NULL)

-- Ver reminders
SELECT * FROM reminders_sent ORDER BY sent_at DESC;
-- Debe estar vacío o mostrar reminders exitosos
```

- [ ] Booking aparece en tabla `bookings`
- [ ] `booking_cal_id` está completado (no NULL)
- [ ] `email` es correcto
- [ ] `booking_datetime` es correcto
- [ ] `status` es 'active'

---

## 7. VERCEL — CONFIGURACIÓN

- [ ] Proyecto "victor-ia-app" creado en https://vercel.com/dashboard

- [ ] Git conectado (GitHub integrado)

- [ ] Variables de entorno agregadas en Vercel
  ```
  Settings → Environment Variables
  Agregar cada una (copia-pega desde .env.local):
  - NEXT_PUBLIC_CAL_COM_API_KEY
  - NEXT_PUBLIC_CAL_COM_NAMESPACE
  - NEXT_PUBLIC_CAL_COM_EVENT
  - CAL_COM_WEBHOOK_SECRET
  - RESEND_API_KEY
  - CRON_SECRET
  - ADMIN_EMAIL_PRIMARY
  - ADMIN_EMAIL_SECONDARY
  - (y las existentes: Clerk, Stripe, Supabase, etc)
  ```

- [ ] `vercel.json` tiene configuración de crons
  ```json
  {
    "crons": [
      {
        "path": "/api/cron/reminders-1day",
        "schedule": "0 9 * * *"
      },
      {
        "path": "/api/cron/reminders-1hour",
        "schedule": "*/30 * * * *"
      }
    ]
  }
  ```

- [ ] Archivo `.env.local` NO está en Git
  ```bash
  git status
  # Debe mostrar: .env.local está en .gitignore (no aparece en modified)
  
  git log --all -- .env.local
  # Debe estar vacío (nunca fue commiteado)
  ```

---

## 8. SEGURIDAD — VERIFICAR SECRETS

- [ ] Ningún secret está hardcodeado en código
  ```bash
  grep -r "sk_test_\|sk_live_\|whsec_\|re_" app/ lib/ \
    --exclude-dir=node_modules --exclude-dir=.next
  # Debe estar vacío (no encontrar keys)
  ```

- [ ] `.gitignore` tiene línea `.env.local`
  ```bash
  cat .gitignore | grep "\.env"
  # Debe mostrar: .env.local, .env.*.local
  ```

- [ ] No hay commits recientes que agreguen .env.local
  ```bash
  git log --all --name-only | grep ".env.local"
  # Debe estar vacío
  ```

---

## 9. TESTING FINAL (ANTES DE DEPLOY)

### A. Build local
```bash
npm run build
# Debe compilar sin errores
# Verificar: No hay warnings tipo "secret leaked"
```

- [ ] Build completa sin errores
- [ ] No hay warnings en output

### B. Test de endpoints (prod build)
```bash
npm start
# Servidor corriendo en :3000

# Crear otro booking
curl -X POST http://localhost:3000/api/bookings/create \
  -H "Content-Type: application/json" \
  -d '{...}' # ver JSON arriba
```

- [ ] Endpoints funciona con build de producción
- [ ] Emails se envían correctamente

### C. Verificar Supabase y Resend
- [ ] Nueve booking aparece en tabla `bookings`
- [ ] Email de confirmación en inbox de usuario
- [ ] Email de notificación en admin emails

---

## 10. DEPLOY A VERCEL

### Opción A: Git Push (recomendado)
```bash
# Hacer push a main/master
git add .
git commit -m "feat: cal.com integration + reminders + crons"
git push origin main

# Vercel redeploy automático
# Esperar 2-5 minutos
```

- [ ] Push completado sin errores
- [ ] Vercel inicia deployment automático

### Opción B: Manual en Vercel UI
```
Vercel Dashboard → victor-ia-app
Deployments → Redeploy
Seleccionar main branch → Redeploy
```

- [ ] Deployment iniciado
- [ ] Esperar a que termine (estado "Ready")

### Post-Deploy

- [ ] Deployment muestra "Ready" en Vercel
- [ ] URL pública funciona: `https://victor-ia-app.vercel.app`
- [ ] Log de deployment sin errores
  ```bash
  vercel logs victor-ia-app --follow
  # Buscar: "Ready"
  ```

---

## 11. TESTING EN PRODUCCIÓN

### A. Crear booking en producción
```bash
curl -X POST https://victor-ia-app.vercel.app/api/bookings/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prod-test@ejemplo.com",
    "nombre": "Producción",
    "apellido": "Test",
    "telefono": "+1 234 567 8900",
    "sitio_web": "https://prod-test.com",
    "num_empleados": "5",
    "empresa_desc": "Production test",
    "booking_datetime": "2026-08-25T15:00:00Z",
    "timezone": "America/Mexico_City"
  }'

# Esperado: 200 OK
```

- [ ] Endpoint retorna 200 OK desde producción
- [ ] `booking_cal_id` está presente
- [ ] Email llega a usuario
- [ ] Email llega a admin

### B. Verificar en Supabase
```sql
SELECT * FROM bookings WHERE email = 'prod-test@ejemplo.com';
```

- [ ] Booking aparece en producción
- [ ] Datos correctos (sincronizado con cal.com)

### C. Verificar Cron Jobs en Vercel
```
Vercel Dashboard → Deployments → Funciones → Cron
```

- [ ] `reminders-1day` aparece (schedule: 0 9 * * *)
- [ ] `reminders-1hour` aparece (schedule: */30 * * * *)

---

## 12. LIMPIAR DATOS DE TEST

```bash
# En Supabase SQL Editor, eliminar test bookings
DELETE FROM bookings 
WHERE email IN (
  'test@ejemplo.com',
  'test-deploy-check@ejemplo.com',
  'prod-test@ejemplo.com'
);
```

- [ ] Datos de test eliminados de Supabase

---

## CHECKLIST FINAL

- [ ] 1. Variables .env ✅
- [ ] 2. Supabase schema ✅
- [ ] 3. Cal.com configurado ✅
- [ ] 4. Resend API funciona ✅
- [ ] 5. Endpoints API funcionan (local) ✅
- [ ] 6. Datos en Supabase ✅
- [ ] 7. Vercel configurado ✅
- [ ] 8. Seguridad verificada ✅
- [ ] 9. Testing local completo ✅
- [ ] 10. Deploy a Vercel ✅
- [ ] 11. Testing en producción ✅
- [ ] 12. Datos de test limpiados ✅

---

## ✅ LISTO PARA PRODUCCIÓN

Cuando TODO está marcado, tu integración cal.com está lista.

**Próximos pasos:**
1. Informar a usuarios que ya pueden reservar demos
2. Monitorear logs en Vercel: `vercel logs victor-ia-app`
3. Rotar secrets cada 90 días (seguridad)
4. Hacer backup de Supabase mensualmente
