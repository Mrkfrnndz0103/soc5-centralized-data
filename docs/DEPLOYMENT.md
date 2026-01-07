# Deployment Guide

Complete guide for deploying the Outbound Internal Tool to production.

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] TypeScript compilation successful (`npm run build`)
- [ ] Code review completed
- [ ] Documentation updated

### Security
- [ ] Security audit completed
- [ ] Dependencies updated
- [ ] No exposed secrets in code
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] CORS configured properly

### Performance
- [ ] Bundle size optimized (<500KB gzipped)
- [ ] Images optimized
- [ ] Lighthouse score >90
- [ ] Load time <3s
- [ ] API response time <500ms

### Database
- [ ] Migrations tested
- [ ] Backup strategy in place
- [ ] RLS policies verified
- [ ] Indexes created
- [ ] Seed data prepared

## Deployment Options

### Option 1: Vercel (Recommended)

**Pros**: Easy setup, automatic deployments, CDN, serverless functions
**Cons**: Vendor lock-in

#### Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Configure Project**
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

4. **Add Environment Variables**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

5. **Deploy**
```bash
npm run build
vercel --prod
```

6. **Custom Domain** (Optional)
```bash
vercel domains add yourdomain.com
```

### Option 2: Netlify

**Pros**: Easy setup, form handling, split testing
**Cons**: Build minutes limited on free tier

#### Steps:

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Configure Project**
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

4. **Deploy**
```bash
npm run build
netlify deploy --prod
```

### Option 3: AWS S3 + CloudFront

**Pros**: Scalable, cost-effective, full control
**Cons**: More complex setup

#### Steps:

1. **Build Application**
```bash
npm run build
```

2. **Create S3 Bucket**
```bash
aws s3 mb s3://outbound-tool-prod
```

3. **Configure Bucket for Static Hosting**
```bash
aws s3 website s3://outbound-tool-prod \
  --index-document index.html \
  --error-document index.html
```

4. **Upload Files**
```bash
aws s3 sync dist/ s3://outbound-tool-prod --delete
```

5. **Create CloudFront Distribution**
```bash
aws cloudfront create-distribution \
  --origin-domain-name outbound-tool-prod.s3.amazonaws.com \
  --default-root-object index.html
```

6. **Configure Route 53** (Optional)
Set up DNS records for custom domain

### Option 4: Docker + Self-Hosted

**Pros**: Full control, portable, consistent environments
**Cons**: Requires infrastructure management

#### Steps:

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Create nginx.conf**
```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api {
    proxy_pass https://your-supabase-url.supabase.co;
  }
}
```

3. **Build Image**
```bash
docker build -t outbound-tool:latest .
```

4. **Run Container**
```bash
docker run -d -p 80:80 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  outbound-tool:latest
```

## Environment Configuration

### Production Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key

# Application
NEXT_PUBLIC_APP_NAME=SOC5 Ops Internal Tool
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production

# Features
NEXT_PUBLIC_ENABLE_DRAFT_AUTOSAVE=true
NEXT_PUBLIC_DRAFT_AUTOSAVE_INTERVAL=10000
NEXT_PUBLIC_MAX_DISPATCH_ROWS=10

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_production_client_id

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

## Database Migration

### Production Database Setup

1. **Create Production Supabase Project**
2. **Run Migrations**
```bash
supabase db push --project-ref prod-project-ref
```

3. **Seed Initial Data**
```sql
-- Create admin user
INSERT INTO users (ops_id, name, email, role, password_hash)
VALUES ('ADMIN001', 'Admin', 'admin@company.com', 'Admin', crypt('password', gen_salt('bf')));

-- Import outbound map data
COPY outbound_map FROM '/path/to/outbound_map.csv' CSV HEADER;
```

4. **Verify RLS Policies**
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

## Post-Deployment

### 1. Smoke Testing

Test critical paths:
- [ ] Login (Backroom)
- [ ] Login (SeaTalk)
- [ ] Submit dispatch report
- [ ] View prealert database
- [ ] Check KPI dashboard
- [ ] Admin functions

### 2. Monitoring Setup

#### Sentry (Error Tracking)

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react"

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: "production",
    tracesSampleRate: 0.1,
  })
}
```

#### Google Analytics

```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. Performance Monitoring

Use Lighthouse CI:

```bash
npm install -g @lhci/cli

lhci autorun --config=lighthouserc.json
```

Create `lighthouserc.json`:
```json
{
  "ci": {
    "collect": {
      "url": ["https://your-domain.com"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

### 4. Backup Configuration

#### Automated Database Backups

Supabase Pro includes automated backups. For manual backups:

```bash
# Backup
pg_dump -h db.your-project.supabase.co \
  -U postgres \
  -d postgres \
  -f backup_$(date +%Y%m%d).sql

# Restore
psql -h db.your-project.supabase.co \
  -U postgres \
  -d postgres \
  -f backup_20240101.sql
```

### 5. CDN Configuration

Configure caching headers:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location / {
  add_header Cache-Control "no-cache";
}
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Rollback Strategy

### Quick Rollback

#### Vercel
```bash
vercel rollback
```

#### Netlify
```bash
netlify rollback
```

#### Manual
1. Identify last working deployment
2. Checkout that commit
3. Rebuild and redeploy
4. Verify functionality

## Security Hardening

### 1. Content Security Policy

Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; 
           script-src 'self' 'unsafe-inline'; 
           style-src 'self' 'unsafe-inline'; 
           img-src 'self' data: https:; 
           connect-src 'self' https://*.supabase.co;">
```

### 2. Security Headers

Configure in hosting platform:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 3. Rate Limiting

Implement at API level or use Cloudflare.

## Monitoring Checklist

Post-deployment monitoring:
- [ ] Error rate < 1%
- [ ] Response time < 500ms
- [ ] Uptime > 99.9%
- [ ] CPU usage < 70%
- [ ] Memory usage < 80%
- [ ] Database connections < 80% of limit

## Troubleshooting

### Build Failures
```bash
# Clear cache
rm -rf node_modules dist .vite
npm install
npm run build
```

### Environment Variable Issues
- Verify all required variables are set
- Check variable names (must start with NEXT_PUBLIC_)
- Restart build after changes

### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies
- Verify network connectivity

### Performance Issues
- Check bundle size
- Analyze with Lighthouse
- Review network requests
- Check database query performance

## Support

For deployment issues:
- Check deployment logs
- Review error monitoring (Sentry)
- Contact DevOps team
- Refer to platform documentation

## Maintenance

### Regular Tasks
- Weekly: Review error logs
- Monthly: Update dependencies
- Quarterly: Security audit
- Annually: Performance review

### Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Conclusion

Follow this guide for successful production deployment. Always test thoroughly in staging before deploying to production.
