# Quick Start Guide

## Development Setup (No Backend Required)

Follow these steps to run the application in development mode with mock data:

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and set:
```
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

## Test Accounts

### Backroom Users (Ops Coordinators)

| Ops ID | Name | Password | Status |
|--------|------|----------|---------|
| OPS001 | Juan Dela Cruz | `SOC5-Outbound` | Regular user |
| OPS002 | Maria Santos | `SOC5-Outbound` | First-time user (password change required) |
| OPS003 | Pedro Gonzales | `MyPassword123!` | Regular user |
| OPS004 | Ana Reyes | `SOC5-Outbound` | Regular user |
| OPS005 | Carlos Rivera | `MyPassword456!` | Regular user |

### Data Team Users

| Ops ID | Name | Password | Role |
|--------|------|----------|------|
| DATA001 | Lisa Chen | `DataTeam2024!` | Data Team (can verify dispatches) |
| DATA002 | Michael Tan | `DataTeam2024!` | Data Team |

### Admin Users

| Ops ID | Name | Password | Role |
|--------|------|----------|------|
| ADMIN001 | Sarah Johnson | `Admin2024!` | Admin (full access) |

### FTE Users (Google OAuth)

| Email | Name | Role |
|-------|------|------|
| robert.brown@company.com | Robert Brown | FTE |
| jennifer.lee@company.com | Jennifer Lee | FTE |

Note: In development mode with mock API, FTE login will automatically use FTE001 credentials.

## Quick Test Scenarios

### 1. Test Backroom Login

1. Go to login page
2. Select "Backroom"
3. Enter Ops ID: `OPS001`
4. Name auto-fills to "Juan Dela Cruz"
5. Enter password: `SOC5-Outbound`
6. Click "Sign In"

### 2. Test First-Time Login

1. Login with Ops ID: `OPS002`
2. Password: `SOC5-Outbound`
3. System will prompt for password change
4. Change password and continue

### 3. Test Dispatch Report Submission

1. Login with any Backroom user
2. Navigate to Outbound → Dispatch Report
3. Start typing cluster name (e.g., "Masbate")
4. Select from autocomplete
5. Watch fields auto-fill (station, region, dock)
6. Fill in remaining fields
7. Click "Submit All Rows"

### 4. Test Multi-Hub Auto-Split

1. In Dispatch Report, search for cluster: `Masbate Hub,Tugbo Hub,Aroroy Hub`
2. Select it from autocomplete
3. System automatically creates 3 rows (one for each hub)
4. Toast notification confirms the split

### 5. Test Draft Persistence

1. Fill in some dispatch rows
2. Wait 10 seconds (auto-save)
3. Refresh the page
4. Draft is restored automatically

### 6. Test Prealert Database

1. Navigate to Outbound → Prealert
2. Use filters to search by region, status, or date
3. View paginated results
4. Mock data shows 250 sample dispatch entries

## Sample Data Reference

### Regions

- **FAR SOL** - Far South Luzon (Masbate, Sorsogon, Legazpi, Naga)
- **METRO MANILA** - Manila, Quezon City, Makati, Pasig, Caloocan
- **VISMIN** - Visayas & Mindanao (Cebu, Davao, Iloilo, Bacolod)

### Clusters (Examples)

| Cluster Name | Region | Hubs |
|--------------|--------|------|
| Masbate Hub | FAR SOL | Masbate Hub |
| Masbate Hub,Tugbo Hub,Aroroy Hub | FAR SOL | Masbate Hub, Tugbo Hub, Aroroy Hub (multi-hub) |
| Manila Hub | METRO MANILA | Manila Hub |
| Cebu Hub | VISMIN | Cebu Hub |

### Dock Numbers

- FAR SOL: D1, D2, D3, D4, D5
- METRO MANILA: M1, M2
- VISMIN: C1, C2

### Fleet Sizes

- 4WH - 4-Wheeler
- 6W - 6-Wheeler
- 6WF - 6-Wheeler Forward
- 10WH - 10-Wheeler
- CV - Commercial Vehicle

## Features to Test

### ✅ Authentication
- [x] Backroom login with Ops ID
- [x] Name auto-lookup
- [x] Password validation
- [x] First-time password change
- [x] FTE Google OAuth (mock)

### ✅ Dashboard
- [x] Stats overview
- [x] Recent activity feed
- [x] Performance metrics

### ✅ Dispatch Report
- [x] Add/remove rows (max 10)
- [x] Cluster autocomplete (3+ chars)
- [x] Multi-hub auto-split
- [x] Auto-fill (station, region, dock)
- [x] Processor autocomplete
- [x] Field validation
- [x] Dock confirmation
- [x] Draft auto-save (10s)
- [x] Hide/show columns
- [x] Submit all rows

### ✅ Prealert Database
- [x] Filter by region
- [x] Filter by status
- [x] Date range filter
- [x] Pagination (50 per page)
- [x] Export CSV (mock)

### ✅ Theme
- [x] Light/dark mode toggle
- [x] Persistent theme selection

### ✅ Sidebar
- [x] Collapsible/expandable
- [x] Nested menu items
- [x] Hover to expand submenus
- [x] Active route highlighting

## Troubleshooting

### Issue: Mock API not working
**Solution:** Ensure `VITE_USE_MOCK_API=true` in your `.env` file

### Issue: Name not auto-filling on login
**Solution:** Check that you're typing the correct Ops ID from the list above

### Issue: Draft not saving
**Solution:** Check browser console for localStorage errors; ensure localStorage is enabled

### Issue: Autocomplete not showing suggestions
**Solution:** Type at least 3 characters before suggestions appear

## Next Steps

1. **Connect to Real Backend**: Set `VITE_USE_MOCK_API=false` and configure `VITE_API_BASE_URL`
2. **Set up Google OAuth**: Configure `VITE_GOOGLE_CLIENT_ID` with your Google Cloud credentials
3. **Deploy to Production**: Run `npm run build` and deploy the `dist` folder

## Support

For questions or issues, refer to the main README.md or contact your development team.
