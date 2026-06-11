# Victor IA SaaS - Deployment Checklist

## ⏱️ Timeline: 30 minutos para LIVE

### FASE 1: VERCEL DEPLOYMENT (5 minutos)

```bash
# En tu terminal, en la carpeta del proyecto:
vercel
# Seleccionar: Create new project
# Seleccionar: victor-ia-app (o tu nombre)
# Framework: Next.js ✓
# Root directory: ./ ✓
# Build command: npm run build ✓
```

**Resultado:** Tu app está en `https://victor-ia-app.vercel.app`

---

### FASE 2: CONFIGURAR ENV VARIABLES EN VERCEL (10 minutos)

Ve a: https://vercel.com/dashboard

1. Selecciona tu proyecto: **victor-ia-app**
2. Ir a: **Settings → Environment Variables**
3. Agregar CADA una de estas variables (copiar de tu `.env.local`):

#### CLERK (Authentication)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_...
CLERK_SECRET_KEY = sk_live_...
```
👉 Obtener en: https://dashboard.clerk.com → API Keys

#### SUPABASE (Database)
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
```
👉 Obtener en: https://app.supabase.com → Project Settings → API

#### STRIPE (Payments)
```
STRIPE_SECRET_KEY = sk_live_...
STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_WEBHOOK_SECRET = whsec_...
STRIPE_STARTER_PRICE_ID = price_...
STRIPE_PRO_PRICE_ID = price_...
STRIPE_ENTERPRISE_PRICE_ID = price_...
```
👉 Obtener en: https://dashboard.stripe.com → API Keys & Webhooks

#### APP URL
```
NEXT_PUBLIC_APP_URL = https://victor-ia-app.vercel.app
```

**Después de agregar todas, Vercel redeploy automático ✅**

---

### FASE 3: CONFIGURAR DOMINIO PERSONALIZADO (5 minutos)

En Vercel → Settings → Domains

```
1. Agregar dominio: tu-dominio.com
2. Vercel te dará DNS records
3. Ir a tu registrador (GoDaddy, Namecheap, etc)
4. Pegar los registros DNS
5. Esperar 5-10 minutos
```

**Resultado:** Tu app en `https://tu-dominio.com`

---

### FASE 4: STRIPE WEBHOOK (5 minutos)

En Vercel, copiar tu URL: `https://victor-ia-app.vercel.app` (o tu dominio)

En Stripe Dashboard:
1. Ir a: **Developers → Webhooks**
2. Click: **Add endpoint**
3. URL: `https://victor-ia-app.vercel.app/api/stripe/webhook`
4. Events: Seleccionar:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy: Webhook secret → Agregar a `STRIPE_WEBHOOK_SECRET` en Vercel

---

### FASE 5: CLERK REDIRECT URLS (5 minutos)

En Clerk Dashboard:
1. Ir a: **Configure → Paths**
2. Redirect after sign in: `https://victor-ia-app.vercel.app/dashboard`
3. Redirect after sign up: `https://victor-ia-app.vercel.app/dashboard`
4. Authorized origins: 
   - `https://victor-ia-app.vercel.app`
   - `https://tu-dominio.com`

---

### ✅ VERIFICACIÓN FINAL

- [ ] Vercel muestra "Production" (no "Failed")
- [ ] Puedes navegar a `https://victor-ia-app.vercel.app`
- [ ] Landing page carga sin errores
- [ ] Botón "Get Started" funciona
- [ ] Clerk login/signup funciona
- [ ] Dashboard carga después de login
- [ ] /pricing page muestra planes
- [ ] Botones "Get Started" en planes redirigen a checkout

---

### 🎯 PROXIMOS PASOS (VENTAS)

**Una vez LIVE:**

1. **Email Outreach** (30 minutos)
   - Enviar a 20-50 contactos relevantes
   - Subject: "I built a SaaS for your team - want to try it?"
   - Link: tu-dominio.com
   - Offer: "Free for first month"

2. **Communities** (30 minutos)
   - HackerNews: Show HN post
   - Indiehackers: Share your journey
   - LinkedIn: Post sobre el launch
   - Reddit: r/SaaS, r/Entrepreneur

3. **Track Results** (ongoing)
   - Google Analytics (opcional)
   - Check Stripe dashboard para pagos
   - Responder rápido a inquiries

---

## 🆘 TROUBLESHOOTING

**"Vercel build failed"**
→ Check logs: `vercel logs`
→ Verify .env vars están en Vercel

**"Clerk login no funciona"**
→ Check NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
→ Verify origin URLs en Clerk

**"Stripe webhook no recibe eventos"**
→ Check webhook secret
→ Verify URL es accessible desde internet
→ Test con Stripe CLI

**"Database connection error"**
→ Verify SUPABASE_URL y ANON_KEY
→ Check Supabase está activo

---

## 📞 SUPPORT LINKS

- Vercel: https://vercel.com/docs
- Clerk: https://clerk.com/docs
- Supabase: https://supabase.com/docs
- Stripe: https://stripe.com/docs