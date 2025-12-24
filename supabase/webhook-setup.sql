-- Supabase Webhook Setup for Dispatch Reports
-- This creates a database trigger that sends data to Google Sheets

-- 1. Create webhook function
CREATE OR REPLACE FUNCTION notify_dispatch_report()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT := 'YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL';
  payload JSONB;
BEGIN
  -- Build payload
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'record', row_to_json(NEW)
  );
  
  -- Send to webhook (requires pg_net extension)
  PERFORM net.http_post(
    url := webhook_url,
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := payload::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create trigger on dispatch_reports table
DROP TRIGGER IF EXISTS dispatch_report_webhook ON dispatch_reports;

CREATE TRIGGER dispatch_report_webhook
  AFTER INSERT OR UPDATE ON dispatch_reports
  FOR EACH ROW
  EXECUTE FUNCTION notify_dispatch_report();

-- 3. Enable pg_net extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 4. Grant permissions
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;

-- Test the webhook (optional)
-- INSERT INTO dispatch_reports (cluster_name, station_name, region, submitted_by_ops_id)
-- VALUES ('Test Cluster', 'Test Station', 'NCR', 'TEST001');
