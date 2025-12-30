# API Reference

Complete API documentation for the Outbound Internal Tool.

## Base Configuration

```typescript
import { supabase } from '@/lib/supabase'
```

All API calls use the Supabase client configured with:
- **Base URL**: `VITE_SUPABASE_URL`
- **Auth**: Anon key for public operations, JWT for authenticated

## Dispatch Report API

### dispatchApi.getReports()

Get all dispatch reports with optional filtering.

```typescript
const { data, error } = await dispatchApi.getReports(filters?)
```

**Parameters:**
- `filters` (object, optional): 
  - `date` (string): Filter by date
  - `cluster` (string): Filter by cluster name
  - `station` (string): Filter by station

**Returns:**
```typescript
{
  data: DispatchReport[] | null
  error: string | null
}
```

**DispatchReport Interface:**
```typescript
interface DispatchReport {
  id: string
  batch_number: number
  cluster_name: string
  station: string
  region: string
  count_to: number
  total_oid_loaded: number
  actual_docked_time: string
  dock_number: string
  dock_confirmed: boolean
  actual_depart_time: string
  processor_name: string
  lh_trip_number: string
  plate_number: string
  fleet_size: '4WH' | '6W' | '6WF' | '10WH' | 'CV'
  assigned_pic: string
  created_by: string
  created_at: string
  updated_at: string
}
```

### dispatchApi.createReport()

Create a new dispatch report.

```typescript
const { data, error } = await dispatchApi.createReport(reportData)
```

**Parameters:**
- `reportData` (object): Dispatch report data (excluding auto-generated fields)

**Returns:**
```typescript
{
  data: DispatchReport | null
  error: string | null
}
```

### dispatchApi.updateReport()

Update an existing dispatch report.

```typescript
const { data, error } = await dispatchApi.updateReport(id, updates)
```

**Parameters:**
- `id` (string): Report ID
- `updates` (object): Fields to update

**Returns:**
```typescript
{
  data: DispatchReport | null
  error: string | null
}
```

### dispatchApi.deleteReport()

Delete a dispatch report.

```typescript
const { data, error } = await dispatchApi.deleteReport(id)
```

**Parameters:**
- `id` (string): Report ID

**Returns:**
```typescript
{
  data: { success: boolean } | null
  error: string | null
}
```

### dispatchApi.getClusters()

Get available cluster names for autocomplete.

```typescript
const { data, error } = await dispatchApi.getClusters(query?)
```

**Parameters:**
- `query` (string, optional): Search query (min 3 characters)

**Returns:**
```typescript
{
  data: string[] | null
  error: string | null
}
```

### dispatchApi.getProcessors()

Get available processor names for autocomplete.

```typescript
const { data, error } = await dispatchApi.getProcessors(query?)
```

**Parameters:**
- `query` (string, optional): Search query (min 3 characters)

**Returns:**
```typescript
{
  data: string[] | null
  error: string | null
}
```

### dispatchApi.getStationByCluster()

Get station and region for a given cluster.

```typescript
const { data, error } = await dispatchApi.getStationByCluster(clusterName)
```

**Parameters:**
- `clusterName` (string): Cluster name

**Returns:**
```typescript
{
  data: {
    station: string
    region: string
  } | null
  error: string | null
}
```

### dispatchApi.getNextDockNumber()

Get next available dock number.

```typescript
const { data, error } = await dispatchApi.getNextDockNumber()
```

**Returns:**
```typescript
{
  data: string | null
  error: string | null
}
```

### dispatchApi.validateDockAssignment()

Validate dock assignment availability.

```typescript
const { data, error } = await dispatchApi.validateDockAssignment(dockNumber, dateTime)
```

**Parameters:**
- `dockNumber` (string): Dock number
- `dateTime` (string): Date and time

**Returns:**
```typescript
{
  data: {
    available: boolean
    conflict?: {
      report_id: string
      batch_number: number
      cluster_name: string
    }
  } | null
  error: string | null
}
```

