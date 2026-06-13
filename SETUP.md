# Victor IA App — Guía de Setup

## 🚀 Instalación Rápida

### 1. Prerequisites
- Node.js 18+ 
- npm o yarn
- Git

### 2. Clonar y Setup
```bash
cd C:\Users\inbou\victor-ia-app
npm install
```

### 3. Environment Variables
Crear archivo `.env.local` en la raíz:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Anthropic (Claude API)
ANTHROPIC_API_KEY=sk_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxx...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ElevenLabs
ELEVENLABS_API_KEY=sk_87d5...
ELEVENLABS_VOICE_ID=iDEmt5MnqUotdwCIVplo

# Higgsfield (Image/Video Generation)
HIGGSFIELD_API_KEY=hf_...
```

### 4. Base de Datos

Ejecutar schema en Supabase SQL Editor:
```sql
-- Copy content from supabase/schema.sql
```

### 5. Ejecutar Local
```bash
npm run dev
```

## 📦 Deployment a Vercel

1. Conectar repositorio a Vercel
2. Agregar environment variables
3. Deploy

## 🔑 API Endpoints

- POST `/api/chat` — Chat con Claude
- POST `/api/generate/advanced` — Generar contenido
- POST `/api/analytics/events` — Rastrear eventos
- POST `/api/stripe/checkout` — Crear sesión de pago
- GET/POST `/api/crm/clients` — Gestionar clientes
- GET/POST `/api/projects` — Gestionar proyectos
- GET/POST `/api/library/assets` — Gestionar assets
- POST `/api/voice/generate` — Generar voz

## ✅ Features Implementados

✅ Chat con Claude API
✅ Voice input
✅ Content Generators
✅ Analytics tracking
✅ Stripe payments
✅ CRM
✅ Projects
✅ Asset Library
✅ Dark mode
✅ Responsive design

---

**Victor IA App** · Next.js 14 + Stripe + Supabase
