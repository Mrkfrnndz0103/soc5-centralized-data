# Deployment Checklist

## Pre-Deployment

### Supabase Setup
- [ ] Create Supabase project
- [ ] Copy project URL and anon key
- [ ] Run all SQL scripts from `SUPABASE_SETUP.md`
- [ ] Enable required extensions (uuid-ossp, pgcrypto, pg_net)
- [ ] Create database tables
- [ ] Create database functions
- [ ] Enable Row Level Security policies
- [ ] Create initial admin user
- [ ] Test database connection

### Google Sheets Setup
- [ ] Create Google Sheet with required tabs:
  - [ ] Users (columns: ops_id, name, email, role, active)
  - [ ] Outbound Map (columns: cluster_name, hub_name, region, dock_number, station_code, active)
  - [ ] Dispatch Reports (auto-populated by webhook)
- [ ] Add sample data to Users and Outbound Map
- [ ] Share sheet with appropriate team members

### Google Apps Script - Sync Script
- [ ] Open Extensions → Apps Script in Google Sheets
- [ ] Copy code from `supabase/google-sheets-sync.gs`
- [ ] Update SUPABASE_URL with your project URL
- [ ] Update SUPABASE_KEY with your anon key
- [ ] Save the script
- [ ] Run `syncAllData()` manually to test
- [ ] Check Supabase tables for synced data
- [ ] Run `setupTriggers()` to enable hourly sync
- [ ] Verify trigger is created in Apps Script triggers

### Google Apps Script - Webhook Receiver
- [ ] Create new standalone Apps Script project
- [ ] Copy code from `supabase/webhook-receiver.gs`
- [ ] Deploy as Web App:
  - [ ] Click Deploy → New deployment
  - [ ] Select "Web app" as type
  - [ ] Set "Execute as" to your account
  - [ ] Set "Who has access" to "Anyone"
  - [ ] Click Deploy
- [ ] Copy the webhook URL
- [ ] Test webhook with `testWebhook()` function

### Supabase Webhook Configuration
- [ ] Open Supabase SQL Editor
- [ ] Copy code from `supabase/webhook-setup.sql`
- [ ] Replace `YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL` with actual URL
- [ ] Execute the SQL
- [ ] Verify trigger is created
- [ ] Test by inserting a dispatch report manually

### Frontend Configuration
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Update environment variables:
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
  - [ ] VITE_GOOGLE_CLIENT_ID (for FTE login)
- [ ] Run `npm run dev` to test locally
- [ ] Test login with admin credentials
- [ ] Test dispatch report submission
- [ ] Verify data appears in Google Sheets

## Production Deployment

### Build Application
- [ ] Run `npm run build`
- [ ] Test production build with `npm run preview`
- [ ] Verify all features work in production mode

### Deploy Frontend
Choose one deployment method:

#### Option 1: Vercel
- [ ] Connect GitHub repository to Vercel
- [ ] Add environment variables in Vercel dashboard
- [ ] Deploy
- [ ] Test production URL

#### Option 2: Netlify
- [ ] Connect GitHub repository to Netlify
- [ ] Add environment variables in Netlify dashboard
- [ ] Deploy
- [ ] Test production URL

#### Option 3: AWS S3 + CloudFront
- [ ] Create S3 bucket
- [ ] Enable static website hosting
- [ ] Upload build files
- [ ] Create CloudFront distribution
- [ ] Configure custom domain (optional)
- [ ] Test production URL

### Google OAuth Setup (for FTE login)
- [ ] Go to Google Cloud Console
- [ ] Create OAuth 2.0 credentials
- [ ] Add authorized JavaScript origins:
  - [ ] http://localhost:5173 (development)
  - [ ] https://your-production-domain.com
- [ ] Add authorized redirect URIs
- [ ] Copy Client ID to environment variables
- [ ] Test Google login

### Security Configuration
- [ ] Review Supabase RLS policies
- [ ] Verify API keys are not exposed in frontend code
- [ ] Enable CORS in Supabase for production domain
- [ ] Set up rate limiting (if needed)
- [ ] Configure authentication timeout settings

## Post-Deployment

### Testing
- [ ] Test all authentication methods:
  - [ ] Backroom login with Ops ID
  - [ ] FTE login with Google OAuth
  - [ ] Password change functionality
- [ ] Test dispatch report workflow:
  - [ ] Create new dispatch report
  - [ ] Verify auto-complete works
  - [ ] Submit report
  - [ ] Check Supabase database
  - [ ] Verify webhook sent data to Google Sheets
- [ ] Test KPI dashboards
- [ ] Test admin functions
- [ ] Test on mobile devices
- [ ] Test on different browsers

### Monitoring Setup
- [ ] Set up Supabase monitoring alerts
- [ ] Monitor Google Apps Script execution logs
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up backup schedule for Supabase

### Documentation
- [ ] Update README with production URLs
- [ ] Document admin procedures
- [ ] Create user guide
- [ ] Document troubleshooting steps
- [ ] Share credentials securely with team

### Training
- [ ] Train backroom users on dispatch report entry
- [ ] Train data team on verification process
- [ ] Train admins on Google Sheets management
- [ ] Provide support contact information

## Maintenance

### Daily
- [ ] Monitor error logs
- [ ] Check webhook execution status

### Weekly
- [ ] Review Google Apps Script execution logs
- [ ] Check Supabase database size
- [ ] Review user feedback

### Monthly
- [ ] Update dependencies (`npm update`)
- [ ] Review and optimize database queries
- [ ] Backup Google Sheets data
- [ ] Review security policies

## Rollback Plan

If issues occur:
1. [ ] Revert to previous deployment
2. [ ] Check error logs in Supabase
3. [ ] Check Google Apps Script logs
4. [ ] Verify environment variables
5. [ ] Test database connection
6. [ ] Contact support if needed

## Support Contacts

- **Supabase Support**: https://supabase.com/support
- **Google Apps Script**: https://developers.google.com/apps-script
- **Development Team**: [Add contact info]
- **System Admin**: [Add contact info]