## Authentication API

### authApi.login()

Authenticate user with ops_id and password.

```typescript
const { data, error } = await authApi.login(ops_id, password)
```

**Parameters:**
- `ops_id` (string): User's operations ID
- `password` (string): User's password

**Returns:**
```typescript
{
  data: {
    user: {
      id: string
      ops_id: string
      name: string
      email: string
      role: 'FTE' | 'Backroom' | 'Data Team' | 'Admin'
      must_change_password: boolean
    }
    token: string
  } | null
  error: string | null
}
```

**Example:**
```typescript
const { data, error } = await authApi.login('OPS001', 'password123')
if (error) {
  console.error('Login failed:', error)
} else {
  console.log('Logged in as:', data.user.name)
}
```

### authApi.changePassword()

Change user password.

```typescript
const { data, error } = await authApi.changePassword(ops_id, old_password, new_password)
```

**Parameters:**
- `ops_id` (string): User's operations ID
- `old_password` (string): Current password
- `new_password` (string): New password

**Returns:**
```typescript
{
  data: { success: boolean } | null
  error: string | null
}
```

### authApi.createSeatalkSession()

Create SeaTalk authentication session.

```typescript
const { data, error } = await authApi.createSeatalkSession(session_id)
```

**Parameters:**
- `session_id` (string): Unique session identifier

**Returns:**
```typescript
{
  data: { success: boolean } | null
  error: string | null
}
```

### authApi.checkSeatalkAuth()

Check if SeaTalk session is authenticated.

```typescript
const { data } = await authApi.checkSeatalkAuth(session_id)
```

**Parameters:**
- `session_id` (string): Session identifier

**Returns:**
```typescript
{
  data: {
    email: string
    authenticated: boolean
  } | null
}
```

### authApi.getUser()

Get user by ops_id.

```typescript
const { data, error } = await authApi.getUser(ops_id)
```

**Parameters:**
- `ops_id` (string): User's operations ID

**Returns:**
```typescript
{
  data: User | null
  error: string | null
}
```

## Lookup API

### lookupApi.getClusters()

Search clusters with optional filters.

```typescript
const { data, error } = await lookupApi.getClusters(region?, query?)
```

**Parameters:**
- `region` (string, optional): Filter by region
- `query` (string, optional): Search query (min 3 characters)

**Returns:**
```typescript
{
  data: Array<{
    id: string
    cluster_name: string
    hub_name: string
    station: string
    region: string
    dock_number: string
  }> | null
  error: string | null
}
```

**Example:**
```typescript
// Search clusters starting with "Clu"
const { data } = await lookupApi.getClusters(undefined, 'Clu')

// Get all clusters in North region
const { data } = await lookupApi.getClusters('North')
```

### lookupApi.getHubs()

Get hubs for a specific cluster.

```typescript
const { data, error } = await lookupApi.getHubs(cluster)
```

**Parameters:**
- `cluster` (string, optional): Cluster name

**Returns:**
```typescript
{
  data: Array<{
    hub_name: string
    dock_number: string
  }> | null
  error: string | null
}
```

### lookupApi.getProcessors()

Search processors (users with Processor role).

```typescript
const { data, error } = await lookupApi.getProcessors(query?)
```

**Parameters:**
- `query` (string, optional): Search query

**Returns:**
```typescript
{
  data: Array<{
    name: string
    ops_id: string
  }> | null
  error: string | null
}
```

**Example:**
```typescript
const { data } = await lookupApi.getProcessors('John')
// Returns processors with name containing "John"
```

## Dispatch API

### dispatchApi.submitRows()

Submit dispatch report rows.

```typescript
const { data, error } = await dispatchApi.submitRows(rows, submitted_by_ops_id)
```

**Parameters:**
- `rows` (array): Array of dispatch report objects
- `submitted_by_ops_id` (string): Submitter's ops_id

