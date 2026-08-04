# CONFIGURAR SUPABASE — INSTRUCCIONES PASO A PASO

## Objetivo
Crear las tablas `bookings`, `reminders_sent` y `webhook_logs` en Supabase para la integración cal.com.

---

## PASO 1: Acceder a Supabase

1. Ir a https://app.supabase.com
2. Hacer login (email + password, o GitHub)
3. Seleccionar el proyecto **victor-ia-app**
4. En la sidebar izquierda, buscar **SQL Editor**
5. Click en **SQL Editor** (icono de consola)

**Resultado esperado:** Ves una ventana con editor SQL (texto en blanco)

---

## PASO 2: Crear Nueva Query

1. Click en botón **+ New Query**
2. Se abre un nuevo editor vacío
3. Dale un nombre (ej: "Create Bookings Schema")

---

## PASO 3: Copiar y Pegar el SQL

Abrir este archivo: `docs/supabase-schema-bookings.sql`

Copiar **TODO** el contenido (desde `-- ============` hasta el final).

En el editor de Supabase, pegar el contenido completo.

---

## PASO 4: Ejecutar el SQL

1. Verificar que TODO el contenido está pegado
2. Click en botón **▶ RUN** (esquina superior derecha, botón azul)
3. Esperar a que termine (5-10 segundos)

**Resultado esperado:**
```
✓ Successfully executed 6 commands
```

