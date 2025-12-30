# Deployment Guide (Next.js)

Deploying the Outbound Internal Tool to production with Next.js, Supabase, and Tailwind.

## Pre-Deployment Checklist

### Code Quality
- [ ] Tests passing (`npm test`)
- [ ] ESLint clean (`npm run lint`)
- [ ] TypeScript passes (`npm run build`)
- [ ] Code review completed
- [ ] Documentation updated

### Security
- [ ] Dependency audit
- [ ] Secrets managed (no keys in repo)
- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] CSP/security headers set

### Performance
- [ ] Lighthouse > 90
- [ ] Bundle analysis reviewed
- [ ] API p95 < 500ms
- [ ] Image optimization verified

### Database
- [ ] Migrations tested
- [ ] Backups confirmed
- [ ] RLS policies verified
- [ ] Indexes created
- [ ] Seed data prepared

## Deployment Options

### 1) Vercel (Recommended for Next.js)

Pros: zero-config, edge network, previews.  
Cons: vendor lock-in.

Steps:
1. Install CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Add env vars:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID production
```
4. Deploy:
```bash
npm run build
vercel --prod
```
5. Optional: add custom domain
```bash
vercel domains add yourdomain.com
```

### 2) Netlify (with Next.js runtime)

Pros: simple setup, good previews.  
Cons: build minutes on free tier.

Steps:
1. Install CLI: `npm install -g netlify-cli`
2. Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```
3. Deploy:
```bash
npm run build
netlify deploy --prod
```

### 3) Docker (Self-Hosted)

Pros: full control and portability.  
Cons: manage your own infra.

Dockerfile:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
ENV PORT=3000
CMD ["npm", "run", "start"]
```

Build and run:
```bash
docker build -t outbound-next:latest .
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  -e SUPABASE_SERVICE_ROLE_KEY=... \
  outbound-next:latest
```

### 4) AWS (ECS/Fargate or Amplify)

- Use the Docker image above for ECS/Fargate.
- For Amplify, connect the repo and set build commands: `npm ci && npm run build`.
- Configure env vars in the Amplify console.

## Environment Configuration

### Production Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_prod_anon
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_NAME=SOC5 Ops Internal Tool
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_MAX_DISPATCH_ROWS=10

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_prod_client_id

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

## Database Migration (Production)

1. Create production Supabase project.
2. Run migrations:
```bash
supabase db push --project-ref prod-project-ref
```
3. Seed data (admin user, outbound map).
4. Verify RLS policies:
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

## Post-Deployment

### Smoke Tests
- [ ] Login (Backroom)
- [ ] Login (SeaTalk)
- [ ] Dispatch submission
- [ ] Prealert filtering
- [ ] KPI dashboard loads
- [ ] Admin functions (role-based)

### Monitoring
- Sentry for error tracking (enable in `app/layout.tsx`)
- Analytics (GA or similar)
- Supabase logs for database performance

### Performance Monitoring
- Lighthouse CI
- Next.js bundle analyzer (optional)

## CI/CD (GitHub Actions Example)

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Rollback Strategy

- **Vercel**: `vercel rollback`
- **Netlify**: `netlify rollback`
- **Docker**: deploy previous image tag
- **Manual**: redeploy last known-good commit

## Security Hardening

### Content Security Policy (example)
Configure via hosting platform headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none';
```

### Additional Headers
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Rate Limiting
- Apply at route-handler layer or via CDN/WAF.

## Troubleshooting

### Build Failures
```bash
rm -rf .next
npm run build
```

### Env Variable Issues
- Ensure all `NEXT_PUBLIC_*` and server-only keys are set
- Redeploy after changes

### Database Connection Issues
- Verify Supabase URL/keys
- Check RLS policies
- Confirm network reachability

### Performance Issues
- Analyze bundle (`next build --profiling`)
- Enable server components where possible
- Optimize queries and indexes

## Maintenance

- Weekly: review error logs
- Monthly: dependency updates + audit
- Quarterly: security and performance review
- Before releases: refresh backups and verify rollback

## Conclusion

Follow this guide to deploy the Next.js version of the Outbound Internal Tool. Validate with smoke tests, enable monitoring, and keep environment variables in sync with Supabase.
