# Getting Started (Next.js)

Quick guide to run the Outbound Internal Tool locally with Next.js, Tailwind, and Supabase.

## Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (free tier works)
- Modern browser (Chrome, Firefox, Edge, Safari)

## Installation

### 1) Clone Repository

```bash
cd NextJS Project
```

### 2) Install Dependencies

```bash
npm install
```

### 3) Environment Configuration

Copy the example file and fill in values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Supabase (client)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Supabase (server-side helpers, keep secret)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google OAuth (optional for FTE login)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Application Settings
NEXT_PUBLIC_APP_NAME=SOC5 Ops Internal Tool
NEXT_PUBLIC_ENABLE_DRAFT_AUTOSAVE=true
NEXT_PUBLIC_DRAFT_AUTOSAVE_INTERVAL=10000
NEXT_PUBLIC_MAX_DISPATCH_ROWS=10
```

### 4) Database Setup

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for the full Supabase configuration.

Quick setup:
1. Create a Supabase project
2. Run migrations in `supabase/migrations/`
3. Create an initial admin user

### 5) Start Development Server

```bash
npm run dev
```

The application runs at `http://localhost:3000`.

## First Login

### Default Admin Account
- **Email**: admin@shopeemobile-external.com
- **Password**: SOC5-Outbound
- **Role**: Admin

You'll be prompted to change the password on first login.

## Project Structure (Next.js)

```
app/                  # App Router pages and layouts
components/           # Reusable UI components
lib/                  # Supabase clients, API helpers, utilities
theme/                # Theme presets and tokens
scripts/              # Documentation automation
supabase/             # Migrations and edge functions
docs/                 # Documentation (Next.js ready)
```

## Available Scripts

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run start        # Start production server after build

npm test             # Run Vitest
npm run test:ui      # Component tests with UI
npm run test:run     # Single run mode

npm run lint         # ESLint
```

## Common Tasks

### Adding a New Page (App Router)

1. Create a route file under `app/`:
```typescript
// app/(app)/reports/page.tsx
export default function ReportsPage() {
  return <div>Reports</div>;
}
```
2. (Optional) Add metadata in `app/(app)/reports/metadata.ts`.
3. Add navigation entry in your layout/sidebar component.

### Creating a New Component

1. Create the component in `components/ui/`:
```typescript
// components/ui/my-component.tsx
import { ReactNode } from 'react';

export function MyComponent({ children }: { children: ReactNode }) {
  return <div className="rounded-md border p-4">{children}</div>;
}
```
2. Export it from a barrel if you use one.
3. Import directly where needed.

### Making API Calls (Client)

```typescript
import { createBrowserClient } from '@/lib/supabase/browser';

const supabase = createBrowserClient();

const { data, error } = await supabase
  .from('dispatch_reports')
  .select('*')
  .limit(10);
```

### Making API Calls (Server/Route Handler)

```typescript
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('dispatch_reports').select('*').limit(10);
  return Response.json({ data, error });
}
```

## Troubleshooting

### Port Already in Use
```bash
npx kill-port 3000
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Supabase Connection Error
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Confirm project is active in Supabase
- Check network/firewall

### Build Errors
```bash
rm -rf .next
npm run build
```

## Next Steps

- Read [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) for architecture details
- Check [API_REFERENCE.md](API_REFERENCE.md) for API usage
- Review [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for roadmap

## Support

For issues or questions:
- Review documentation in `docs/`
- Contact the development team
- Check internal issue tracker
