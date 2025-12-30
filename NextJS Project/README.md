# Outbound Internal Tool (Next.js Edition)

Enterprise-grade web application for outbound dispatch operations, KPI tracking, and team administration built with Next.js, React, Tailwind CSS, and Supabase.

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev

# Open browser
http://localhost:3000
```

## Overview

A modern internal tool designed for the SOC5 Outbound Operations team to streamline dispatch reporting, monitor KPIs, and manage team resources efficiently.

### Key Features

- Dual authentication: Backroom (email/password) + FTE (SeaTalk QR)
- Dispatch report: Editable table with autocomplete, validation, and draft persistence
- Prealert database: Consolidated view with advanced filtering
- KPI dashboard: Real-time performance metrics from Google Sheets
- Admin tools: Attendance, masterfile, breaktime, leave management
- Theme system: Dark/Light mode with preset themes
- Responsive and type-safe: Built with TypeScript and Tailwind CSS

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Routing**: Next.js file-system routes and nested layouts
- **UI Components**: Radix UI primitives + custom components
- **Styling**: Tailwind CSS + CSS variables
- **Forms**: React Hook Form + Zod validation
- **State**: React Context and server components where appropriate
- **Animation**: GSAP + Framer Motion
- **Icons**: Lucide React

### Backend / Platform
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + SeaTalk OAuth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Integrations**: Google Sheets API (data sync)

### Testing
- **Unit/Integration**: Vitest + React Testing Library
- **E2E**: Playwright (recommended for Next.js)

## Project Structure (Next.js)

```
NextJS Project/
├─ app/
│  ├─ layout.tsx              # Root layout
│  ├─ page.tsx                # Dashboard landing
│  ├─ (auth)/login/page.tsx   # Authentication routes
│  ├─ (app)/dispatch/         # Feature routes
│  ├─ api/                    # Route handlers (server actions/APIs)
│  └─ globals.css             # Tailwind base styles
├─ components/
│  ├─ ui/                     # Reusable UI primitives
│  ├─ layout/                 # Shell, sidebar, header
│  └─ theme/                  # Theme presets
├─ lib/
│  ├─ supabase/browser.ts     # Client-side Supabase
│  ├─ supabase/server.ts      # Server-side Supabase helper
│  └─ api.ts                  # API service layer
├─ scripts/                   # Automation scripts
├─ docs/                      # Documentation (Next.js ready)
├─ supabase/                  # Migrations and functions
├─ public/                    # Static assets
├─ .env.example               # Environment template
├─ next.config.mjs
├─ tailwind.config.ts
└─ package.json
```

## Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase project
- Google Sheets (for data sync)

### Steps
```bash
cd NextJS Project
npm install
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # server-side only
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start development server:
```bash
npm run dev
```

## Authentication

### Backroom Users
1. Select "Backroom" role
2. Enter email (@shopeemobile-external.com)
3. Enter password (default: `SOC5-Outbound`)

### FTE Users (SeaTalk)
1. Open SeaTalk mobile app
2. Scan QR code on login page
3. Complete OAuth callback

## Features

- Dispatch Report: Max 10 rows, autocomplete, validation, auto-save, column visibility, dock confirmation
- Prealert Database: Filter by region/status/date, CSV export, pagination, real-time updates
- KPI Dashboard: MDT, workstation metrics, productivity, intraday monitoring
- Admin Tools: Attendance, masterfile, breaktime, leave, workstation assignment
- Theme System: 7 preset themes with dark/light support

## Testing

```bash
npm test            # Vitest unit/integration
npm run test:ui     # Component tests with UI
npm run test:run    # Single run mode
```

## Build & Deploy

```bash
npm run build       # Next.js production build
npm run start       # Start production server (after build)
```

Deployment guides and platform specifics are in `docs/DEPLOYMENT.md`.

## Documentation

- [Getting Started](docs/GETTING_STARTED.md)
- [Database Setup](docs/DATABASE_SETUP.md)
- [API Reference](docs/API_REFERENCE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Project Analysis](docs/PROJECT_ANALYSIS.md)
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
- [Auto-Update System](docs/AUTO_UPDATE.md)
- [Documentation Index](docs/INDEX.md)

## Version

Current Version: **1.0.0 (Next.js-ready documentation)**

---

Built by the SOC5 Development Team.
