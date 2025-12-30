# Implementation Plan (Next.js)

## Overview

Roadmap for delivering the Outbound Internal Tool on Next.js, Tailwind, and Supabase.

## Phase 1: Project Setup (Week 1)

### 1.1 Environment Setup
- [x] Initialize Next.js + TypeScript project (App Router)
- [x] Configure Tailwind CSS
- [x] Set up ESLint/Prettier
- [x] Configure Git repository
- [x] Define project structure (`app/`, `components/`, `lib/`, `supabase/`)

### 1.2 Dependencies
```bash
npm install next react react-dom
npm install @supabase/supabase-js @supabase/ssr
npm install @radix-ui/react-* tailwindcss autoprefixer postcss
npm install zod react-hook-form
npm install lucide-react gsap framer-motion recharts
npm install -D typescript @types/react @types/node @types/react-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D playwright @playwright/test
```

### 1.3 Configuration Files
- [x] `tsconfig.json`
- [x] `next.config.mjs`
- [x] `tailwind.config.ts`
- [x] `.eslintrc.js`
- [x] `.env.example`

## Phase 2: Core Infrastructure (Weeks 1-2)

### 2.1 Supabase Setup
- [x] Create Supabase project
- [x] Configure schema, RLS, functions
- [x] Set up auth (Backroom + SeaTalk)
- [x] Edge functions/webhooks for Google Sheets

### 2.2 Authentication System
- [x] Supabase client helpers (`lib/supabase/browser`, `lib/supabase/server`)
- [x] Login route in `app/(auth)/login`
- [x] Backroom authentication (email/password)
- [x] SeaTalk QR authentication flow
- [x] Password change flow
- [x] Protected layouts and middleware

### 2.3 API Layer
- [x] API helpers in `lib/api.ts`
- [x] Route handlers for auth/dispatch/lookups/KPI
- [x] Shared error handling + typed responses

## Phase 3: UI Foundation (Weeks 2-3)

### 3.1 Design System
- [x] CSS variables for theming
- [x] Color palette and typography tokens
- [x] Spacing + layout scale

### 3.2 Core Components
- [x] Button, Input, Label, Card, Select
- [x] Dropdown Menu, Badge, Separator, Scroll Area
- [x] Toast/Toaster, Dialog/Sheet, Tooltip

### 3.3 Layout
- [x] Root layout and metadata
- [x] Sidebar navigation
- [x] Header (theme toggle, notifications)
- [x] Theme preset selector

## Phase 4: Features (Weeks 3-6)

### 4.1 Dashboard (Week 3)
- [x] KPI cards
- [x] Quick actions
- [x] Recent activity feed
- [x] Charts (Recharts)

### 4.2 Dispatch Report (Week 4)
- [x] Editable table with autocomplete
- [x] Processor search and multi-hub auto-split
- [x] Validation + draft auto-save (10s)
- [x] Column visibility + dock confirmation
- [x] Submission + success handling

### 4.3 Dispatch Monitoring (Week 4)
- [x] Real-time status updates
- [x] Filters and badges

### 4.4 Prealert Database (Week 5)
- [x] Data table with filters and pagination
- [x] CSV export
- [x] Realtime updates

### 4.5 KPI & Compliance (Weeks 5-6)
- [ ] MDT page
- [ ] Workstation page
- [ ] Productivity page
- [ ] Intraday page
- [ ] Date range filters and charts

### 4.6 Admin Tools (Week 6)
- [ ] Attendance management
- [ ] Masterfile management
- [ ] Breaktime tracking
- [ ] Leave management
- [ ] Workstation assignment

## Phase 5: Integration (Week 7)

### 5.1 Google Sheets
- [x] Apps Script for sync
- [x] Hourly sync trigger
- [x] Webhook receiver
- [x] Supabase webhook
- [x] Bidirectional testing

### 5.2 SeaTalk
- [x] Webhook deployment
- [x] Deep link registration
- [x] QR generation
- [x] OAuth flow tests
- [x] Session management

## Phase 6: Testing (Week 8)

### 6.1 Unit Tests
- [x] API helpers
- [x] Utilities
- [ ] Components
- [ ] Hooks

### 6.2 Integration Tests
- [ ] Authentication flow
- [ ] Dispatch submission flow
- [ ] Data fetching/display
- [ ] Realtime updates

### 6.3 E2E Tests (Playwright)
- [x] Login scenarios
- [ ] Dispatch workflow
- [ ] Admin operations
- [ ] Error scenarios