**Row Object:**
```typescript
{
  cluster_name: string
  hub_name: string
  station: string
  region: string
  dock_number: string
  processor_name: string
  processor_ops_id: string
  lh_trip?: string
  plate_number?: string
  fleet_size?: number
}
```

**Returns:**
```typescript
{
  data: {
    created_count: number
  } | null
  error: string | null
}
```

**Example:**
```typescript
const rows = [
  {
    cluster_name: 'Cluster A',
    hub_name: 'Hub 1',
    station: 'Station X',
    region: 'North',
    dock_number: 'D01',
    processor_name: 'John Doe',
    processor_ops_id: 'OPS002',
    lh_trip: 'LH001',
    plate_number: 'ABC123',
    fleet_size: 5
  }
]

const { data, error } = await dispatchApi.submitRows(rows, 'OPS001')
if (!error) {
  console.log(`${data.created_count} rows submitted`)
}
```

### dispatchApi.getDispatches()

Get dispatch reports with filters and pagination.

```typescript
const { data, error } = await dispatchApi.getDispatches(params)
```

**Parameters:**
```typescript
{
  limit?: number          // Default: 10
  offset?: number         // Default: 0
  status?: string         // 'Pending' | 'Ongoing' | 'Completed'
  region?: string         // Filter by region
  startDate?: string      // ISO date string
  endDate?: string        // ISO date string
}
```

**Returns:**
```typescript
{
  data: {
    rows: Array<DispatchReport>
    total: number
  } | null
  error: string | null
}
```

**Example:**
```typescript
// Get first 25 pending dispatches in North region
const { data } = await dispatchApi.getDispatches({
  limit: 25,
  offset: 0,
  status: 'Pending',
  region: 'North'
})

// Get dispatches for date range
const { data } = await dispatchApi.getDispatches({
  startDate: '2024-01-01',
  endDate: '2024-01-31'
})
```

### dispatchApi.verifyRows()

Verify dispatch rows (Data Team only).

```typescript
const { data, error } = await dispatchApi.verifyRows(verifyData)
```

**Parameters:**
```typescript
{
  rows: string[]              // Array of dispatch report IDs
  verified_by_ops_id: string  // Verifier's ops_id
  send_csv?: boolean          // Send CSV to Google Sheets
  send_mode?: 'per_batch' | 'all'
}
```

**Returns:**
```typescript
{
  data: {
    verified_count: number
  } | null
  error: string | null
}
```

## Hub Management API

### hubApi.getHubs()

Get all hubs with pagination.

```typescript
const { data, error } = await hubApi.getHubs(params?)
```

**Parameters:**
```typescript
{
  limit?: number
  offset?: number
  active?: boolean
}
```

**Returns:**
```typescript
{
  data: {
    hubs: Array<Hub>
    total: number
  } | null
  error: string | null
}
```

### hubApi.createHub()

Create new hub (Admin only).

```typescript
const { data, error } = await hubApi.createHub(hubData)
```

**Parameters:**
```typescript
{
  cluster_name: string
  hub_name: string
  station: string
  region: string
  dock_number: string
}
```

### hubApi.updateHub()

Update existing hub (Admin only).

```typescript
const { data, error } = await hubApi.updateHub(hub_id, hubData)
```

### hubApi.deleteHub()

Soft delete hub (Admin only).

```typescript
const { data, error } = await hubApi.deleteHub(hub_id)
```

## KPI API

### kpiApi.getMDT()

Get Mean Dispatch Time data.

```typescript
const { data, error } = await kpiApi.getMDT(params?)
```

**Parameters:**
```typescript
{
  startDate?: string
  endDate?: string
}
```

**Returns:**
```typescript
{
  data: Array<{
    date: string
    mdt_minutes: number
    target_minutes: number
    variance: number
  }> | null
  error: string | null
}
```

### kpiApi.getWorkstation()

