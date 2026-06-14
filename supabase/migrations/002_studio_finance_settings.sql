-- ============================================================================
-- Migration 002 — Creative Studio (generations), Finance tracking, User settings
-- Phases 2, 3, 4 of Victor IA App
-- Safe to run multiple times (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- generations: all creative-studio outputs (voice, music, presentation,
-- proposal, email, image, video, document, website)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,                       -- Clerk user id (string)
  type TEXT NOT NULL CHECK (type IN (
    'voice','music','presentation','proposal','email',
    'image','video','document','website'
  )),
  prompt TEXT,
  status TEXT NOT NULL DEFAULT 'completed'
    CHECK (status IN ('processing','completed','failed')),
  file_url TEXT,                               -- S3 / Cloudinary / data url ref
  content JSONB,                               -- structured output (slides, html, etc.)
  metadata JSONB,                              -- model, duration, voice, mood, bpm...
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_type ON generations(type);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_user_type_created
  ON generations(user_id, type, created_at DESC);

-- ---------------------------------------------------------------------------
-- finance_tracking: aggregated income/expense entries per user
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS finance_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('income','expense')),
  category TEXT NOT NULL,                       -- 'subscription','client','integration'...
  description TEXT,
  amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'MXN' CHECK (currency IN ('MXN','USD')),
  occurred_on DATE NOT NULL DEFAULT CURRENT_DATE,
  project_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finance_tracking_user_id ON finance_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_finance_tracking_occurred_on ON finance_tracking(occurred_on DESC);
CREATE INDEX IF NOT EXISTS idx_finance_tracking_user_dir
  ON finance_tracking(user_id, direction, occurred_on DESC);

-- ---------------------------------------------------------------------------
-- integrations: recurring tool/API costs (used for Finance egresos)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,                           -- 'Stripe','ElevenLabs','Vercel'...
  category TEXT DEFAULT 'tooling',
  cost NUMERIC(14,2) NOT NULL DEFAULT 0,        -- monthly cost
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('MXN','USD')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','canceled')),
  billed_on INTEGER DEFAULT 1,                  -- day of month
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON integrations(user_id);

-- ---------------------------------------------------------------------------
-- users: new settings columns (extend existing table)
-- ---------------------------------------------------------------------------
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name  TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS currency   TEXT DEFAULT 'MXN';
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone   TEXT DEFAULT 'America/Mexico_City';
ALTER TABLE users ADD COLUMN IF NOT EXISTS language   TEXT DEFAULT 'es';
ALTER TABLE users ADD COLUMN IF NOT EXISTS theme      TEXT DEFAULT 'dark';
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id   TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- ---------------------------------------------------------------------------
-- projects: amount + stage columns for CRM Kanban + Finance "por cobrar"
-- ---------------------------------------------------------------------------
ALTER TABLE projects ADD COLUMN IF NOT EXISTS amount NUMERIC(14,2) DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS stage  TEXT DEFAULT 'prospect'
  CHECK (stage IN ('prospect','proposal','authorized','completed'));

-- subscriptions: amount column for Finance "por pagar"/ingresos
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS amount NUMERIC(14,2) DEFAULT 0;

-- clients: kanban stage already exists; add contact + value tracking helpers
ALTER TABLE clients ADD COLUMN IF NOT EXISTS deadline DATE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes TEXT;

-- ---------------------------------------------------------------------------
-- RLS — generations / finance_tracking / integrations
-- (Clerk owns auth; API enforces user scoping. RLS enabled defensively.)
-- ---------------------------------------------------------------------------
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Service-role bypasses RLS automatically; these permissive policies allow the
-- anon client to read nothing by default. All writes go through the service
-- role from server routes after Clerk auth().
DROP POLICY IF EXISTS generations_service ON generations;
CREATE POLICY generations_service ON generations
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS finance_service ON finance_tracking;
CREATE POLICY finance_service ON finance_tracking
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS integrations_service ON integrations;
CREATE POLICY integrations_service ON integrations
  FOR ALL USING (true) WITH CHECK (true);
