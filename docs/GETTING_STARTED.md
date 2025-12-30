# Getting Started

Quick guide to get the Outbound Internal Tool running on your local machine.

## Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (free tier works)
- Modern web browser (Chrome, Firefox, Edge, Safari)

## Installation

### 1. Clone Repository

```bash
cd OutboudInternalTool
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages (~500MB).

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Google OAuth (Optional for FTE login)
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Application Settings
VITE_APP_NAME=SOC5 Ops Internal Tool
VITE_ENABLE_DRAFT_AUTOSAVE=true
VITE_DRAFT_AUTOSAVE_INTERVAL=10000
VITE_MAX_DISPATCH_ROWS=10
```

### 4. Database Setup

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for complete instructions.

Quick setup:
1. Create Supabase project
2. Run migrations in `supabase/migrations/`
3. Create initial admin user

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## First Login

### Default Admin Account
- **Email**: admin@shopeemobile-external.com
- **Password**: SOC5-Outbound
- **Role**: Admin

You'll be prompted to change the password on first login.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (auth, theme)
├── lib/           # Utilities and API services
├── pages/         # Page components
├── theme/         # Theme presets
└── test/          # Test files
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test            # Run tests in watch mode
npm run test:ui     # Run tests with UI
npm run test:run    # Run tests once

# Code Quality
npm run lint        # Run ESLint
```

## Common Tasks

### Adding a New Page

1. Create page component in `src/pages/`:
```typescript
// src/pages/my-page.tsx
export function MyPage() {
  return <div>My Page Content</div>
}
```

2. Add route in `src/App.tsx`:
```typescript
<Route path="my-page" element={<MyPage />} />
```

3. Add menu item in `src/components/sidebar.tsx`

### Creating a New Component

1. Create component file in `src/components/ui/`:
```typescript
// src/components/ui/my-component.tsx
export function MyComponent({ children }: { children: React.ReactNode }) {
  return <div className="my-component">{children}</div>
}
```

2. Export from index (if needed)
3. Use in pages

### Making API Calls

Use the API service layer:

```typescript
import { dispatchApi } from '@/lib/api'

const { data, error } = await dispatchApi.getDispatches({
  limit: 10,
  status: 'Pending'
})
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Supabase Connection Error
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Check Supabase project is active
- Verify network connection

### Build Errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Next Steps

- Read [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) for architecture overview
- Check [API_REFERENCE.md](API_REFERENCE.md) for API documentation
- Review [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for development roadmap

## Support

For issues or questions:
- Check documentation in `docs/` folder
- Contact development team
- Review GitHub issues (if applicable)