Get workstation metrics.

```typescript
const { data, error } = await kpiApi.getWorkstation(params?)
```

**Parameters:**
```typescript
{
  startDate?: string
  endDate?: string
}
```

**Returns:**
```typescript
{
  data: Array<{
    date: string
    station: string
    utilization: number
    efficiency: number
  }> | null
  error: string | null
}
```

### kpiApi.getProductivity()

Get productivity metrics.

```typescript
const { data, error } = await kpiApi.getProductivity(params?)
```

**Parameters:**
```typescript
{
  startDate?: string
  endDate?: string
}
```

**Returns:**
```typescript
{
  data: Array<{
    date: string
    parcels_per_hour: number
    target: number
    achievement: number
  }> | null
  error: string | null
}
```

### kpiApi.getIntraday()

Get intraday performance data.

```typescript
const { data, error } = await kpiApi.getIntraday(date?)
```

**Parameters:**
- `date` (string, optional): ISO date string

**Returns:**
```typescript
{
  data: Array<{
    timestamp: string
    hour: number
    parcels_processed: number
    active_processors: number
  }> | null
  error: string | null
}
```

## Error Handling

All API functions return an object with `data` and `error` properties:

```typescript
const { data, error } = await someApi.someMethod()

if (error) {
  // Handle error
  console.error('API Error:', error)
  toast.error(error)
} else {
  // Use data
  console.log('Success:', data)
}
```

## Common Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 401 | Unauthorized | Invalid or missing authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Error | Invalid input data |
| 500 | Server Error | Internal server error |

## Rate Limiting

- **Anonymous requests**: 100 per hour
- **Authenticated requests**: 1000 per hour
- **Burst limit**: 20 requests per second

## Best Practices

### 1. Error Handling
```typescript
try {
  const { data, error } = await api.method()
  if (error) throw new Error(error)
  // Use data
} catch (err) {
  console.error(err)
  toast.error('Operation failed')
}
```

### 2. Loading States
```typescript
const [loading, setLoading] = useState(false)

async function fetchData() {
  setLoading(true)
  try {
    const { data, error } = await api.getData()
    if (error) throw new Error(error)
    setData(data)
  } finally {
    setLoading(false)
  }
}
```

### 3. Pagination
```typescript
const [page, setPage] = useState(0)
const limit = 25

const { data } = await api.getDispatches({
  limit,
  offset: page * limit
})
```

### 4. Debounced Search
```typescript
const debouncedSearch = useMemo(
  () => debounce(async (query) => {
    const { data } = await lookupApi.getClusters(undefined, query)
    setResults(data)
  }, 300),
  []
)
```

## TypeScript Types

```typescript
// User
interface User {
  id: string
  ops_id: string
  name: string
  email: string
  role: 'FTE' | 'Backroom' | 'Data Team' | 'Admin'
  must_change_password: boolean
  created_at: string
  updated_at: string
}

// Dispatch Report
interface DispatchReport {
  id: string
  cluster_name: string
  hub_name: string
  station: string
  region: string
  dock_number: string
  processor_name: string
  processor_ops_id: string
  lh_trip?: string
  plate_number?: string
  fleet_size?: number
  status: 'Pending' | 'Ongoing' | 'Completed'
  submitted_by_ops_id: string
  verified_by_ops_id?: string
  created_at: string
  updated_at: string
}

// Hub
interface Hub {
  id: string
  cluster_name: string
  hub_name: string
  station: string
  region: string
  dock_number: string
  active: boolean
  created_at: string
}
```

## Testing

```typescript
// Mock API for testing
import { vi } from 'vitest'

vi.mock('@/lib/api', () => ({
  authApi: {
    login: vi.fn().mockResolvedValue({
      data: { user: mockUser, token: 'mock-token' },
      error: null
    })
  }
}))
```

## Support

For API issues or questions:
- Check error messages
- Review this documentation
- Contact development team