Si ves errores, ver [Troubleshooting](#troubleshooting) abajo.

---

## PASO 5: Verificar que las Tablas Fueron Creadas

En el mismo editor SQL, ejecutar verificación:

```sql
-- Verificar que las tablas existen
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Click en **▶ RUN**

**Resultado esperado:**
Debe mostrar una tabla con 3+ filas:
- `bookings`
- `reminders_sent`
- `webhook_logs`

Si falta alguna → ver [Troubleshooting](#troubleshooting)

---

## PASO 6: Verificar Estructura de Bookings

Ejecutar:
```sql
-- Ver estructura de la tabla bookings
\d bookings
```

**Resultado esperado:** Muestra todas las columnas:
- id (UUID)
- email (VARCHAR)
- nombre (VARCHAR)
- apellido (VARCHAR)
- telefono (VARCHAR)
- whatsapp (VARCHAR)
- sitio_web (VARCHAR)
- num_empleados (VARCHAR)
- empresa_desc (TEXT)
- booking_cal_id (VARCHAR UNIQUE)
- booking_datetime (TIMESTAMP WITH TIME ZONE)
- timezone (VARCHAR)
- video_url (VARCHAR)
- status (VARCHAR)
- reminder_1day_sent (BOOLEAN)
- reminder_1hour_sent (BOOLEAN)
- created_at (TIMESTAMP WITH TIME ZONE)
- updated_at (TIMESTAMP WITH TIME ZONE)

---

## PASO 7: Verificar Índices

Ejecutar:
```sql
-- Ver índices creados
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'bookings'
ORDER BY indexname;
```

**Resultado esperado:** Debe mostrar ~6 índices:
- `idx_bookings_email`
- `idx_bookings_cal_id`
- `idx_bookings_datetime`
- `idx_bookings_status`
- `idx_bookings_reminder_1day`
- `idx_bookings_reminder_1hour`

---

## PASO 8: Verificar Row Level Security (RLS)

Ejecutar:
```sql
-- Ver RLS habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('bookings', 'reminders_sent', 'webhook_logs')
ORDER BY tablename;
```

**Resultado esperado:** Todas las 3 tablas deben tener `rowsecurity = true`

```
tablename         | rowsecurity
------------------+-------------
bookings          | true
reminders_sent    | true
webhook_logs      | true
```

---

## PASO 9: Probar Inserción

Ejecutar:
```sql
-- Insertar un booking de prueba
INSERT INTO bookings (
  email,
  nombre,
  booking_datetime,
  timezone,
  status
) VALUES (
  'test@victor-ia.com',
  'Test',
  NOW() + INTERVAL '7 days',
  'America/Mexico_City',
  'active'
);
```

Click en **▶ RUN**

**Resultado esperado:**
```
✓ Successfully inserted 1 row
```

---

## PASO 10: Verificar Dato Insertado

Ejecutar:
```sql
-- Ver el booking de prueba
SELECT id, email, nombre, booking_datetime, status
FROM bookings
WHERE email = 'test@victor-ia.com';
```

**Resultado esperado:** Muestra 1 fila con los datos que insertaste

---

## PASO 11: Limpiar Datos de Test

Ejecutar:
```sql
-- Eliminar el booking de prueba
DELETE FROM bookings
WHERE email = 'test@victor-ia.com';
```

**Resultado esperado:**
```
✓ Successfully deleted 1 row
```

---

## PASO 12: Habilitar RLS Policies (OPCIONAL pero RECOMENDADO)

Si quieres que SOLO el backend (service_role) acceda a las tablas:

```sql
-- Denegar acceso a TODOS excepto service_role
CREATE POLICY "bookings_admin_only" ON bookings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "reminders_admin_only" ON reminders_sent
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "webhook_logs_admin_only" ON webhook_logs
  FOR ALL USING (auth.role() = 'service_role');
```

**NOTAS:**
- Esto es muy restrictivo (cliente NO puede leer nada)
- Recomendado para seguridad máxima
- Tu backend usa `SUPABASE_SERVICE_ROLE_KEY` (ignora RLS)
- Si necesitas que cliente lea algo, crear policy más permisiva

---

## PASO 13: Verificar Conexión desde .env.local

En tu `.env.local`, tienes:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Verificar que son correctas:

1. Ir a https://app.supabase.com
2. Settings → API
3. Copiar:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

4. Pegar en `.env.local`
5. Restart servidor: `npm run dev`

---

## Troubleshooting

### Error: "Table already exists"
**Causa:** Tabla ya fue creada en una ejecución anterior

**Solución:**
```sql
-- Opción 1: Ejecutar script con IF NOT EXISTS (ya está incluido)
-- Opción 2: Eliminar tabla y recrear
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS reminders_sent CASCADE;
DROP TABLE IF EXISTS webhook_logs CASCADE;

-- Luego ejecutar el script completo de nuevo
```

---

### Error: "Syntax error"
**Causa:** SQL mal formado o falta un `;`

**Solución:**
1. Copiar el SQL de nuevo desde `supabase-schema-bookings.sql`
2. Asegurarse de copiar TODO (inicio a fin)
3. Pegar en nuevo editor (limpiar editor viejo)

---

### Error: "Permission denied"
**Causa:** Usuario no tiene permisos

**Solución:**
1. Verificar que eres owner del proyecto (Settings → Members)
2. Si no eres owner, pedir que te den permisos
3. Logout y login nuevamente

---

### Las tablas existen pero no aparecen en UI
**Causa:** Cache del navegador

**Solución:**
1. Refresh página: Ctrl+Shift+R (hard refresh)
2. O: Sidebar → Tables → Refresh (icono de recarga)

---

### Datos insertados pero no aparecen en Supabase UI
**Causa:** RLS policy muy restrictiva

**Solución:**
1. Ir a Table Editor
2. Seleccionar tabla `bookings`
3. Click en **Policies** (esquina superior)
4. Crear policy que permita lectura:
   ```sql
   CREATE POLICY "bookings_read_anon" ON bookings
     FOR SELECT USING (true);
   ```

---

### No puedo insertar datos desde mi código
**Causa:** RLS policy dennega INSERT

**Solución:**
1. Verificar que usas `service_role` key en backend (ignora RLS)
2. O: Crear policy que permita INSERT:
   ```sql
   CREATE POLICY "bookings_insert" ON bookings
     FOR INSERT WITH CHECK (auth.role() = 'authenticated');
   ```

---

## Checklist Final

- [ ] Tablas creadas (3: bookings, reminders_sent, webhook_logs)
- [ ] Índices creados (~6 índices en bookings)
- [ ] RLS habilitado (rowsecurity = true)
- [ ] Inserción y lectura funcionan
- [ ] Datos de test eliminados
- [ ] .env.local tiene URLs correctas de Supabase
- [ ] Servidor local redeploy (`npm run dev`)

---

## Próximos Pasos

1. Configurar cal.com (API key, webhook, event type)
2. Configurar Resend (API key, domain verificado)
3. Testear endpoints API (POST /api/bookings/create)
4. Deploy a Vercel

---

## Referencias

- [Supabase SQL Editor Docs](https://supabase.com/docs/guides/database/sql-editor)
- [PostgreSQL CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

