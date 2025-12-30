# Database Setup Guide

Complete guide for setting up Supabase database for the Outbound Internal Tool.

## Overview

The application uses Supabase (PostgreSQL) as the backend database with:
- User authentication
- Row Level Security (RLS)
- Real-time subscriptions
- Database functions
- Webhooks

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create account
3. Click "New Project"
4. Fill in details:
   - **Name**: Outbound Internal Tool
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development

5. Wait for project to be created (~2 minutes)

## Step 2: Get API Credentials

1. Go to Project Settings → API
2. Copy the following:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...`
   - **service_role key**: `eyJhbGc...` (keep secret!)

3. Add to `.env`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 3: Run Database Migrations

### Option A: Using Supabase SQL Editor

1. Go to SQL Editor in Supabase dashboard
2. Create new query
3. Copy and paste migration SQL
4. Run query

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Database Schema

### Core Tables

#### 1. Users Table

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

-- Indexes
CREATE INDEX idx_users_ops_id ON users(ops_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'Admin'
    )
  );
```

#### 2. Dispatch Reports Table

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
  submitted_by_ops_id TEXT NOT NULL,
  verified_by_ops_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (submitted_by_ops_id) REFERENCES users(ops_id),
  FOREIGN KEY (verified_by_ops_id) REFERENCES users(ops_id)
);

-- Indexes
CREATE INDEX idx_dispatch_reports_region ON dispatch_reports(region);
CREATE INDEX idx_dispatch_reports_status ON dispatch_reports(status);
CREATE INDEX idx_dispatch_reports_created_at ON dispatch_reports(created_at DESC);
CREATE INDEX idx_dispatch_reports_submitted_by ON dispatch_reports(submitted_by_ops_id);

-- RLS Policies
ALTER TABLE dispatch_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all dispatch reports"
  ON dispatch_reports FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own dispatch reports"
  ON dispatch_reports FOR INSERT
  WITH CHECK (submitted_by_ops_id = (SELECT ops_id FROM users WHERE id::text = auth.uid()::text));

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

#### 3. Outbound Map Table

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

-- Indexes
CREATE INDEX idx_outbound_map_cluster ON outbound_map(cluster_name);
CREATE INDEX idx_outbound_map_region ON outbound_map(region);
CREATE INDEX idx_outbound_map_active ON outbound_map(active);

-- RLS Policies
ALTER TABLE outbound_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active outbound map"
  ON outbound_map FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage outbound map"
  ON outbound_map FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'Admin'
    )
  );
```

#### 4. SeaTalk Sessions Table

```sql
CREATE TABLE seatalk_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  email TEXT,
  authenticated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '10 minutes'
);

-- Index
CREATE INDEX idx_seatalk_sessions_session_id ON seatalk_sessions(session_id);
CREATE INDEX idx_seatalk_sessions_expires_at ON seatalk_sessions(expires_at);

-- RLS Policies
ALTER TABLE seatalk_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert sessions"
  ON seatalk_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view their session"
  ON seatalk_sessions FOR SELECT
  USING (true);

-- Auto-delete expired sessions
CREATE OR REPLACE FUNCTION delete_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM seatalk_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (run every hour)
SELECT cron.schedule(
  'delete-expired-sessions',
  '0 * * * *',
  'SELECT delete_expired_sessions();'
);
```

## Database Functions

### 1. Authenticate User

```sql
CREATE OR REPLACE FUNCTION authenticate_user(
  p_ops_id TEXT,
  p_password TEXT
)
RETURNS JSON AS $$
DECLARE
  v_user users;
  v_token TEXT;
BEGIN
  -- Get user
  SELECT * INTO v_user
  FROM users
  WHERE ops_id = p_ops_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Invalid credentials');
  END IF;
  
  -- Verify password (simplified - use proper hashing in production)
  IF v_user.password_hash != crypt(p_password, v_user.password_hash) THEN
    RETURN json_build_object('error', 'Invalid credentials');
  END IF;
  
  -- Generate token (simplified)
  v_token := encode(gen_random_bytes(32), 'base64');
  
  -- Return user data
  RETURN json_build_object(
    'user', row_to_json(v_user),
    'token', v_token
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Change Password

```sql
CREATE OR REPLACE FUNCTION change_user_password(
  p_ops_id TEXT,
  p_old_password TEXT,
  p_new_password TEXT
)
RETURNS JSON AS $$
DECLARE
  v_user users;
BEGIN
  -- Get user
  SELECT * INTO v_user
  FROM users
  WHERE ops_id = p_ops_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'User not found');
  END IF;
  
  -- Verify old password
  IF v_user.password_hash != crypt(p_old_password, v_user.password_hash) THEN
    RETURN json_build_object('error', 'Invalid old password');
  END IF;
  
  -- Update password
  UPDATE users
  SET password_hash = crypt(p_new_password, gen_salt('bf')),
      must_change_password = false,
      updated_at = NOW()
  WHERE ops_id = p_ops_id;
  
  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Verify Dispatch Rows

```sql
CREATE OR REPLACE FUNCTION verify_dispatch_rows(
  p_row_ids UUID[],
  p_verified_by_ops_id TEXT
)
RETURNS JSON AS $$
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

## Step 4: Seed Initial Data

### Create Admin User

```sql
INSERT INTO users (ops_id, name, email, role, password_hash, must_change_password)
VALUES (
  'ADMIN001',
  'System Administrator',
  'admin@shopeemobile-external.com',
  'Admin',
  crypt('SOC5-Outbound', gen_salt('bf')),
  true
);
```

### Sample Outbound Map Data

```sql
INSERT INTO outbound_map (cluster_name, hub_name, station, region, dock_number)
VALUES
  ('Cluster A', 'Hub 1', 'Station X', 'North', 'D01'),
  ('Cluster A', 'Hub 2', 'Station X', 'North', 'D02'),
  ('Cluster B', 'Hub 3', 'Station Y', 'South', 'D03'),
  ('Cluster C', 'Hub 4', 'Station Z', 'East', 'D04');
```

## Step 5: Configure Webhooks

For Google Sheets integration:

```sql
-- Create webhook function
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

-- Create trigger
CREATE TRIGGER on_dispatch_submitted
  AFTER INSERT ON dispatch_reports
  FOR EACH ROW
  EXECUTE FUNCTION notify_dispatch_submitted();
```

## Step 6: Test Connection

Create a test file `test-connection.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testConnection() {
  const { data, error } = await supabase
    .from('users')
    .select('count')
  
  if (error) {
    console.error('Connection failed:', error)
  } else {
    console.log('Connection successful!', data)
  }
}

testConnection()
```

Run: `node test-connection.js`

## Troubleshooting

### Connection Refused
- Check VITE_SUPABASE_URL is correct
- Verify project is active in Supabase dashboard
- Check network/firewall settings

### RLS Policy Errors
- Ensure RLS is enabled on tables
- Verify policies are created correctly
- Check user authentication

### Migration Errors
- Run migrations in order
- Check for syntax errors
- Verify extensions are enabled (uuid-ossp, pgcrypto)

## Backup and Recovery

### Manual Backup
1. Go to Database → Backups in Supabase dashboard
2. Click "Create Backup"
3. Download backup file

### Automated Backups
Supabase Pro plan includes automated daily backups.

### Restore from Backup
1. Go to Database → Backups
2. Select backup
3. Click "Restore"

## Next Steps

- Set up Google Sheets integration
- Configure SeaTalk authentication
- Test all database operations
- Set up monitoring and alerts

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
