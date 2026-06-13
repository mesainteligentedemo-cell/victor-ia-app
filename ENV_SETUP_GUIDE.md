# 🔐 Victor IA App — Guía de Setup de Variables de Entorno

## ⚡ Quick Start (5 minutos)

### 1️⃣ Copiar Template
```bash
cp .env.example .env.local
```

### 2️⃣ Obtener Keys
Abre estos dashboards en pestañas diferentes y copia los valores:

| Plataforma | Link | Variables |
|---|---|---|
| **Clerk** (Auth) | https://dashboard.clerk.com → Settings → API Keys | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`<br/>`CLERK_SECRET_KEY`<br/>`CLERK_WEBHOOK_SECRET` |
| **Stripe** (Pagos) | https://dashboard.stripe.com → Developers → API Keys | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`<br/>`STRIPE_SECRET_KEY`<br/>`STRIPE_WEBHOOK_SECRET` |
| **Supabase** (BD) | https://app.supabase.com → Settings → API | `NEXT_PUBLIC_SUPABASE_URL`<br/>`NEXT_PUBLIC_SUPABASE_ANON_KEY`<br/>`SUPABASE_SERVICE_ROLE_KEY`<br/>`DATABASE_URL` |
| **Anthropic** (IA) | https://console.anthropic.com → API Keys | `ANTHROPIC_API_KEY` |
| **OpenRouter** (IA Multi) | https://openrouter.ai → API Keys | `OPENROUTER_API_KEY` |
| **ElevenLabs** (Voz) | https://elevenlabs.io | `ELEVENLABS_API_KEY`<br/>`ELEVENLABS_AGENT_ID`<br/>`NEXT_PUBLIC_ELEVENLABS_AGENT_ID` |

### 3️⃣ Generar Secretos
Abre PowerShell / Terminal y corre:

```bash
# Generar JWT_SECRET (copia el output)
openssl rand -base64 32

# Generar ENCRYPTION_KEY (copia primeros 24 chars)
openssl rand -base64 32
```

Luego pega estos valores en `.env.local`.

### 4️⃣ Validar
```bash
npm run validate-env
```

Si todo está ✅ OK, ¡ya está listo!

---

## 📋 Estructura de Variables

### ✅ PÚBLICAS (seguro en cliente)
Se envían al navegador. No contienen credenciales.

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_...
```

### 🔒 PRIVADAS (solo servidor)
**NUNCA** exponerlas. Si se filtran, los atacantes acceden a tu cuenta.

```env
CLERK_SECRET_KEY=sk_test_...
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_test_...
ELEVENLABS_API_KEY=sk_...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://...
```

### 🔑 GENERADAS (generar localmente)
Estas **tú las generas**. No las obtienes de ningún dashboard.

```env
JWT_SECRET=... (openssl rand -base64 32)
ENCRYPTION_KEY=... (openssl rand -base64 32)
```

---

## 🎯 Decisión: Test vs Live Keys

### En Desarrollo (LOCAL)
Usa **test keys** — no cargan dinero real:
- Clerk: `pk_test_...` / `sk_test_...`
- Stripe: `pk_test_...` / `sk_test_...`

### En Producción (VERCEL)
Usa **live keys** en Vercel Secrets — cargan dinero real:
- Clerk: `pk_live_...` / `sk_live_...`
- Stripe: `pk_live_...` / `sk_live_...`

**Regla:** Nunca usar live keys en `.env.local`

---

## ⚠️ Errores Comunes

### ❌ Error: "CLERK_SECRET_KEY no encontrada"
**Solución:**
1. Abre `.env.local` (no `.env.example`)
2. Verifica que tiene la variable (no `#CLERK_SECRET_KEY`)
3. Si falta: `cp .env.example .env.local` y recargar valores

### ❌ Error: "SUPABASE_ANON_KEY inválida"
**Solución:**
1. En https://app.supabase.com, copia **anon public key** (no service role)
2. Si no funciona: regenerar en Settings → API → Regenerate key
3. Esperar 1 minuto a que se propague

### ❌ Error: "JWT_SECRET es muy corta"
**Solución:**
1. Abre PowerShell
2. Corre: `openssl rand -base64 32`
3. Copia COMPLETO en `.env.local`
4. No acortes el valor

### ❌ Error: ".env.local fue commiteado a Git"
**Solución:**
1. Corre: `git rm --cached .env.local`
2. Agrega a `.gitignore`: `.env.local`
3. Haz commit: `git commit -m "Remove .env.local"`
4. **REVOCA TODAS LAS KEYS** en cada dashboard (se filtraron)
5. Generar nuevas keys

---

## 🧪 Verificar que Funciona

### Test 1: Clerk Conectado
```bash
# En terminal: curl http://localhost:3000/api/auth/check
# Deberías ver: { "authenticated": false }
```

### Test 2: Supabase Conectado
```bash
# En un componente:
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const { data } = await supabase.from('users').select('count()')
console.log(data) // debe devolver una tabla
```

### Test 3: OpenRouter/Anthropic Conectado
```bash
# En /api/test-ai.ts:
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-4-turbo',
    messages: [{ role: 'user', content: 'Test' }]
  })
})
console.log(await response.json()) // debe devolver respuesta
```

---

## 🔄 Si Una Key Se Filtra

**ACCIÓN INMEDIATA:**

1. Abre el dashboard de la plataforma afectada
2. Encuentra la key y haz clic en **Revoke** (no se puede deshacer)
3. Genera una **nueva key**
4. Actualiza `.env.local` con la nueva
5. Si ya hiciste push: los atacantes pueden acceder hasta que revoques

**Ejemplo: si se filtra STRIPE_SECRET_KEY**
1. https://dashboard.stripe.com → Developers → API Keys
2. Busca la key: `sk_test_xxx...`
3. Haz clic en botón rojo de "Revoke"
4. Genera nueva key
5. Copia a `.env.local`
6. Nada más hace falta (Stripe ya no acepta la vieja)

---

## 📖 Documentación Completa

Para más detalles, abre [SECURITY.md](./SECURITY.md)

---

## 🚀 Próximos Pasos

- [ ] Copiar `.env.example` → `.env.local`
- [ ] Llenar todas las variables
- [ ] Correr `npm run validate-env`
- [ ] Verificar que compila: `npm run build`
- [ ] Iniciar dev: `npm run dev`
- [ ] En Vercel: agregar variables en Secrets Dashboard
- [ ] En Producción: usar live keys (no test)

---

**Última actualización:** 2026-06-13
