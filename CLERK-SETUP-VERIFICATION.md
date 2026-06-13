# 🔐 Clerk Auth Setup — Verificación & Troubleshooting

**Date:** 2026-06-13  
**App:** https://victor-ia-app.vercel.app  
**Expected Behavior:** Click "Iniciar Sesión" → See Clerk sign-in/sign-up modal

---

## ⚠️ PROBLEMA ACTUAL

App no responde en producción → **Necesita environment variables**

### Causa:
El deployment en Vercel requiere TODAS estas variables para funcionar:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY  (publico - necesario para Clerk)
CLERK_SECRET_KEY                   (privado - backend auth)
NEXT_PUBLIC_SUPABASE_URL           (publico - DB)
NEXT_PUBLIC_SUPABASE_ANON_KEY      (publico con RLS - client DB)
SUPABASE_SERVICE_ROLE_KEY          (privado - admin DB)
ANTHROPIC_API_KEY                  (privado - Claude API)
ELEVENLABS_API_KEY                 (privado - Voice synthesis)
STRIPE_SECRET_KEY                  (privado - payments)
STRIPE_WEBHOOK_SECRET              (privado - webhook verification)
ADMIN_TOKENS                        (privado - webhook admin auth)
```

Sin estas, la app crashea durante build o startup.

---

## ✅ SOLUCIÓN: Agregar Env Vars en Vercel

### PASO 1: Ir a Vercel Dashboard
```
https://vercel.com/mesainteligentedemo-cell/victor-ia-app/settings/environment-variables
```

### PASO 2: Agregar TODAS estas variables

#### **Variables PÚBLICAS (NEXT_PUBLIC_)** — Safe to expose
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_[tu_clerk_key]
  → Obtén de: https://dashboard.clerk.com → Settings → API Keys

NEXT_PUBLIC_SUPABASE_URL = https://[project].supabase.co
  → Obtén de: https://app.supabase.com → Settings → API → Project URL

NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci... (la clave larga)
  → Obtén de: https://app.supabase.com → Settings → API → anon key
  ⚠️ Safe si RLS (Row Level Security) está habilitado en Supabase
```

#### **Variables PRIVADAS** — Keep secret
```
CLERK_SECRET_KEY = sk_test_[tu_secret]
  → Obtén de: https://dashboard.clerk.com → Settings → API Keys

SUPABASE_SERVICE_ROLE_KEY = eyJhbGci... (la clave admin)
  → Obtén de: https://app.supabase.com → Settings → API → service_role key
  ⚠️ CRÍTICO: Nunca exponerla. Solo en servidor.

ANTHROPIC_API_KEY = sk-ant-[tu_key]
  → Obtén de: https://console.anthropic.com → API Keys

ELEVENLABS_API_KEY = sk_[tu_key]
  → Obtén de: https://elevenlabs.io → Profile → API Key

STRIPE_SECRET_KEY = sk_test_[tu_key] or sk_live_[tu_key]
  → Obtén de: https://dashboard.stripe.com → Developers → API Keys

STRIPE_WEBHOOK_SECRET = whsec_[tu_secret]
  → Obtén de: https://dashboard.stripe.com → Developers → Webhooks → Click webhook → Signing secret

ADMIN_TOKENS = uuid-token-1,uuid-token-2
  → Genera: Puedes usar cualquier string o UUID. Ej:
     550e8400-e29b-41d4-a716-446655440000,660f9500-f40c-52e5-b827-557766551111
```

### PASO 3: Vercel UI Steps
1. Click **"Add New"** button
2. **Name:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
3. **Value:** `pk_test_...` (tu clave real de Clerk)
4. **Environment:** Select **Production** ✅
5. Click **"Save"**
6. Repeat para todas las variables

**IMPORTANTE:** Todas deben estar en **Production** environment para que funcionen.

