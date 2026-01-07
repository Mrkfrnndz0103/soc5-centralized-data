# Outbound Internal Tool

Enterprise-grade web application for managing outbound dispatch operations, KPI tracking, and team administration at SOC5.

## ≡ƒÜÇ Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev

# Open browser
http://localhost:3000
```

## ≡ƒôï Overview

A modern React-based internal tool designed for SOC5 Outbound Operations team to streamline dispatch reporting, monitor KPIs, and manage team resources efficiently.

### Key Features

- Γ£à **Dual Authentication** - Backroom (Email) + FTE (SeaTalk QR)
- Γ£à **Dispatch Report** - Editable table with auto-complete, validation, and draft persistence
- Γ£à **Prealert Database** - Consolidated view with advanced filtering
- Γ£à **KPI Dashboard** - Real-time performance metrics from Google Sheets
- Γ£à **Admin Tools** - Attendance, masterfile, breaktime, leave management
- Γ£à **Theme System** - Dark/Light mode with 7 preset themes
- Γ£à **Responsive Design** - Mobile and desktop optimized
- Γ£à **Type-Safe** - Full TypeScript implementation

## ≡ƒ¢á∩╕Å Tech Stack

### Frontend
- **Framework**: Next.js 14 + React 18 + TypeScript
- **Build Tool**: Next.js (App Router)
- **Routing**: Next.js App Router
- **UI Components**: Radix UI Primitives
- **Styling**: Tailwind CSS + CSS Variables
- **Forms**: React Hook Form + Zod validation
- **State**: React Context API
- **Animation**: GSAP + Framer Motion
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + SeaTalk OAuth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Integration**: Google Sheets API

### Testing
- **Framework**: Vitest
- **Testing Library**: React Testing Library
- **Coverage**: Built-in Vitest coverage

## ≡ƒôü Project Structure

```
OutboudInternalTool/
Γö£ΓöÇΓöÇ src/
│   ├── app/                # Next.js App Router
Γöé   Γö£ΓöÇΓöÇ components/
Γöé   Γöé   Γö£ΓöÇΓöÇ ui/              # Reusable UI components
Γöé   Γöé   Γö£ΓöÇΓöÇ layout.tsx       # Main layout wrapper
Γöé   Γöé   Γö£ΓöÇΓöÇ sidebar.tsx      # Navigation sidebar
Γöé   Γöé   ΓööΓöÇΓöÇ theme-*.tsx      # Theme components
Γöé   Γö£ΓöÇΓöÇ contexts/
Γöé   Γöé   ΓööΓöÇΓöÇ auth-context.tsx # Authentication state
Γöé   Γö£ΓöÇΓöÇ lib/
Γöé   Γöé   Γö£ΓöÇΓöÇ api.ts           # API service layer
Γöé   Γöé   Γö£ΓöÇΓöÇ supabase.ts      # Supabase client
Γöé   Γöé   ΓööΓöÇΓöÇ utils.ts         # Utility functions
Γöé   Γö£ΓöÇΓöÇ screens/
Γöé   Γöé   Γö£ΓöÇΓöÇ login.tsx        # Login page
Γöé   Γöé   Γö£ΓöÇΓöÇ dashboard.tsx    # Main dashboard
Γöé   Γöé   Γö£ΓöÇΓöÇ dispatch-report.tsx
Γöé   Γöé   Γö£ΓöÇΓöÇ dispatch-monitoring.tsx
Γöé   Γöé   ΓööΓöÇΓöÇ prealert.tsx
Γöé   Γö£ΓöÇΓöÇ theme/
Γöé   Γöé   ΓööΓöÇΓöÇ presets/         # Theme presets
Γöé   Γö£ΓöÇΓöÇ test/                # Test files
Γö£ΓöÇΓöÇ supabase/
Γöé   Γö£ΓöÇΓöÇ migrations/          # Database migrations
Γöé   Γö£ΓöÇΓöÇ functions/           # Edge functions
Γöé   Γö£ΓöÇΓöÇ google-sheets-sync.gs
Γöé   ΓööΓöÇΓöÇ webhook-receiver.gs
Γö£ΓöÇΓöÇ docs/                    # Documentation
Γö£ΓöÇΓöÇ .env.example             # Environment template
ΓööΓöÇΓöÇ package.json
```

## ≡ƒöº Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Google Sheets (for data sync)

### Step 1: Clone and Install
```bash
cd OutboudInternalTool
npm install
```

### Step 2: Environment Setup
```bash
cp .env.example .env
```

Edit `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Step 3: Database Setup
See [docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md) for complete Supabase configuration.

### Step 4: Run Development Server
```bash
npm run dev
```

## ≡ƒöÉ Authentication

### Backroom Users
1. Select "Backroom" role
2. Enter email (@shopeemobile-external.com)
3. Enter password (default: `SOC5-Outbound`)

### FTE Users
1. Open SeaTalk mobile app
2. Scan QR code on login page
3. Automatically authenticated

See [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) for details.

## ≡ƒôè Features

### Dispatch Report
- Max 10 rows per session
- Auto-complete for clusters and processors
- Multi-hub cluster auto-split
- Real-time validation
- Auto-save every 10 seconds
- Column visibility toggle

### Prealert Database
- Filter by region, status, date range
- Export to CSV
- Pagination support
- Real-time updates

### KPI Dashboard
- MDT (Mean Dispatch Time)
- Workstation metrics
- Productivity tracking
- Intraday monitoring

## ≡ƒº¬ Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run
```

## ≡ƒÅù∩╕Å Build

```bash
# Production build
npm run build

# Start production server
npm run start
```

## ≡ƒôÜ Documentation

- [Getting Started](docs/GETTING_STARTED.md)
- [Database Setup](docs/DATABASE_SETUP.md)
- [API Reference](docs/API_REFERENCE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Project Analysis](docs/PROJECT_ANALYSIS.md)
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
- [Auto-Update System](docs/AUTO_UPDATE.md) - Documentation automation

### ≡ƒñû Auto-Documentation

Documentation automatically updates when code changes:
```bash
# Watch mode (development)
npm run docs:watch

# Manual update
npm run docs:update

# Auto-updates on git commit (via pre-commit hook)
```

## ≡ƒÄ¿ Theme System

7 built-in themes:
- Default (Warm neutrals)
- Ocean (Blue tones)
- Forest (Green tones)
- Sunset (Orange/Pink)
- Purple (Purple/Violet)
- Rose (Pink/Red)
- Cosmic (Deep space)

## ≡ƒöä Data Flow

```
Google Sheets (Master Data)
    Γåô Hourly Sync
Supabase Database
    Γåô Real-time
Web Application
    Γåô On Submit
Supabase Database
    Γåô Webhook
Google Sheets (Reports)
```

## ≡ƒÜÇ Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## ≡ƒñ¥ Contributing

Internal project - contact development team for contribution guidelines.

## ≡ƒô¥ License

Proprietary - Internal use only

## ≡ƒåÿ Support

For issues or questions:
- Check [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- Contact: SOC5 Development Team

## ≡ƒôê Version

Current Version: **1.0.0**

---

Built with Γ¥ñ∩╕Å by SOC5 Development Team

