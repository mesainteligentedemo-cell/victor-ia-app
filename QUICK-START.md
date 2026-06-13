# 🚀 Victor IA App — Quick Start (5 pasos)

## PASO 1: Crear cuentas en servicios externos (15 min)

- [ ] Clerk: https://clerk.com → Create App
- [ ] Supabase: https://supabase.com → New Project  
- [ ] Stripe: https://stripe.com → New Account
- [ ] Anthropic: https://console.anthropic.com → API Key
- [ ] ElevenLabs: https://elevenlabs.io → API Key
- [ ] Higgsfield: https://higgsfield.ai → API Key

## PASO 2: Configurar variables de entorno (10 min)

```bash
cp .env.example .env.local
```

Editar `.env.local` y agregar todas las claves de Paso 1

## PASO 3: Setup local (5 min)

```bash
npm install
npm run build
npm run dev
```

Verificar que funciona en http://localhost:3000

## PASO 4: Deploy a Vercel (5 min)

```bash
git add .
git commit -m "Victor IA App ready for production"
git push origin main
```

Ir a vercel.com → Import GitHub repo → Add env vars → Deploy

## PASO 5: Configurar webhooks (10 min)

Actualizar URLs en:
- Stripe Dashboard: https://tu-app.vercel.app/api/webhooks/stripe
- Clerk Dashboard: https://tu-app.vercel.app/api/webhooks/clerk

---

## ✅ Verificar que funcionan:

1. Sign in con Clerk
2. Enviar mensaje en Chat
3. Seleccionar plan en Billing (Stripe test: 4242...)
4. Hablar en micrófono
5. Ver analytics en Dashboard

---

## 📚 Para más detalles:

- **Setup detallado:** SETUP.md
- **Estado del proyecto:** STATUS.md
- **Deployment paso a paso:** DEPLOYMENT-GUIDE.md
- **Features implementados:** IMPLEMENTATION-CHECKLIST.md

---

**Tiempo total:** ~45 minutos
**Dificultad:** Fácil
**Status:** Listo para producción ✅

