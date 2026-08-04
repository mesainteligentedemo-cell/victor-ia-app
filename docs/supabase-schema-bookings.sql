-- ============================================================================
-- VICTOR IA APP — SUPABASE SCHEMA PARA RESERVAS Y CAL.COM
-- ============================================================================
--
-- INSTRUCCIONES:
-- 1. Ir a https://app.supabase.com → SQL Editor
-- 2. Copiar y pegar TODO este contenido
-- 3. Ejecutar (botón Play)
-- 4. Verificar que todas las tablas se creen sin errores
-- ============================================================================

-- ============================================================================
-- TABLA PRINCIPAL: bookings
-- ============================================================================
-- Almacena todas las reservas agendadas (demos, llamadas, etc)
--
CREATE TABLE IF NOT EXISTS bookings (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Datos del cliente
  email VARCHAR(255) NOT NULL UNIQUE,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  telefono VARCHAR(20),
  whatsapp VARCHAR(20),

  -- Datos de la empresa
  sitio_web VARCHAR(255),
  num_empleados VARCHAR(50),
  empresa_desc TEXT,

  -- Información de reserva
  booking_cal_id VARCHAR(255) UNIQUE,  -- ID del evento en cal.com
  booking_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone VARCHAR(50),  -- ej: "America/Mexico_City"
  video_url VARCHAR(500),  -- Link de Zoom/Meet/etc

  -- Estado
  status VARCHAR(50) DEFAULT 'active',  -- active, cancelled, completed, no_show

  -- Tracking de reminders enviados
  reminder_1day_sent BOOLEAN DEFAULT FALSE,
  reminder_1hour_sent BOOLEAN DEFAULT FALSE,

  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLA: reminders_sent
-- ============================================================================
-- Registro de reminders enviados (para evitar duplicados y debugging)
--
CREATE TABLE IF NOT EXISTS reminders_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relación a booking
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,

  -- Tipo de reminder
  reminder_type VARCHAR(50),  -- '1day', '1hour', 'cancelled', etc

  -- Estado y logging
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'sent',  -- sent, failed, bounced
  error_message TEXT  -- si status='failed', guardar error aquí
);

-- ============================================================================
-- TABLA: webhook_logs (OPCIONAL - para debugging)
-- ============================================================================
-- Registro de webhooks recibidos de cal.com
--
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Información del webhook
  event_type VARCHAR(100),  -- booking.created, booking.cancelled, etc
  payload JSONB,  -- JSON completo del evento
  booking_id UUID REFERENCES bookings(id),

  -- Tracking
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE,
  error TEXT
);

-- ============================================================================
-- ÍNDICES (para queries rápidas)
-- ============================================================================

-- Búsquedas por email
CREATE INDEX IF NOT EXISTS idx_bookings_email
  ON bookings(email);

-- Búsquedas por ID de cal.com
CREATE INDEX IF NOT EXISTS idx_bookings_cal_id
  ON bookings(booking_cal_id);

-- Búsquedas por fecha (para reminders)
CREATE INDEX IF NOT EXISTS idx_bookings_datetime
  ON bookings(booking_datetime);

-- Búsquedas por estado
CREATE INDEX IF NOT EXISTS idx_bookings_status
  ON bookings(status);

-- Búsquedas de reminders sin enviar
CREATE INDEX IF NOT EXISTS idx_bookings_reminder_1day
  ON bookings(reminder_1day_sent, booking_datetime);

CREATE INDEX IF NOT EXISTS idx_bookings_reminder_1hour
  ON bookings(reminder_1hour_sent, booking_datetime);

-- Reminders por booking
CREATE INDEX IF NOT EXISTS idx_reminders_booking_id
  ON reminders_sent(booking_id);

-- Reminders por tipo
CREATE INDEX IF NOT EXISTS idx_reminders_type
  ON reminders_sent(reminder_type);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) — SEGURIDAD
-- ============================================================================
--
-- ⚠️ CRÍTICO: Habilitar RLS en TODAS las tablas
--
-- 1. En Supabase UI: Authentication → Policies
-- 2. O ejecutar aquí (descomentar si necesitas RLS programáticamente)
--

-- Habilitar RLS en bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en reminders_sent
ALTER TABLE reminders_sent ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en webhook_logs (solo admin)
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLÍTICAS DE ACCESO (Ejemplos)
-- ============================================================================
--
-- Descomentar si no usas anon key en el cliente
--

-- BOOKINGS: solo admin (service role) puede ver/editar todas
-- CREATE POLICY "bookings_admin_only" ON bookings
--   FOR ALL USING (auth.role() = 'service_role');

-- REMINDERS_SENT: solo admin
-- CREATE POLICY "reminders_admin_only" ON reminders_sent
--   FOR ALL USING (auth.role() = 'service_role');

-- WEBHOOK_LOGS: solo admin
-- CREATE POLICY "webhook_logs_admin_only" ON webhook_logs
--   FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- FUNCIONES ÚTILES (OPCIONAL)
-- ============================================================================

-- Función para obtener bookings próximos (para reminders)
CREATE OR REPLACE FUNCTION get_upcoming_bookings(
  hours_from_now INT DEFAULT 24
)
RETURNS TABLE (
  id UUID,
  email VARCHAR,
  nombre VARCHAR,
  booking_datetime TIMESTAMP WITH TIME ZONE,
  timezone VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.email,
    b.nombre,
    b.booking_datetime,
    b.timezone
  FROM bookings b
  WHERE
    b.status = 'active'
    AND b.booking_datetime BETWEEN NOW() AND NOW() + (hours_from_now || ' hours')::INTERVAL
  ORDER BY b.booking_datetime ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VERIFICACIÓN POST-CREACIÓN
-- ============================================================================
--
-- Ejecutar estas queries para verificar que todo se creó correctamente:
--

-- Ver tablas creadas
-- \dt

-- Ver estructura de bookings
-- \d bookings

-- Ver índices
-- SELECT indexname FROM pg_indexes WHERE tablename = 'bookings';

-- Ver RLS habilitado
-- SELECT tablename, rowsecurity FROM pg_tables
--   WHERE tablename IN ('bookings', 'reminders_sent', 'webhook_logs');

-- ============================================================================
-- SEED DATA (OPCIONAL - para testing)
-- ============================================================================
--
-- Descomentar si quieres datos de prueba

-- INSERT INTO bookings (
--   email, nombre, apellido, telefono, sitio_web,
--   num_empleados, empresa_desc, booking_cal_id,
--   booking_datetime, timezone, video_url, status
-- ) VALUES (
--   'test@ejemplo.com',
--   'Juan',
--   'García',
--   '+34 600 000 000',
--   'https://ejemplo.com',
--   '20',
--   'Empresa de testing',
--   'evt_test_123',
--   NOW() + INTERVAL '3 days',
--   'Europe/Madrid',
--   'https://meet.victor-ia.com/test',
--   'active'
-- );

-- ============================================================================
-- NOTAS DE SEGURIDAD
-- ============================================================================
--
-- 1. RLS DEBE estar habilitado en producción
-- 2. Si usas anon key en cliente:
--    → Crear políticas restrictivas (ej: solo lectura)
--    → NUNCA permitir UPDATE/DELETE desde cliente
--
-- 3. Mejor práctica: backend (Node.js) usa service_role key
--    → Acceso completo a TODAS las tablas
--    → Cliente NO accede directamente a Supabase
--
-- 4. Backups automáticos:
--    → Supabase hace backup daily (plan pagado)
--    → Verificar en Settings → Backups
--
-- ============================================================================