# Project Analysis: Outbound Internal Tool (Next.js)

## Executive Summary

The Outbound Internal Tool is an enterprise-grade web application for SOC5 Outbound Operations. It provides dispatch management, KPI tracking, and administrative tooling with a responsive, Next.js-based experience backed by Supabase.

## Project Scope

### Objectives
1. Streamline dispatch report submission with validation and auto-save
2. Provide real-time KPI monitoring and analytics
3. Centralize team administration and attendance tracking
4. Integrate with Google Sheets for master data and exports
5. Support dual authentication (Backroom + FTE via SeaTalk)

### Target Users
- Backroom staff (dispatch coordinators and processors)
- FTE (operations managers and supervisors)
- Data Team (analytics and reporting)
- Admin (system administrators)

## Technical Architecture

### High-Level Architecture

```
Next.js (App Router)                         Supabase (PostgreSQL)
├─ App routes (server/client components)     ├─ Auth (email + SeaTalk)
├─ Route Handlers / Server Actions           ├─ RLS-secured tables
├─ Shared layouts + metadata                 ├─ Realtime channels
├─ UI components (Radix + Tailwind)          ├─ Storage + edge functions
└─ Supabase client (browser/server helpers)  └─ Webhooks to Google Sheets
```

### Component Hierarchy (App Shell)

```
RootLayout
└─ Providers (Theme, Supabase, Auth)
   └─ Shell
      ├─ Sidebar (navigation, user info)
      ├─ Header (theme toggle, notifications)
      └─ Main Content (per-route pages)
         ├─ Dashboard
         ├─ Dispatch Report
         ├─ Dispatch Monitoring
         ├─ Prealert Database
         ├─ KPI Pages
         └─ Admin Suite
```

### Data Flow (Dispatch)

```
User Input
  ↓ client validation (Zod)
Draft auto-save (localStorage)
  ↓ submit
Route handler / server action
  ↓ Supabase insert with RLS
Webhook → Google Sheets
Realtime channel → UI updates
```

## Database Schema (Core)

- `users`: auth, roles, password policy
- `dispatch_reports`: submissions with status and verification
- `outbound_map`: cluster/hub/station mappings
- `seatalk_sessions`: QR/OAuth session tracking
- `kpi_*`: MDT, workstation, productivity, intraday tables

## Feature Analysis

### Authentication
- Backroom: email/password via Supabase Auth
- FTE: SeaTalk QR/OAuth with session polling
- Security: bcrypt hashing, secure cookies, session expiry, first-login password change

### Dispatch Report Module
- Up to 10 rows per session
- Autocomplete for clusters/processors (debounced search)
- Multi-hub auto-split
- Real-time validation and dock confirmation
- Draft auto-save every 10 seconds
- Column visibility toggles

### Prealert Database
- Region/status/date filters
- Pagination (10/25/50/100)
- CSV export
- Live updates via Supabase realtime

### KPI Dashboard
- MDT, workstation metrics, productivity, intraday views
- Google Sheets as source; hourly sync into Supabase
- Charts (Recharts) and trend indicators

### Admin Tools
- Attendance, masterfile, breaktime, leave management
- Workstation assignments
- Role-based access (Admin only for sensitive areas)

## Technology Stack Analysis

### Frontend
- **Next.js 14 (App Router)**: server components, route handlers, built-in image/fonts, optimized bundling
- **React 18 + TypeScript**: hooks, concurrent rendering
- **Tailwind CSS**: utility-first styling with design tokens
- **Radix UI**: accessible primitives
- **React Hook Form + Zod**: typed forms and validation
- **GSAP + Framer Motion**: animation and transitions
- **Testing**: Vitest + React Testing Library, Playwright for E2E

### Backend/Platform
- **Supabase**: PostgreSQL, Auth, RLS, Realtime, Storage, Edge Functions
- **Google Sheets**: master data source and report export
- **SeaTalk**: OAuth for FTE authentication

## Performance Analysis

- **Current targets**: <3s initial load, <500ms API responses, <500KB gzipped bundle
- **Strategies**:
  - Route-level code splitting via App Router
  - Server components for data-fetch-heavy screens
  - Incremental static regeneration where possible
  - Debounced queries and indexed filters
  - Image optimization via Next.js

## Security Analysis

- Supabase Auth with secure cookies and short-lived JWTs
- RLS on all tables; admin-only policies for sensitive actions
- Input validation on client and server (Zod + schema checks)
- CSP and hardened headers at hosting layer
- CSRF protection via Next.js defaults and same-site cookies
- Rate limiting on route handlers where applicable

## Scalability Considerations

- Horizontal scaling through Vercel/Netlify edge network
- Supabase read replicas for heavy analytics reads
- Cached lookups (cluster/processors) and CDN caching for static assets
- Queue/offloading for webhook-heavy operations

## Code Quality

- Modular file structure (`app/`, `components/`, `lib/`, `supabase/`)
- TypeScript strict mode
- ESLint + Prettier
- Unit tests for utilities and API layer; integration for key flows
- Goal: >80% coverage with E2E smoke for auth/dispatch

## Dependencies (Representative)

```json
{
  "next": "^14.x",
  "react": "^18.x",
  "react-dom": "^18.x",
  "@supabase/supabase-js": "^2.x",
  "@radix-ui/react-*": "latest",
  "tailwindcss": "^3.x",
  "zod": "^3.x",
  "react-hook-form": "^7.x",
  "lucide-react": "^0.x",
  "gsap": "^3.x",
  "framer-motion": "^11.x",
  "vitest": "^1.x"
}
```

## Integration Points

- Supabase: database, auth, realtime, storage
- Google Sheets: master data sync and exports
- SeaTalk: OAuth for FTE users
- Optional: Sentry/Logflare for monitoring; GA for analytics

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Supabase downtime | Low | High | Retry logic, status monitoring, graceful degradation |
| Google Sheets rate limits | Medium | Medium | Caching, batching, backoff |
| SeaTalk API changes | Low | Medium | Version pinning, fallback auth path |
| Database performance | Medium | High | Indexing, query tuning, pagination |
| Security breach | Low | Critical | Regular audits, dependency updates, RLS enforcement |

## Future Enhancements

- Offline mode for dispatch drafting
- Bulk import/export for dispatch records
- Advanced analytics and custom reports
- Multi-language support
- AI-assisted dispatch validation/optimization

## Recommendations

Immediate:
- Complete KPI pages and admin tools
- Add Sentry and structured logging
- Increase automated test coverage

Short-Term:
- Harden CSP/security headers
- Add Playwright smoke tests for auth/dispatch
- Optimize bundle size with shared layouts and server components

Long-Term:
- Performance dashboards and cost monitoring
- Predictive analytics for dispatch optimization

## Conclusion

The Next.js-based architecture aligns well with the Outbound Internal Tool’s needs: strong performance, built-in optimization, and a secure integration with Supabase. With remaining work on KPI/admin modules and testing, the project is positioned for a stable production rollout.