### PASO 4: Redeploy
Después de agregar TODAS:
1. Click en **"Deployments"** tab
2. Encuentra el deployment actual (commit 9f35103)
3. Click en el icono de 3 puntos → **"Redeploy"**
4. Espera ~3-5 minutos a que compile

---

## ✅ VERIFICACIÓN: ¿Funcionó?

Una vez que Vercel redeployó:

### Test 1: App carga
```
https://victor-ia-app.vercel.app
→ Debería cargar sin errores
```

### Test 2: Clerk modal aparece
```
Click en cualquier botón de "Iniciar Sesión" o "Sign In"
→ Debería aparecer modal de Clerk con opciones de login
```

### Test 3: Puedes registrarte
```
Sign Up → Enter email/password o usar OAuth
→ Debería crear account en Clerk
```

### Test 4: Redirige a dashboard
```
After login → Debería redirigir a /dashboard
→ Debería mostrar la app principal
```

---

## 🔍 TROUBLESHOOTING

### ❌ App sigue sin responder después de redeploy
1. **Check Vercel logs:**
   - Vercel Dashboard → Deployments → Click deployment → View Logs
   - Busca por "error" o "ENOTFOUND"
   
2. **Common errors:**
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing` → Add the variable
   - `Cannot find module '@supabase/supabase-js'` → Dependencies problem (shouldn't happen)
   - `ECONNREFUSED` → Supabase not accessible (check URL)

3. **Solution:**
   - Verify TODAS las variables están en Vercel
   - Verify están en **Production** environment
   - Click "Redeploy" nuevamente
   - Wait 3-5 min

### ❌ Clerk modal no aparece
1. Check browser console (F12 → Console)
2. Look for Clerk-related errors
3. Verify: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` está configurado
4. Clear cache: Ctrl+Shift+R en navegador

### ❌ Login funciona pero dashboard no carga
1. Check Supabase keys are correct
2. Verify RLS is enabled in Supabase
3. Check Vercel logs for Supabase connection errors
4. Verify `NEXT_PUBLIC_SUPABASE_URL` ends with `.supabase.co`

---

## 📊 CLERK ARCHITECTURE

```
┌─────────────┐
│   Browser   │
│  (Client)   │
└──────┬──────┘
       │ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
       ↓
┌─────────────────────────┐
│  Clerk Sign-In Modal    │
│  (OAuth + Email/Pass)   │
└──────┬──────────────────┘
       │ JWT Token (secure)
       ↓
┌─────────────────────────┐
│  Next.js API Routes     │
│  (/api/chat, etc)       │
└──────┬──────────────────┘
       │ CLERK_SECRET_KEY (verify JWT)
       ↓
┌─────────────────────────┐
│  Clerk Backend          │
│  (Verify token)         │
└─────────────────────────┘
```

**Flow:**
1. User clicks "Sign In"
2. Clerk modal pops (uses NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
3. User enters credentials
4. Clerk API authenticates
5. Returns JWT token
6. Frontend stores JWT
7. API calls include JWT
8. Backend verifies JWT (uses CLERK_SECRET_KEY)
9. User is authenticated ✅

---

## ✅ CHECKLIST FINAL

- [ ] Vercel Dashboard abierto
- [ ] TODAS las 10 variables agregadas
- [ ] TODAS están en "Production" environment
- [ ] Redeploy triggered
- [ ] App loaded (no errors)
- [ ] Clerk modal aparece
- [ ] Puedo hacer sign-up/sign-in
- [ ] Dashboard carga después del login
- [ ] No hay errores en browser console

Si TODO ✅ → **App está LIVE y SEGURA con Clerk auth funcionando**

---

## 📞 NEXT STEPS

Once app is live:
1. Run automated tests: `.\scripts\test-production.ps1`
2. Monitor Vercel logs for any errors
3. Check Clerk dashboard for new signups
4. Verify Supabase data is being saved

**Reference:** VERCEL-DEPLOYMENT-VERIFICATION.md (complete checklist)
