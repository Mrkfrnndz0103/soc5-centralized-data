# Database Setup Guide (Supabase)

Complete guide for configuring Supabase for the Outbound Internal Tool (Next.js).

## Overview

The application uses Supabase (PostgreSQL) for:
- Authentication and session management
- Row Level Security (RLS)
- Real-time subscriptions
- Edge functions and webhooks
- Storage (if needed for assets)

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Set a strong database password (store it securely).
3. Choose the region nearest to your users (improves latency).
4. Free tier is sufficient for development.

## Step 2: Get API Credentials

1. Open **Project Settings → API**.
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (client-side)
   - **service_role key**: `eyJhbGc...` (server-side only)
3. Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 3: Run Database Migrations

### Option A: Supabase SQL Editor
1. Open the SQL Editor in the Supabase dashboard.
2. Paste migration SQL from `supabase/migrations/`.
3. Run queries in order.

### Option B: Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## Database Schema (Core Tables)

### 1) users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ops_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('FTE', 'Backroom', 'Data Team', 'Admin')),
  password_hash TEXT NOT NULL,
  must_change_password BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### 2) dispatch_reports
```sql
CREATE TABLE dispatch_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cluster_name TEXT NOT NULL,
  hub_name TEXT NOT NULL,
  station TEXT NOT NULL,
  region TEXT NOT NULL,
  dock_number TEXT NOT NULL,
  processor_name TEXT NOT NULL,
  processor_ops_id TEXT NOT NULL,
  lh_trip TEXT,
  plate_number TEXT,
  fleet_size INTEGER,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Ongoing', 'Completed')),
  submitted_by_ops_id TEXT NOT NULL REFERENCES users(ops_id),
  verified_by_ops_id TEXT REFERENCES users(ops_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE dispatch_reports ENABLE ROW LEVEL SECURITY;
```

### 3) outbound_map
```sql
CREATE TABLE outbound_map (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cluster_name TEXT NOT NULL,
  hub_name TEXT NOT NULL,
  station TEXT NOT NULL,
  region TEXT NOT NULL,
  dock_number TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cluster_name, hub_name)
);

ALTER TABLE outbound_map ENABLE ROW LEVEL SECURITY;
```

### 4) seatalk_sessions
```sql
CREATE TABLE seatalk_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  email TEXT,
  authenticated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '10 minutes'
);

ALTER TABLE seatalk_sessions ENABLE ROW LEVEL SECURITY;
```

## RLS Policies (Examples)

```sql
-- Users can see their own record
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

-- Admins see everything
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'Admin'
    )
  );

-- Dispatch submitter
CREATE POLICY "Users can insert their own dispatch reports"
  ON dispatch_reports FOR INSERT
  WITH CHECK (submitted_by_ops_id = (SELECT ops_id FROM users WHERE id::text = auth.uid()::text));

-- Data team verification
CREATE POLICY "Data Team can update dispatch reports"
  ON dispatch_reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('Data Team', 'Admin')
    )
  );
```

## Functions & Triggers (Examples)

```sql
CREATE OR REPLACE FUNCTION verify_dispatch_rows(
  p_row_ids UUID[],
  p_verified_by_ops_id TEXT
) RETURNS JSON AS $$
BEGIN
  UPDATE dispatch_reports
  SET status = 'Completed',
      verified_by_ops_id = p_verified_by_ops_id,
      updated_at = NOW()
  WHERE id = ANY(p_row_ids);

  RETURN json_build_object(
    'success', true,
    'verified_count', array_length(p_row_ids, 1)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Seed Data (Examples)

```sql
-- Admin user
INSERT INTO users (ops_id, name, email, role, password_hash, must_change_password)
VALUES (
  'ADMIN001',
  'System Administrator',
  'admin@shopeemobile-external.com',
  'Admin',
  crypt('SOC5-Outbound', gen_salt('bf')),
  true
);

-- Outbound map sample
INSERT INTO outbound_map (cluster_name, hub_name, station, region, dock_number)
VALUES
  ('Cluster A', 'Hub 1', 'Station X', 'North', 'D01'),
  ('Cluster A', 'Hub 2', 'Station X', 'North', 'D02'),
  ('Cluster B', 'Hub 3', 'Station Y', 'South', 'D03'),
  ('Cluster C', 'Hub 4', 'Station Z', 'East', 'D04');
```

## Webhooks (Google Sheets Example)

```sql
CREATE OR REPLACE FUNCTION notify_dispatch_submitted()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'event', 'dispatch_submitted',
      'data', row_to_json(NEW)
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_dispatch_submitted
  AFTER INSERT ON dispatch_reports
  FOR EACH ROW
  EXECUTE FUNCTION notify_dispatch_submitted();
```

## Testing Connectivity (Node)

Create `test-connection.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testConnection() {
  const { data, error } = await supabase.from('users').select('count').single();
  if (error) console.error('Connection failed:', error);
  else console.log('Connection successful!', data);
}

testConnection();
```

Run: `node --loader ts-node/esm test-connection.ts`

## Troubleshooting

### Connection Refused
- Check `NEXT_PUBLIC_SUPABASE_URL`
- Ensure project is active
- Verify network/firewall settings

### RLS Policy Errors
- Confirm RLS enabled
- Verify policies for the affected table
- Check authenticated user roles

### Migration Errors
- Run migrations in order
- Ensure extensions `uuid-ossp` and `pgcrypto` are enabled
- Validate SQL syntax

## Backup & Recovery

### Manual Backup
Use Supabase dashboard backups or:
```bash
pg_dump -h db.your-project.supabase.co \
  -U postgres \
  -d postgres \
  -f backup_$(date +%Y%m%d).sql
```

### Restore
```bash
psql -h db.your-project.supabase.co \
  -U postgres \
  -d postgres \
  -f backup_YYYYMMDD.sql
```

## Next Steps

- Wire Supabase clients in `lib/supabase/browser.ts` and `lib/supabase/server.ts`
- Configure SeaTalk authentication and Google Sheets webhooks
- Test all database operations against RLS policies
- Set up monitoring and alerts

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
