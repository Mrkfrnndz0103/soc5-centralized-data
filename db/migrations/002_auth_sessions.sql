CREATE TABLE IF NOT EXISTS auth_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ops_id TEXT NOT NULL REFERENCES users(ops_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_ops_id ON auth_sessions (ops_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at ON auth_sessions (expires_at);
