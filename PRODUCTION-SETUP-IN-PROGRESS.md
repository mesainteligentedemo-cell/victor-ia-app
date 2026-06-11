# 🚀 Production Setup — EN PROGRESO

## Status
- ⏳ Workflow generando 6 subsistemas en paralelo
- 🔐 Clerk Auth
- 🗄️ Supabase DB
- 🖼️ Vercel Blob Storage
- 🎬 Replicate (Video)
- 🖼️ Hugging Face (Image)
- 💳 Sistema de Créditos

---

## Quick Start (Mientras se completa)

### 1️⃣ CLERK AUTHENTICATION (Login/Signup)
```bash
npm install @clerk/nextjs
```

1. Ir a https://clerk.com
2. Sign up → Create App
3. Copiar `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` y `CLERK_SECRET_KEY`
4. Pegar en `.env.local`

**Resultado:** Tu app tiene login/signup funcionando

---

### 2️⃣ SUPABASE DATABASE ($0)
```bash
npm install @supabase/supabase-js
```

1. Ir a https://supabase.com
2. Create Project (FREE)
3. Copiar `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`
4. Pegar en `.env.local`
5. Ir al SQL Editor y ejecutar el script que va a llegar

**Resultado:** Tu app tiene DB funcionando

---

### 3️⃣ REPLICATE VIDEO GENERATION ($0 — $50 créditos gratis)
```bash
npm install replicate
```

1. Ir a https://replicate.com
2. Sign up → Account → API Token
3. Copiar token
4. Pegar en `.env.local` como `REPLICATE_API_TOKEN`

**$50 iniciales = 5000+ videos gratis**

---

### 4️⃣ HUGGING FACE IMAGE GENERATION ($0)
```bash
npm install @huggingface/inference
```

1. Ir a https://huggingface.co
2. Sign up → Settings → Access Tokens → Create new (read)
3. Copiar token
4. Pegar en `.env.local` como `HUGGINGFACE_API_TOKEN`

**100% GRATIS — modelos open-source**

---

### 5️⃣ VERCEL BLOB STORAGE ($0 mientras uses Vercel free)

1. Deploy en Vercel: `vercel deploy`
2. En Vercel Dashboard → Settings → Storage → Blob → Create
3. Copiar token
4. Pegar en `.env.local` como `BLOB_READ_WRITE_TOKEN`

**Almacenamiento de 10+ años para videos/imágenes**

---

## Total Costo Mensual
- **Clerk:** Free (500 users)
- **Supabase:** Free (500 MB)
- **Vercel Blob:** Free (100 GB)
- **Replicate:** $50 créditos iniciales gratis
- **Hugging Face:** Free (unlimited)
- **Vercel Hosting:** Free

**= $0 por mes (cero costo)**

---

## Timeline
- ⏳ **Ahora:** Generando código (6 agentes paralelos)
- 📝 **En 5-10 min:** Todo el código listo
- ⚡ **Tu acción:** Copiar 6 keys en `.env.local`
- ✅ **Resultado final:** App completamente funcional con auth, DB, video/imagen, credits

---

## Siguiente: Deployment
Cuando todo esté listo:
```bash
npm install
npm run dev
# App corre en http://localhost:3000
```

Luego:
```bash
vercel deploy --prod
# App en producción
```

---

**Espera a que el workflow termine.** Los archivos estarán aquí automáticamente.