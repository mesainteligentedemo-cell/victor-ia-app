# 🚀 Instrucciones de Deployment - Victor IA App

## Paso 1: Preparación Local

### 1.1 Copiar variables de entorno
```bash
cp .env.example .env.local
```
Luego editar `.env.local` con tus claves reales.

### 1.2 Instalar dependencias
```bash
npm install
```

### 1.3 Prueba local
```bash
npm run dev
```
Verificar que la app funciona en `http://localhost:3000`

### 1.4 Build test
```bash
npm run build
```
Verificar que no hay errores en el build.

---

## Paso 2: Configurar Servicios Externos

### 2.1 Clerk (Autenticación)
1. Crear cuenta en https://clerk.com
2. Create new application
3. Copiar:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Ir a Webhooks → Create endpoint
   - URL: `https://tu-app.vercel.app/api/webhooks/clerk`
   - Events: `user.created`, `user.deleted`
   - Copiar `CLERK_WEBHOOK_SECRET`

### 2.2 Supabase (Database)
1. Crear proyecto en https://supabase.com
2. Copiar:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (from Service Role Key)
3. Ir a SQL Editor
4. Pegar contenido de `supabase/schema.sql`
5. Click "Run"

### 2.3 Stripe (Pagos)
1. Crear cuenta en https://stripe.com
2. Copiar:
   - `STRIPE_SECRET_KEY` (from Settings → API Keys)
   - `STRIPE_PUBLISHABLE_KEY`
3. Crear 2 productos con precios:
   - Starter: $150/mes
   - Pro: $500/mes
4. Copiar los Price IDs:
   - `STRIPE_STARTER_PRICE_ID`
   - `STRIPE_PRO_PRICE_ID`
5. Ir a Webhooks → Add endpoint
   - URL: `https://tu-app.vercel.app/api/webhooks/stripe`
   - Events: `customer.subscription.*`, `invoice.payment.*`
   - Copiar `STRIPE_WEBHOOK_SECRET`

### 2.4 Anthropic (Claude API)
1. Crear cuenta en https://console.anthropic.com
2. Ir a Settings → API Keys
3. Crear nueva key
4. Copiar `ANTHROPIC_API_KEY`

### 2.5 ElevenLabs (Voice)
1. Crear cuenta en https://elevenlabs.io
2. Ir a Profile → API Key
3. Copiar `ELEVENLABS_API_KEY`
4. Copiar Voice ID (default: `iDEmt5MnqUotdwCIVplo`)

### 2.6 Higgsfield (Image/Video)
1. Crear cuenta en https://higgsfield.ai
2. Ir a API Keys
3. Copiar `HIGGSFIELD_API_KEY`

---

## Paso 3: Deploy a Vercel

### 3.1 Git Setup
```bash
git init
git add .
git commit -m "Initial commit: Victor IA App production ready"
git remote add origin https://github.com/tu-usuario/victor-ia-app
git push -u origin main
```

### 3.2 Vercel Deploy
1. Ir a https://vercel.com
2. Click "New Project"
3. Seleccionar repositorio de GitHub
4. Click "Import"
5. En "Environment Variables" agregar todas las variables de `.env.local`
6. Click "Deploy"

### 3.3 Post-Deploy Webhook URLs
Una vez desplegado, Vercel mostrará la URL:
Ejemplo: `https://victor-ia-app.vercel.app`

Actualizar webhooks:
- Clerk: `https://victor-ia-app.vercel.app/api/webhooks/clerk`
- Stripe: `https://victor-ia-app.vercel.app/api/webhooks/stripe`

---

## Paso 4: Verificación Post-Deploy

### 4.1 Verificar autenticación
- Ir a `/sign-in`
- Crear cuenta nueva
- Verificar que se crea usuario en Supabase

### 4.2 Verificar chat
- Ir a `/dashboard/chat`
- Enviar mensaje
- Verificar respuesta de Claude

### 4.3 Verificar pagos
- Ir a `/dashboard/billing`
- Seleccionar plan Pro
- Usar Stripe test card: `4242 4242 4242 4242`
- Verificar que se actualiza plan en Supabase

### 4.4 Verificar voice
- En chat, click micrófono
- Hablar
- Verificar transcripción

### 4.5 Verificar logs
```bash
vercel logs [project-name]
```

---

## 🆘 Troubleshooting

### Error: "Failed to sign in"
- Verificar CLERK_SECRET_KEY es correcto
- Verificar webhook secret en Clerk matches

### Error: "Database connection failed"
- Verificar SUPABASE_SERVICE_ROLE_KEY
- Verificar schema.sql fue ejecutado
- Verificar RLS policies están activas

### Error: "Payment failed"
- Verificar STRIPE_SECRET_KEY
- Verificar Price IDs son correctos
- Verificar webhook secret matches

### Error: "Claude API error"
- Verificar ANTHROPIC_API_KEY es válido
- Verificar rate limits
- Revisar console logs en Vercel

---

## 📊 Monitoreo en Producción

### Logs
```bash
vercel logs [project-name] --tail
```

### Analytics
- Vercel Dashboard → Analytics
- Stripe Dashboard → Reports
- Supabase Dashboard → Monitoring

### Alerts
Configurar alertas en Vercel:
- Build failures
- Function errors
- High latency

---

## 🔐 Seguridad Post-Deploy

- [ ] Verificar que todas las env vars están ocultas
- [ ] Verificar CORS está correctamente configurado
- [ ] Verificar Rate Limiting activo
- [ ] Verificar RLS policies en Supabase
- [ ] Verificar webhook signatures verified
- [ ] Revisar logs para errores de seguridad

---

## ✅ Checklist Final

- [ ] Todos los servicios externos configurados
- [ ] Environment variables en Vercel
- [ ] Build local exitoso
- [ ] Deployed a Vercel
- [ ] Webhooks URLs actualizadas
- [ ] Autenticación funcionando
- [ ] Chat funcionando
- [ ] Pagos funcionando
- [ ] Voice funcionando
- [ ] Logs monitoreando correctamente

---

**Si todo está ✅, tu app está LISTA PARA PRODUCCIÓN!**

Para más info, revisar:
- SETUP.md
- STATUS.md
- IMPLEMENTATION-CHECKLIST.md

