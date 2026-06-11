-- Users table (extends Clerk)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  credits INT DEFAULT 100,
  subscription_status TEXT DEFAULT 'free', -- free, trial, pro, enterprise
  subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Prospects table (CRM)
CREATE TABLE IF NOT EXISTS prospects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  stage TEXT NOT NULL DEFAULT 'lead', -- lead, contacted, qualified, proposal, negotiation, won, lost
  value DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Generations table (Content)
CREATE TABLE IF NOT EXISTS generations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- image, video, presentation, email, etc
  prompt TEXT NOT NULL,
  result_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  credits_used INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent executions
CREATE TABLE IF NOT EXISTS agent_executions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,
  input JSONB,
  output TEXT,
  status TEXT DEFAULT 'completed', -- pending, processing, completed, failed
  credits_used INT DEFAULT 0,
  execution_time_ms INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL, -- starter, pro, enterprise
  status TEXT NOT NULL, -- active, past_due, canceled
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_data JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can read own prospects" ON prospects
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own prospects" ON prospects
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own prospects" ON prospects
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own prospects" ON prospects
  FOR DELETE USING (auth.uid()::text = user_id);

-- Similar policies for other tables
CREATE POLICY "Users can read own generations" ON generations
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own generations" ON generations
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Indexes for performance
CREATE INDEX idx_prospects_user_id ON prospects(user_id);
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_agent_executions_user_id ON agent_executions(user_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
