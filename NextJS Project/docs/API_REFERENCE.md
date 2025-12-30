# API Reference (Next.js)

Complete API documentation for the Outbound Internal Tool using Next.js and Supabase.

## Base Configuration

### Browser Client
```typescript
// lib/supabase/browser.ts
import { createBrowserClient } from '@supabase/ssr';

export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Server Client
```typescript
// lib/supabase/server.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export function supabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => cookieStore }
  );
}
```

All API calls use the Supabase client configured with:
- **Base URL**: `NEXT_PUBLIC_SUPABASE_URL`
- **Auth**: anon key for public operations; JWT/session for authenticated requests

## Authentication API

### authApi.login()
Authenticate user with `ops_id` and `password`.

```typescript
const { data, error } = await authApi.login(ops_id, password);
```

Returns:
```typescript
{
  data: {
    user: {
      id: string;
      ops_id: string;
      name: string;
      email: string;
      role: 'FTE' | 'Backroom' | 'Data Team' | 'Admin';
      must_change_password: boolean;
    };
    token: string;
  } | null;
  error: string | null;
}
```

### authApi.changePassword()
```typescript
const { data, error } = await authApi.changePassword(ops_id, old_password, new_password);
```

### authApi.createSeatalkSession()
```typescript
const { data, error } = await authApi.createSeatalkSession(session_id);
```

### authApi.checkSeatalkAuth()
```typescript
const { data } = await authApi.checkSeatalkAuth(session_id);
```

### authApi.getUser()
```typescript
const { data, error } = await authApi.getUser(ops_id);
```

## Lookup API

### lookupApi.getClusters()
```typescript
const { data, error } = await lookupApi.getClusters(region?, query?);
```

### lookupApi.getHubs()
```typescript
const { data, error } = await lookupApi.getHubs(cluster);
```

### lookupApi.getProcessors()
```typescript
const { data, error } = await lookupApi.getProcessors(query?);
```

## Dispatch API

### dispatchApi.submitRows()
```typescript
const { data, error } = await dispatchApi.submitRows(rows, submitted_by_ops_id);
```

Row object:
```typescript
{
  cluster_name: string;
  hub_name: string;
  station: string;
  region: string;
  dock_number: string;
  processor_name: string;
  processor_ops_id: string;
  lh_trip?: string;
  plate_number?: string;
  fleet_size?: number;
}
```

### dispatchApi.getDispatches()
```typescript
const { data, error } = await dispatchApi.getDispatches({
  limit?: number,
  offset?: number,
  status?: 'Pending' | 'Ongoing' | 'Completed',
  region?: string,
  startDate?: string,
  endDate?: string
});
```

### dispatchApi.verifyRows()
```typescript
const { data, error } = await dispatchApi.verifyRows({
  rows: string[],
  verified_by_ops_id: string,
  send_csv?: boolean,
  send_mode?: 'per_batch' | 'all'
});
```

## Hub Management API

### hubApi.getHubs()
```typescript
const { data, error } = await hubApi.getHubs({ limit?, offset?, active? });
```

### hubApi.createHub()
```typescript
const { data, error } = await hubApi.createHub({
  cluster_name,
  hub_name,
  station,
  region,
  dock_number
});
```

### hubApi.updateHub()
```typescript
const { data, error } = await hubApi.updateHub(hub_id, hubData);
```

### hubApi.deleteHub()
```typescript
const { data, error } = await hubApi.deleteHub(hub_id);
```

## KPI API

### kpiApi.getMDT()
```typescript
const { data, error } = await kpiApi.getMDT({ startDate?, endDate? });
```

### kpiApi.getWorkstation()
```typescript
const { data, error } = await kpiApi.getWorkstation({ startDate?, endDate? });
```

### kpiApi.getProductivity()
```typescript
const { data, error } = await kpiApi.getProductivity({ startDate?, endDate? });
```

### kpiApi.getIntraday()
```typescript
const { data, error } = await kpiApi.getIntraday(date?);
```

## Error Handling Pattern

```typescript
const { data, error } = await api.method();
if (error) {
  console.error('API Error:', error);
  throw new Error(error);
}
return data;
```

## Common Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 401 | Unauthorized | Invalid or missing authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 422 | Validation Error | Invalid input data |
| 500 | Server Error | Unexpected error |

## Rate Limiting (Recommended)

- Anonymous: 100 req/hour
- Authenticated: 1000 req/hour
- Burst: 20 req/sec

Implement via Supabase edge functions or hosting provider rate limiting.

## TypeScript Types

```typescript
interface User {
  id: string;
  ops_id: string;
  name: string;
  email: string;
  role: 'FTE' | 'Backroom' | 'Data Team' | 'Admin';
  must_change_password: boolean;
  created_at: string;
  updated_at: string;
}

interface DispatchReport {
  id: string;
  cluster_name: string;
  hub_name: string;
  station: string;
  region: string;
  dock_number: string;
  processor_name: string;
  processor_ops_id: string;
  lh_trip?: string;
  plate_number?: string;
  fleet_size?: number;
  status: 'Pending' | 'Ongoing' | 'Completed';
  submitted_by_ops_id: string;
  verified_by_ops_id?: string;
  created_at: string;
  updated_at: string;
}

interface Hub {
  id: string;
  cluster_name: string;
  hub_name: string;
  station: string;
  region: string;
  dock_number: string;
  active: boolean;
  created_at: string;
}
```

## Testing (Vitest)

```typescript
import { vi } from 'vitest';

vi.mock('@/lib/api', () => ({
  authApi: {
    login: vi.fn().mockResolvedValue({
      data: { user: { ops_id: 'OPS001', name: 'Test User' }, token: 'mock-token' },
      error: null
    })
  }
}));
```

## Support

For API issues:
- Check console/server logs
- Verify environment variables (`NEXT_PUBLIC_*`, `SUPABASE_SERVICE_ROLE_KEY`)
- Review this reference
- Contact the development team