### 6.4 Manual Testing
- [ ] Cross-browser
- [ ] Mobile responsiveness
- [ ] Performance/Lighthouse
- [ ] Security

## Phase 7: Documentation (Week 9)

### 7.1 User Docs
- [x] README.md
- [ ] User guide
- [ ] FAQ
- [ ] Tutorials

### 7.2 Technical Docs
- [x] PROJECT_ANALYSIS.md
- [x] IMPLEMENTATION_PLAN.md
- [x] API_REFERENCE.md
- [x] DATABASE_SETUP.md
- [x] DEPLOYMENT.md

### 7.3 Developer Docs
- [ ] Contributing guide
- [ ] Code style
- [ ] Architecture overview (diagrams)
- [ ] Component docs

## Phase 8: Deployment (Week 10)

### 8.1 Pre-deployment
- [ ] Env configuration
- [ ] Security audit
- [ ] Performance optimization
- [ ] Final testing

### 8.2 Deployment
- [ ] Production Supabase setup
- [ ] Production environment variables
- [ ] Deploy to Vercel/Netlify/Docker
- [ ] CDN configuration
- [ ] Domain + SSL

### 8.3 Post-deployment
- [ ] Monitoring (Sentry)
- [ ] Analytics
- [ ] Backups
- [ ] User training
- [ ] Soft launch

## Implementation Details

### Authentication (Next.js)
```typescript
// app/(auth)/login/actions.ts
import { createServerClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = createServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}
```

### Dispatch Submission (Route Handler)
```typescript
// app/api/dispatch/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createServerClient();
  const rows = await request.json();

  const { data, error } = await supabase
    .from('dispatch_reports')
    .insert(rows)
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ created_count: data.length });
}
```

### Draft Auto-Save (Client)
```typescript
useEffect(() => {
  const id = setInterval(() => {
    localStorage.setItem(`dispatch-draft:${userId}`, JSON.stringify(rows));
  }, 10000);
  return () => clearInterval(id);
}, [rows, userId]);
```

## Testing Strategy

### Unit/Integration (Vitest)
```typescript
import { describe, it, expect } from 'vitest';
import { authApi } from '@/lib/api';

describe('authApi', () => {
  it('logs in with valid credentials', async () => {
    const result = await authApi.login('OPS001', 'password123');
    expect(result.data?.user.ops_id).toBe('OPS001');
  });
});
```

### E2E (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test('dispatch submission flow', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  // ...login steps...
  await expect(page.getByText(/submitted successfully/i)).toBeVisible();
});
```

## Deployment Checklist

- [ ] Tests passing
- [ ] Lint clean
- [ ] TypeScript passes
- [ ] Env vars set (see DEPLOYMENT.md)
- [ ] Migrations applied
- [ ] Backups verified
- [ ] Monitoring enabled

## Success Metrics

- Time to interactive < 5s
- API response < 500ms
- Error rate < 1%
- Test coverage > 80%
- Lighthouse > 90
- Dispatch reporting time reduced by 60%

## Risks & Mitigation

- Supabase downtime → retry/backoff + status monitoring
- Performance regressions → Lighthouse/Profiler + bundle analysis
- Security gaps → audits, dependency updates, CSP/headers
- Data quality issues → validation + confirmation dialogs

## Timeline Summary

| Phase | Duration | Status |
|-------|----------|--------|
| Setup | Week 1 | ✅ Complete |
| Infrastructure | Weeks 1-2 | ✅ Complete |
| UI Foundation | Weeks 2-3 | ✅ Complete |
| Features | Weeks 3-6 | 🔄 In Progress |
| Integration | Week 7 | ✅ Complete |
| Testing | Week 8 | 🔄 In Progress |
| Documentation | Week 9 | 🔄 In Progress |
| Deployment | Week 10 | ⏳ Pending |

**Current Status**: Week 7 (70% complete)

## Next Steps

### Immediate
1. Finish KPI pages and admin tools
2. Add Playwright smoke tests for auth/dispatch
3. Enable Sentry and structured logging

### Short-Term
1. Increase test coverage to 60%+
2. Harden CSP/security headers
3. Optimize bundle size with shared layouts/server components

### Medium-Term
1. Production deployment
2. User training and rollout
3. Monitoring and optimization

## Conclusion

The Next.js implementation is on track. Completing KPI/admin modules, raising test coverage, and finalizing deployment hardening will unlock a stable production release.
