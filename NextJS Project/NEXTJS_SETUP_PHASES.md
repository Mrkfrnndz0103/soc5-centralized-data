# Next.js Project Setup to Development (Phased Guide)

Comprehensive, end-to-end checklist for bootstrapping and developing a Next.js + React + Tailwind + Supabase app, including frontend UI shell, themes, and sidebar/page layout guidance.

## Phase 0 — Prerequisites
- Node.js 18+, npm
- Git, GitHub repo (optional)
- Supabase project (URL + anon key + service role key)
- Design tokens and brand colors (optional but recommended)

## Phase 1 — Scaffolding
- Create app: `npx create-next-app@latest --typescript --eslint --tailwind --app`
- Clean boilerplate:
  - Remove sample pages/components you won’t use
  - Delete unused assets in `public/`
- Initialize repo: `git init && git add . && git commit -m "chore: init next app"`

## Phase 2 — Core Configuration
- Env files: copy `.env.example` → `.env.local`; add:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
  - `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_ENVIRONMENT`
- Update `next.config.mjs` for images/domains as needed.
- Tailwind: set theme tokens, fonts, and base styles in `globals.css`.
- Aliases: add `@/*` path aliases in `tsconfig.json`.

## Phase 3 — Supabase Wiring
- Install client: `npm install @supabase/supabase-js @supabase/ssr`
- Add helpers:
  - `lib/supabase/browser.ts` with `createBrowserClient`
  - `lib/supabase/server.ts` with `createServerClient` + cookies
- Test connection with a simple route handler in `app/api/health/route.ts`.

## Phase 4 — App Shell, Layout, and Theming
- Define root layout in `app/layout.tsx` with metadata.
- Add providers (theme, auth, Supabase) in a single `Providers` component.
- Build shell components:
  - Sidebar (nav, user info)
  - Header (theme toggle, actions)
  - Main content area with responsive grid
- Set `app/globals.css` with base typography and CSS variables.
- Tailwind theme tokens (colors/spacing/typography) in `tailwind.config.ts`:
```ts
// tailwind.config.ts
import type { Config } from "tailwindcss"
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#e6ebff",
          200: "#c7d2ff",
          300: "#9caeff",
          400: "#6b83ff",
          500: "#3f59ff",
          600: "#2740e6",
          700: "#1f32b4",
          800: "#1a2a8f",
          900: "#16246f",
        },
        surface: {
          DEFAULT: "hsl(220, 15%, 10%)",
          muted: "hsl(220, 14%, 16%)",
          card: "hsl(220, 14%, 12%)",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        display: ["'Satoshi'", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.12)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
}
export default config
```
- Theme presets (light/dark + accents) in `components/theme/presets.ts`:
```ts
export const themes = {
  light: {
    name: "Light",
    className: "theme-light",
    accent: "brand-500",
  },
  dark: {
    name: "Dark",
    className: "theme-dark",
    accent: "brand-400",
  },
  ocean: { name: "Ocean", className: "theme-ocean", accent: "cyan-400" },
  forest: { name: "Forest", className: "theme-forest", accent: "emerald-400" },
}
```
- Global CSS variables (example) in `app/globals.css`:
```css
:root {
  --bg: #ffffff;
  --fg: #0b1220;
  --card: #f7f8fb;
  --muted: #e9edf5;
  --accent: #3f59ff;
  --radius: 12px;
}
.theme-dark {
  --bg: #0b0f1a;
  --fg: #e8ecf5;
  --card: #111727;
  --muted: #161d2f;
  --accent: #6b83ff;
}
body {
  background: var(--bg);
  color: var(--fg);
  font-family: 'Inter', system-ui, sans-serif;
}
```
- Sidebar skeleton (example) in `components/layout/sidebar.tsx`:
```tsx
import Link from "next/link"
import { Home, ClipboardList, BarChart3, Settings } from "lucide-react"

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dispatch", label: "Dispatch", icon: ClipboardList },
  { href: "/kpi", label: "KPI", icon: BarChart3 },
  { href: "/admin", label: "Admin", icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-[var(--card)]">
      <div className="px-4 py-4 text-lg font-semibold tracking-tight">SOC5 Ops</div>
      <nav className="flex-1 space-y-1 px-2">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/70"
          >
            <item.icon className="h-4 w-4 text-slate-400 group-hover:text-white" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-3 py-4 text-xs text-slate-400">v1.0.0</div>
    </aside>
  )
}
```
- Page shell layout (example) in `app/(app)/layout.tsx`:
```tsx
import { Sidebar } from "@/components/layout/sidebar"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <header className="flex items-center justify-between border-b border-slate-800 bg-[var(--card)]/70 px-6 py-4 backdrop-blur">
            <div className="text-base font-semibold">Dashboard</div>
            <ThemeToggle />
          </header>
          <div className="p-6 space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
```
- Theme toggle uses `classList` on `document.documentElement` to switch theme classes and persist to `localStorage`.

