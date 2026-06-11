# ⚡ QUICK START — Victor IA Media Generator

**Status:** ✅ PRODUCTION READY  
**Time to launch:** 1 hora  
**Cost:** $0 (gratis)

---

## 🚀 TL;DR — 3 PASOS (15 MINUTOS)

```bash
# 1. Copiar 3 API keys en .env.local
# (Ver abajo cómo obtenerlas)

# 2. Instalar dependencias (ya hecho)
npm install

# 3. Correr
npm run dev
# → http://localhost:3000 ✅
```

---

## 🔑 GET YOUR 3 API KEYS (10 MINUTOS)

### **Key #1: Clerk (Login/Signup)**
```
1. https://clerk.com → Sign up
2. Create App → Copy these:
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
```

### **Key #2: Supabase (Database)**
```
1. https://supabase.com → Sign up
2. Create Project (FREE) → Copy these:
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
3. SQL Editor → Run this file:
   supabase/migrations/001_initial_schema.sql
```

### **Key #3: Vercel Blob (Storage)**
```
1. https://vercel.com/dashboard
2. Settings → Storage → Blob → Create
3. Copy token:
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

---

## 📝 CREATE .env.local

**Option A: Automated**
```bash
cp .env.example .env.local
# Then edit with your 3 keys
```

**Option B: Manual**
```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
EOF
```

---

## ▶️ RUN THE APP

```bash
npm run dev
# Waiting for compilation... (30-60 seconds)
# ✓ Ready on http://localhost:3000
```

Visit: http://localhost:3000

---

## 📍 MAIN FLOWS

### **Sign Up (First Time)**
```
Home page → "Sign Up"
→ Email verification (check inbox)
→ Receives 1000 credits free
→ Dashboard ready
```

### **Generate Image**
```
Dashboard → /#/prospeccion
→ "Generar Imagen" button
→ Write prompt (min 20 chars)
→ Click "Generar Imagen"
→ Wait 1-2 minutes
→ Image appears in gallery ✅
→ Credits deducted (-2 to -6)
```

### **Generate Video**
```
Dashboard → /#/prospeccion
→ "Generar Video" button
→ Write prompt
→ Select duration (5-30s = short, 30-60s = long)
→ Click "Generar Video"
→ If short: wait 2-3 min, appears ✅
→ If long: wait 5-10 min (HyperFrames editing) ✅
→ Credits deducted (-10 to -50)
```

### **View History**
```
Dashboard → /#/prospeccion
→ Scroll down to "Generaciones Recientes"
→ All past generations (sorted by date)
→ Download or delete each one
```

---

## 💡 KEY FEATURES

| Feature | Details |
|---------|---------|
| **Auth** | Clerk (email + OAuth) |
| **Images** | Higgsfield (40+ models) |
| **Videos** | Higgsfield (short) + HyperFrames (long) |
| **Storage** | Vercel Blob (10+ years) |
| **Database** | Supabase (PostgreSQL) |
| **Credits** | 1000 free, then custom tiers |
| **UI** | Dark mode, responsive, Framer Motion animations |

---

## 📊 COST BREAKDOWN

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Clerk | 500 users | ✅ More than enough for MVP |
| Supabase | 500 MB | ✅ Thousands of generations |
| Vercel Blob | 100 GB/month | ✅ Thousands of videos |
| Higgsfield | You pay | ✅ Your own credits |
| Hosting | FREE | ✅ Vercel free tier |
| **TOTAL** | **$0/month** | ✅ **Completely free** |

---

## 🛠️ TROUBLESHOOTING

**"Cannot find module '@clerk/nextjs'"**
```bash
npm install
```

**"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is undefined"**
```
→ Check .env.local exists
→ Verify key is correct from Clerk dashboard
→ Restart: npm run dev
```

**"Supabase connection failed"**
```
→ Check NEXT_PUBLIC_SUPABASE_URL in .env.local
→ Verify SQL schema was executed
→ Test connection: Go to http://localhost:3000/api/db/sync
```

**"Generation failed / timeout"**
```
→ Check your Higgsfield credits
→ Verify prompt is > 20 characters
→ Check console (F12) for details
```

**"Button disabled / can't generate"**
```
→ Check you're logged in (top right avatar)
→ Check credit balance (left sidebar)
→ Refresh page: F5
```

---

## 📁 IMPORTANT FILES

| File | Purpose |
|------|---------|
| `.env.local` | Your API keys (DO NOT commit) |
| `PRODUCTION-READY.md` | Full setup guide |
| `STATUS-REPORT.txt` | Visual status |
| `COMPLETED-FEATURES.md` | Feature list |
| `components/prospeccion/` | Main UI |
| `lib/ai/` | Higgsfield + HyperFrames |
| `lib/services/credits.service.ts` | Credit system |

---

## 🚀 DEPLOYMENT (WHEN READY)

```bash
# 1. Build locally
npm run build

# 2. Connect to Vercel
vercel deploy --prod

# 3. Set environment variables in Vercel Dashboard
# Copy from .env.local

# 4. Done! App is live
https://your-project.vercel.app
```

---

## 📞 SUPPORT

- Full setup: Read `PRODUCTION-READY.md`
- Database: Read `SUPABASE_QUICK_REFERENCE.md`
- Video editing: Read `docs/HYPERFRAMES-INTEGRATION.md`
- Credits: Read `docs/CREDITS_SYSTEM.md`

---

## ✅ CHECKLIST

Before saying "ready":

- [ ] 3 API keys copied to .env.local
- [ ] `npm install` completed
- [ ] `npm run dev` runs without errors
- [ ] http://localhost:3000 loads
- [ ] Can sign up
- [ ] Can generate image
- [ ] Can generate video
- [ ] Credits deduct correctly

**If all checked → You're production-ready!** 🚀

---

**Questions?** Check the markdown files in the root folder.
