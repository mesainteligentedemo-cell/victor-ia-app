-- ============================================================================
-- Migration 20260615 — Studio Module: creations + studio_projects
-- Módulo /studio del Victor IA App
-- Seguro para ejecutar múltiples veces (IF NOT EXISTS / CREATE OR REPLACE).
-- ============================================================================
-- NOTA: La tabla `generations` ya existe en 002_studio_finance_settings.sql.
-- `creations` es la tabla canónica para el módulo /studio:
--   - user_id TEXT (Clerk user IDs son strings, ej. "user_2abc123")
--   - Sin FK a tabla `users` — Clerk maneja auth externamente
--   - action_type cubre todos los tipos de output del studio
-- ============================================================================


-- ---------------------------------------------------------------------------
-- 1. TABLA: creations
-- Registro de cada generación producida en el módulo /studio
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS creations (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT        NOT NULL,                         -- Clerk user ID (ej: "user_2abc123")
  action_type   TEXT        NOT NULL
                CHECK (action_type IN (
                  'image', 'video', 'presentation', 'web',
                  'voice', 'training', 'admin', 'dashboard'
                )),
  prompt        TEXT,                                         -- Prompt usado para la generación
  config        JSONB       NOT NULL DEFAULT '{}',            -- Configuración extra (modelo, params)
  model         TEXT,                                         -- Modelo utilizado (ej: "seedance-2.0")
  result_url    TEXT,                                         -- URL del resultado (Cloudinary, S3, etc.)
  content       JSONB,                                        -- Output estructurado (slides, HTML, etc.)
  status        TEXT        NOT NULL DEFAULT 'processing'
                CHECK (status IN ('processing', 'completed', 'failed')),
  error         TEXT,                                         -- Mensaje de error si status = 'failed'
  metadata      JSONB       NOT NULL DEFAULT '{}',            -- Info extra: duración, tokens, créditos
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE creations IS 'Generaciones del módulo /studio. user_id es TEXT (Clerk). Sin FK a users.';
COMMENT ON COLUMN creations.user_id     IS 'Clerk user ID string, ej: user_2abc123';
COMMENT ON COLUMN creations.action_type IS 'Tipo de generación: image, video, presentation, web, voice, training, admin, dashboard';
COMMENT ON COLUMN creations.config      IS 'Configuración de la generación (modelo, parámetros, opciones)';
COMMENT ON COLUMN creations.content     IS 'Output estructurado: slides JSON, HTML completo, objetos complejos';
COMMENT ON COLUMN creations.metadata    IS 'Info adicional: tokens usados, créditos, duración, provider';


-- ---------------------------------------------------------------------------
-- 2. TABLA: studio_projects
-- Proyectos del studio que agrupan múltiples creations
-- (Diferente de la tabla `projects` existente que es para gestión de clientes)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS studio_projects (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         TEXT        NOT NULL,                       -- Clerk user ID (string)
  name            TEXT        NOT NULL,
  description     TEXT,
  creation_ids    UUID[]      NOT NULL DEFAULT '{}',          -- Array de IDs de creations asociadas
  thumbnail_url   TEXT,                                       -- URL de la imagen de portada
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE studio_projects IS 'Proyectos del /studio que agrupan creations. Distinto de tabla projects (CRM).';
COMMENT ON COLUMN studio_projects.user_id      IS 'Clerk user ID string, ej: user_2abc123';
COMMENT ON COLUMN studio_projects.creation_ids IS 'Array de UUIDs referenciando filas en tabla creations';


-- ---------------------------------------------------------------------------
-- 3. ÍNDICES
-- ---------------------------------------------------------------------------

-- creations
CREATE INDEX IF NOT EXISTS idx_creations_user_id
  ON creations(user_id);

CREATE INDEX IF NOT EXISTS idx_creations_action_type
  ON creations(action_type);

CREATE INDEX IF NOT EXISTS idx_creations_created_at
  ON creations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_creations_user_status
  ON creations(user_id, status);

CREATE INDEX IF NOT EXISTS idx_creations_user_action_created
  ON creations(user_id, action_type, created_at DESC);

-- studio_projects
CREATE INDEX IF NOT EXISTS idx_studio_projects_user_id
  ON studio_projects(user_id);

CREATE INDEX IF NOT EXISTS idx_studio_projects_created_at
  ON studio_projects(created_at DESC);


-- ---------------------------------------------------------------------------
-- 4. TRIGGER: updated_at automático
-- Reutiliza la función set_updated_at si ya existe, o la crea.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para creations
DROP TRIGGER IF EXISTS trg_creations_updated_at ON creations;
CREATE TRIGGER trg_creations_updated_at
  BEFORE UPDATE ON creations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Trigger para studio_projects
DROP TRIGGER IF EXISTS trg_studio_projects_updated_at ON studio_projects;
CREATE TRIGGER trg_studio_projects_updated_at
  BEFORE UPDATE ON studio_projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ---------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------------------

-- Habilitar RLS en ambas tablas
ALTER TABLE creations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_projects ENABLE ROW LEVEL SECURITY;

-- creations: usuario solo ve sus propias filas
-- auth.uid()::text compara el UUID de Supabase Auth con el TEXT user_id de Clerk
DROP POLICY IF EXISTS "creations_user_select" ON creations;
CREATE POLICY "creations_user_select"
  ON creations FOR SELECT
  USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "creations_user_insert" ON creations;
CREATE POLICY "creations_user_insert"
  ON creations FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "creations_user_update" ON creations;
CREATE POLICY "creations_user_update"
  ON creations FOR UPDATE
  USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "creations_user_delete" ON creations;
CREATE POLICY "creations_user_delete"
  ON creations FOR DELETE
  USING (user_id = auth.uid()::text);

-- studio_projects: usuario solo ve sus propios proyectos
DROP POLICY IF EXISTS "studio_projects_user_select" ON studio_projects;
CREATE POLICY "studio_projects_user_select"
  ON studio_projects FOR SELECT
  USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "studio_projects_user_insert" ON studio_projects;
CREATE POLICY "studio_projects_user_insert"
  ON studio_projects FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "studio_projects_user_update" ON studio_projects;
CREATE POLICY "studio_projects_user_update"
  ON studio_projects FOR UPDATE
  USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "studio_projects_user_delete" ON studio_projects;
CREATE POLICY "studio_projects_user_delete"
  ON studio_projects FOR DELETE
  USING (user_id = auth.uid()::text);

-- NOTA: El service role (admin client del backend) bypasses RLS automáticamente.
-- Las rutas API de Next.js usan el admin client con SUPABASE_SERVICE_ROLE_KEY
-- y nunca necesitan pasar las políticas anteriores.


-- ---------------------------------------------------------------------------
-- 6. FUNCIÓN: save_creation
-- Inserta una nueva creación y retorna el registro completo.
-- Uso: SELECT * FROM save_creation('user_2abc', 'image', 'un logo minimalista', ...);
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION save_creation(
  p_user_id     TEXT,
  p_action_type TEXT,
  p_prompt      TEXT        DEFAULT NULL,
  p_config      JSONB       DEFAULT '{}',
  p_model       TEXT        DEFAULT NULL,
  p_result_url  TEXT        DEFAULT NULL,
  p_content     JSONB       DEFAULT NULL,
  p_status      TEXT        DEFAULT 'processing',
  p_metadata    JSONB       DEFAULT '{}'
)
RETURNS SETOF creations
LANGUAGE plpgsql
SECURITY DEFINER          -- Corre con privilegios del owner; útil para RLS bypass desde funciones internas
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO creations (
    user_id, action_type, prompt, config, model,
    result_url, content, status, metadata
  )
  VALUES (
    p_user_id, p_action_type, p_prompt, p_config, p_model,
    p_result_url, p_content, p_status, p_metadata
  )
  RETURNING *;
END;
$$;

COMMENT ON FUNCTION save_creation IS
  'Inserta una generación en la tabla creations y retorna el registro. '
  'Llamar desde rutas API del backend (usa service role).';


-- ---------------------------------------------------------------------------
-- 7. FUNCIÓN: get_user_creations
-- Retorna todas las creaciones de un usuario, ordenadas por fecha descendente.
-- Uso: SELECT * FROM get_user_creations('user_2abc', 20);
--      SELECT * FROM get_user_creations('user_2abc', 50, 'image');
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_creations(
  p_user_id     TEXT,
  p_limit       INT         DEFAULT 20,
  p_action_type TEXT        DEFAULT NULL   -- opcional: filtrar por tipo
)
RETURNS SETOF creations
LANGUAGE plpgsql
STABLE                    -- No modifica datos; permite optimización por el planner
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM   creations
  WHERE  user_id     = p_user_id
    AND  (p_action_type IS NULL OR action_type = p_action_type)
  ORDER BY created_at DESC
  LIMIT  p_limit;
END;
$$;

COMMENT ON FUNCTION get_user_creations IS
  'Retorna las creaciones más recientes de un usuario. '
  'Parámetro p_action_type opcional para filtrar por tipo.';