## Phase 5 — Authentication
- Implement login route: `app/(auth)/login/page.tsx`.
- Backroom auth: email/password via Supabase Auth.
- SeaTalk (or other OAuth): QR/session flow; poll session via route handler.
- Protect routes using middleware or server actions; redirect unauthenticated users to login.
- Add “must change password” flow after first login.

## Phase 6 — Data Modules
- Dispatch Report
  - Editable table (max rows), autocomplete (clusters/processors), validation (Zod), draft autosave (localStorage).
  - Submit via route handler using Supabase inserts with RLS.
- Prealert Database
  - Filters (region/status/date), pagination, CSV export, realtime updates.
- KPI Dashboard
  - MDT, workstation, productivity, intraday; charts with Recharts; server components where possible.
- Admin Tools
  - Attendance, masterfile, breaktime, leave, workstation; role-based access.

## Phase 7 — API & Routing
- Use App Router route handlers in `app/api/**` for server-side actions (auth, dispatch, lookups, KPI).
- Share validation schemas in `lib/validation` (Zod).
- Centralize Supabase queries in `lib/api.ts` (typed helpers).

## Phase 8 — State, Forms, and UX
- Forms: React Hook Form + Zod resolver; toasts for feedback.
- State: lean on server components; use client state sparingly (UI controls, drafts).
- Loading/empty/error states for all data views.
- Accessibility: Radix UI primitives; focus management; keyboard nav.

## Phase 9 — Testing
- Unit/Integration: Vitest + React Testing Library.
- E2E: Playwright (auth, dispatch submission, admin flows).
- Add CI jobs for `npm test`, `npm run lint`, `npm run build`.

## Phase 10 — Performance & Observability
- Enable `next build` bundle analysis (optional plugin).
- Use server components for data-heavy pages; cache where safe.
- Add logging/monitoring (Sentry or similar); track API latency and error rates.
- Optimize images (Next Image), fonts, and reduce client JS where possible.

## Phase 11 — Deployment
- Preferred: Vercel
  - Set env vars (`NEXT_PUBLIC_*`, `SUPABASE_SERVICE_ROLE_KEY`) in dashboard.
  - `npm run build` then `vercel --prod`.
- Alternatives: Netlify (Next runtime), Docker (self-hosted), AWS Amplify/ECS.
- Post-deploy smoke tests: auth, dispatch submit, prealert filters, KPI load, admin actions.

## Phase 12 — Maintenance
- Dependency updates monthly; `npm audit` and patch vulnerabilities.
- Backup strategy for Supabase; verify RLS policies regularly.
- Quarterly review of CSP/security headers and performance budgets.
- Keep docs in sync (auto-update scripts or manual review).

## Ready-to-Use Script Block
```bash
npx create-next-app@latest --typescript --eslint --tailwind --app
cd your-app
cp .env.example .env.local
npm install @supabase/supabase-js @supabase/ssr zod react-hook-form @radix-ui/react-toast @radix-ui/react-dropdown-menu
npm run dev
```
