# 🚀 Vercel Deployment Verification & Go-Live Checklist

**Generated:** 2026-06-13 16:50 UTC  
**App:** https://victor-ia-app.vercel.app  
**Status:** Ready for production verification

---

## 📋 PASO 1: Verificar Deployment en Vercel (2 min)

### URL para monitorear
```
https://vercel.com/mesainteligentedemo-cell/victor-ia-app/deployments
```

### Esperar por:
- ✅ Build log muestre "✓ Build completed"
- ✅ Preview URL disponible: https://victor-ia-app-*.vercel.app
- ✅ Production deployment: https://victor-ia-app.vercel.app

### Si hay error en Vercel:
- Click en "View Logs" 
- Buscar por: "eslint" (warning, ignorable) o "middleware" (deprecation warning)
- Si es error real: verificar que `.env.local` no esté commiteado

---

## 🔑 PASO 2: Agregar Environment Variables en Vercel (5 min)

### Ir a:
```
Vercel Dashboard → Project: victor-ia-app → Settings → Environment Variables
```

### Agregar estas variables (tabla de VALORES REALES):

| Variable | Valor | Source | Notas |
|----------|-------|--------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-[NUEVA_KEY]` | console.anthropic.com → API Keys | Rota hoy (2026-06-13) |
| `ELEVENLABS_API_KEY` | `sk_[NUEVA_KEY]` | elevenlabs.io → Profile → API Key | Rota hoy (2026-06-13) |
| `STRIPE_SECRET_KEY` | `sk_live_[NUEVA_KEY]` | dashboard.stripe.com → Developers → API Keys | Rota hoy (2026-06-13) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_[NUEVA_KEY]` | dashboard.stripe.com → Webhooks → Signing Secret | Rota hoy (2026-06-13) |
| `ADMIN_TOKENS` | `token-prod-001,token-prod-002` | Generate new UUIDs for security | For /api/webhooks GET auth |
| `NODE_ENV` | `production` | Set manually | Not in .env.local |
| `DEBUG` | `false` | Set manually | No logs sensibles en prod |

### Pasos en Vercel UI:
1. Click **"Add New"**
2. Name: `ANTHROPIC_API_KEY`
3. Value: `sk-ant-[tu-key-real]`
4. Environment: **Production** (checkbox)
5. Click **"Save"**
6. Repetir para todas las variables

### Después de agregar TODAS:
- Ir a **"Deployments"**
- Click en el deployment actual (6597522)
- Click **"Redeploy"** (top right)
- Esperar ~2-3 min a que rebuild with new env vars

---

## 🧪 PASO 3: Testing de Endpoints en Producción (5 min)

### Test 1: Verificar que API está up
```powershell
$response = Invoke-WebRequest -Uri "https://victor-ia-app.vercel.app/api/health" -Method GET -ErrorAction SilentlyContinue
if ($response.StatusCode -eq 200) { "✅ API is UP" } else { "❌ API is DOWN" }
```

### Test 2: Auth enforcement en /api/chat (401 expected)
```powershell
$response = Invoke-WebRequest -Uri "https://victor-ia-app.vercel.app/api/chat" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"message":"test"}' `
  -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 401) { "✅ Auth enforcement working" } else { "❌ Auth not working (got $($response.StatusCode))" }
```

### Test 3: CORS restriction (no header expected from attacker.com)
```powershell
$response = Invoke-WebRequest -Uri "https://victor-ia-app.vercel.app/api/merge/versions" `
  -Method OPTIONS `
  -Headers @{ "Origin" = "http://attacker.com" } `
  -ErrorAction SilentlyContinue

$corsHeader = $response.Headers["Access-Control-Allow-Origin"]
if ($null -eq $corsHeader -or $corsHeader -eq "") { 
  "✅ CORS whitelist working" 
} else { 
  "❌ CORS leaked: $corsHeader"
}
```

### Test 4: Input validation en /api/voice/generate (400 expected)
```powershell
$response = Invoke-WebRequest -Uri "https://victor-ia-app.vercel.app/api/voice/generate" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"text":""}' `
  -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 400) { "✅ Input validation working" } else { "❌ Validation not working (got $($response.StatusCode))" }
```

### Test 5: Error message sanitization (generic message expected)
```powershell
$response = Invoke-WebRequest -Uri "https://victor-ia-app.vercel.app/api/admin" `
  -Method GET `
  -ErrorAction SilentlyContinue

$body = $response.Content | ConvertFrom-Json
if ($body.error -eq "An error occurred processing your request" -or $body.error -eq "Unauthorized") { 
  "✅ Error messages sanitized" 
} else { 
  "⚠️ Error message: $($body.error)" 
}
```

---

## 📊 PASO 4: Verificar Logs en Vercel (2 min)

### Ir a:
```
Vercel Dashboard → Project: victor-ia-app → Deployments → Logs
```

### Buscar por:
- ❌ `error:` followed by internal details (bad)
- ✅ `error:` followed by "An error occurred..." (good)
- ❌ Stack traces (bad)
- ✅ `[INFO]` or `[WARN]` with generic messages (good)

### Example de buen log:
```
[INFO] Chat API call successful userId=user_123 messageLength=45 tokensUsed=124
[WARN] Rate limit approaching userId=user_456 current=9800 limit=10000
```

### Example de malo log:
```
[ERROR] TypeError: Cannot read property 'email' of null (expone estructura)
[ERROR] Database connection failed: ECONNREFUSED 127.0.0.1:5432 (expone IP:puerto)
```

---

## ✅ PASO 5: Confirmación Final (GO LIVE)

Una vez completados todos los pasos:

### Checklist de Confirmación:
- [ ] Vercel deployment completed successfully
- [ ] All 5 environment variables added + redeploy triggered
- [ ] Test 1: API up and responding
- [ ] Test 2: Auth enforcement (401 on no auth)
- [ ] Test 3: CORS whitelist working
- [ ] Test 4: Input validation (400 on empty)
- [ ] Test 5: Error messages sanitized (no internals)
- [ ] Logs show no errors, only secure messages

### Si TODO está ✅:
```
🚀 PRODUCTION DEPLOYMENT SUCCESSFUL
Victor IA App is now LIVE and SECURE
https://victor-ia-app.vercel.app
```

### Si algo está ❌:
- Click "Redeploy" en Vercel
- Esperar 2-3 min
- Re-run tests
- Si persiste: check env vars están exactas y redeploy nuevamente

---

## 🔐 SECURITY VERIFICATION (BONUS)

### Verificar headers de seguridad:
```powershell
$response = Invoke-WebRequest -Uri "https://victor-ia-app.vercel.app" -Method HEAD
$response.Headers | Where-Object { $_ -match "X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security" }
```

Expected output:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Verificar HTTPS (debe ser HTTPS no HTTP):
```powershell
if ($response.RequestUri.Scheme -eq "https") { "✅ HTTPS enforced" } else { "❌ Not HTTPS" }
```

---

## 📞 SUPPORT

Si todo funciona: ✅ **DEPLOYMENT COMPLETE** → Victor IA App is live and secure  
Si algo falla: ❌ Check Vercel logs → verify env vars → redeploy

**Vercel Dashboard:** https://vercel.com/mesainteligentedemo-cell/victor-ia-app  
**App Production:** https://victor-ia-app.vercel.app  
**GitHub:** https://github.com/mesainteligentedemo-cell/victor-ia-app

---

**Generated by Claude Code - Security Hardening Session 2026-06-13**
