CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  password    TEXT,
  name        TEXT,
  avatar      TEXT,
  role        TEXT NOT NULL DEFAULT 'viewer'
                CHECK (role IN (
                  'founder','ceo','cto','coo','lead-engineer',
                  'senior-engineer','engineer','lead-designer',
                  'designer','product-manager','devops',
                  'ai-engineer','sales','marketing','advisor','viewer'
                )),
  provider    TEXT NOT NULL DEFAULT 'email'
                CHECK (provider IN ('email','google','github')),
  provider_id TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT UNIQUE NOT NULL,
  user_agent    TEXT,
  ip            TEXT,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx    ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_refresh_idx    ON sessions(refresh_token);
CREATE INDEX IF NOT EXISTS users_email_idx         ON users(email);
CREATE INDEX IF NOT EXISTS users_provider_idx      ON users(provider, provider_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

  CREATE TYPE project_status AS ENUM (
  'draft', 'pending_approval', 'active', 'paused', 'completed', 'cancelled'
);

CREATE TYPE milestone_status AS ENUM (
  'pending', 'in_progress', 'pending_approval', 'approved', 'completed'
);

CREATE TYPE approval_status AS ENUM (
  'pending', 'approved', 'rejected', 'revision_requested'
);

CREATE TABLE projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  description   TEXT,
  status        project_status NOT NULL DEFAULT 'draft',
  price         DECIMAL(10,2),
  price_approved BOOLEAN DEFAULT false,
  client_id     UUID REFERENCES users(id),
  created_by    UUID REFERENCES users(id),
  start_date    TIMESTAMPTZ,
  end_date      TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE project_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

CREATE TABLE milestones (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  status        milestone_status NOT NULL DEFAULT 'pending',
  requires_approval BOOLEAN DEFAULT false,
  order_index   INT NOT NULL DEFAULT 0,
  due_date      TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE approvals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id  UUID REFERENCES milestones(id) ON DELETE CASCADE,
  type          TEXT NOT NULL,
  status        approval_status NOT NULL DEFAULT 'pending',
  requested_by  UUID REFERENCES users(id),
  approved_by   UUID REFERENCES users(id),
  note          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  amount        DECIMAL(10,2) NOT NULL,
  percentage    INT,
  description   TEXT,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','requested','paid','overdue')),
  due_date      TIMESTAMPTZ,
  paid_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE companies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  logo_url    TEXT,
  website     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE testimonials (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   UUID REFERENCES companies(id) ON DELETE SET NULL,
  client_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  quote        TEXT NOT NULL,
  author_name  TEXT NOT NULL,
  author_title TEXT,
  author_image TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  order_index  INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON testimonials(company_id);
CREATE INDEX ON testimonials(client_id);
CREATE INDEX ON testimonials(is_active);

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS reset_token         TEXT,
  ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS users_reset_token_idx ON users(reset_token);