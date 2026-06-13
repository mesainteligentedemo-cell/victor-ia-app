# Victor IA App — Setup de Variables de Entorno

Bienvenido. Este archivo es tu punto de entrada para configurar todas las variables de entorno necesarias.

## Archivos de Referencia

| Archivo | Propósito | Tiempo |
|---------|-----------|--------|
| **[ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)** | Quick start con tabla de plataformas | 5 min |
| **[SECURITY_SETUP_COMPLETE.txt](./SECURITY_SETUP_COMPLETE.txt)** | Resumen de lo que se creó | 2 min |
| **[.env.example](./.env.example)** | Plantilla con comentarios detallados | Referencia |
| **[.env.local](./.env.local)** | Tu archivo de configuración (NO commitar) | Configurar |

## Inicio Rápido (3 pasos)

### 1. Lee la Guía
Abre **[ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)** — tiene todo explicado en 5 minutos.

### 2. Obtén las Keys
Abre 6 dashboards en pestañas:
- https://dashboard.clerk.com
- https://dashboard.stripe.com
- https://app.supabase.com
- https://console.anthropic.com
- https://openrouter.ai
- https://elevenlabs.io

Copia los valores a `.env.local` (sigue los comentarios en el archivo).

### 3. Valida
```bash
npm run validate-env
```

Si todo está ✅ OK, ¡listo!

---

## Archivos Clave

### .env.local (TÚ CONFIGURAS)
- 281 líneas con comentarios
- Todos los valores que necesitas
- YA PROTEGIDO en .gitignore
- Nunca será commiteado a Git

### .env.example (REFERENCIA)
- Plantilla para nuevos desarrolladores
- Tabla con links a dashboards
- Instrucciones de dónde obtener cada key

### scripts/validate-env.ts (AUTOMÁTICO)
- Ejecutable: `npm run validate-env`
- Verifica que ninguna variable tenga "XXX"
- Valida patrones (sk-ant-, pk_test_, etc)
- Da feedback detallado si hay errores

---

## Público vs Privado

### Variables PÚBLICAS (NEXT_PUBLIC_*)
✅ Seguro exponerlas — se envían al navegador

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Variables PRIVADAS
🔒 CRÍTICAS — solo servidor, nunca al cliente

```env
CLERK_SECRET_KEY=sk_test_...
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
```

---

## Procedimiento Si Algo Falla

### Error: "Variable no encontrada"
1. Abre `.env.local` (no `.env.example`)
2. Verifica que la línea no esté comentada (sin #)
3. Si falta: copia de `.env.example`

### Error: "SUPABASE_ANON_KEY inválida"
1. En https://app.supabase.com → Settings → API
2. Copia **anon public key** (no service role)
3. Si no funciona: regenerar y esperar 1 minuto

### Error: "npm run validate-env falla"
1. Reemplaza todos los `XXX` con valores reales
2. Verifica que no haya `xxxxx`
3. Ejecuta de nuevo

### Error: ".env.local fue commiteado a Git"
```bash
git rm --cached .env.local
git commit -m "Remove .env.local"
```
**DESPUÉS:** Revoca TODAS las keys en sus dashboards (se filtraron).

---

## Documentación Completa

Para detalles sobre seguridad, buenas prácticas, y qué hacer si una key se filtra:

→ Abre **[SECURITY.md](./SECURITY.md)** (si existe aún, o busca en documentación)

---

## Estructura Final

Después de completar el setup, tu carpeta tendrá:

```
victor-ia-app/
├── .env.local                      ← TÚ CONFIGURAS (privado, no commitar)
├── .env.example                    ← plantilla (referencia)
├── ENV_SETUP_GUIDE.md             ← guía rápida
├── ENV_README.md                  ← este archivo
├── SECURITY_SETUP_COMPLETE.txt    ← resumen de lo que se creó
├── scripts/
│   └── validate-env.ts            ← validador (npm run validate-env)
├── .gitignore                      ← ya protege .env.local
├── package.json                    ← script agregado: validate-env
└── [resto de archivos del proyecto]
```

---

## Checklist Final

- [ ] Leí ENV_SETUP_GUIDE.md
- [ ] Copié valores a .env.local
- [ ] Ejecuté `npm run validate-env` (sin errores)
- [ ] Compilé con `npm run build` (sin errores)
- [ ] Inicié con `npm run dev` (funcionando)
- [ ] Sé dónde están documentadas las keys (Notion/wiki/etc)
- [ ] Entiendo que .env.local nunca se commita
- [ ] Sé qué hacer si una key se filtra

---

## Soporte

Si algo no funciona:

1. Revisa ENV_SETUP_GUIDE.md → sección "⚠️ Errores Comunes"
2. Ejecuta `npm run validate-env` y sigue el feedback
3. Verifica que copiaste los valores COMPLETOS (no acortados)
4. Si la key es de Supabase: espera 1 minuto a que se propague

---

**Última actualización:** 2026-06-13  
**Tiempo estimado de setup:** 45 minutos desde cero
