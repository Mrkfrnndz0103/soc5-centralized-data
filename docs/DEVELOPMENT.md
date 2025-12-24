# Development Guide

This guide provides detailed information for developers working on the Outbound Internal Tool.

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm equivalent)
- **Git**: For version control
- **VS Code**: Recommended IDE with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

### Initial Setup

1. **Clone and install**
   ```bash
   cd OutboudInternalTool
   npm install
   ```

2. **Environment configuration**
   ```bash
   cp .env.example .env
   ```

3. **For development without backend**
   ```
   VITE_USE_MOCK_API=true
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Project Architecture

### Folder Structure

```
src/
├── components/          # React components
│   ├── ui/             # Core UI components (Button, Input, etc.)
│   ├── layout.tsx      # Main app layout
│   ├── sidebar.tsx     # Navigation sidebar
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── contexts/           # React Context providers
│   └── auth-context.tsx
├── lib/                # Utilities and services
│   ├── api.ts          # Real API service
│   ├── mock-api.ts     # Mock API for development
│   ├── mockup-data.ts  # Sample data
│   └── utils.ts        # Helper functions
├── pages/              # Page components
│   ├── login.tsx
│   ├── dashboard.tsx
│   ├── dispatch-report.tsx
│   └── prealert.tsx
├── App.tsx             # Main app with routing
├── main.tsx            # Entry point
├── index.css           # Global styles
└── vite-env.d.ts       # TypeScript declarations
```

### Key Patterns

#### 1. Component Structure

```typescript
// Use React.forwardRef for components that need ref forwarding
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("base-classes", className)}
        {...props}
      />
    )
  }
)
Component.displayName = "Component"
```

#### 2. API Calls

```typescript
// Always use the API service layer
import { dispatchApi } from "@/lib/api"

const response = await dispatchApi.submitRows(rows, ops_id)
if (response.error) {
  // Handle error
  toast({ variant: "destructive", title: "Error", description: response.error })
} else {
  // Handle success
  console.log(response.data)
}
```

#### 3. State Management

```typescript
// Use Context for global state
import { useAuth } from "@/contexts/auth-context"

function MyComponent() {
  const { user, isAuthenticated } = useAuth()
  // ...
}

// Use local state for component-specific data
const [value, setValue] = useState(initialValue)
```

#### 4. Styling

```typescript
// Use Tailwind classes with cn() utility
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  variant === "primary" && "primary-classes",
  className
)} />
```

## Development Workflow

### 1. Adding a New Page

**Step 1:** Create page component
```typescript
// src/pages/my-new-page.tsx
export function MyNewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">My New Page</h1>
      {/* Content */}
    </div>
  )
}
```

**Step 2:** Add route in App.tsx
```typescript
import { MyNewPage } from "@/pages/my-new-page"

// Inside AppRoutes component
<Route path="my-new-page" element={<MyNewPage />} />
```

**Step 3:** Add menu item in sidebar.tsx (optional)
```typescript
{
  title: "My New Page",
  path: "/my-new-page",
  icon: <Icon className="h-5 w-5" />,
}
```

### 2. Creating a New Component

**Step 1:** Create component file
```typescript
// src/components/ui/my-component.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary"
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-classes",
          variant === "secondary" && "secondary-classes",
          className
        )}
        {...props}
      />
    )
  }
)
MyComponent.displayName = "MyComponent"

export { MyComponent }
```

**Step 2:** Export from index (optional)
```typescript
// src/components/ui/index.ts
export { MyComponent } from "./my-component"
```

### 3. Adding API Endpoints

**Step 1:** Add to API service
```typescript
// src/lib/api.ts
export const myApi = {
  async getItems(params?: { limit?: number }) {
    return fetchApi("/my-endpoint", {
      method: "GET",
      // ... options
    })
  }
}
```

**Step 2:** Add mock implementation
```typescript
// src/lib/mock-api.ts
export const mockMyApi = {
  async getItems(params?: any) {
    await delay()
    return mockResponse({ items: [] })
  }
}
```

### 4. Updating Styles

**Global theme variables** (src/index.css):
```css
:root {
  --my-color: 210 40% 98%;
}
```

**Tailwind config** (tailwind.config.js):
```javascript
theme: {
  extend: {
    colors: {
      myColor: "hsl(var(--my-color))",
    }
  }
}
```

## Testing

### Manual Testing Checklist

Before committing:
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test mobile responsive design
- [ ] Test dark/light theme
- [ ] Test with mock API
- [ ] Test keyboard navigation
- [ ] Test form validation
- [ ] Check console for errors
- [ ] Verify TypeScript types

### Test Accounts

See QUICKSTART.md for complete list of test Ops IDs.

Quick access:
- Backroom: `OPS001` / `SOC5-Outbound`
- Data Team: `DATA001` / `DataTeam2024!`
- Admin: `ADMIN001` / `Admin2024!`

## Code Style

### TypeScript

- Use `interface` for object shapes
- Use `type` for unions and intersections
- Always specify return types for functions
- Use `const` by default, `let` when reassignment needed
- Never use `any` (use `unknown` instead)

### React

- Use functional components with hooks
- Use `React.FC` sparingly (prefer explicit props interface)
- Keep components small and focused
- Extract reusable logic to custom hooks
- Use `useCallback` for event handlers passed to children
- Use `useMemo` for expensive computations

### Naming Conventions

- **Components**: PascalCase (`MyComponent`)
- **Files**: kebab-case (`my-component.tsx`)
- **Functions**: camelCase (`handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ROWS`)
- **Interfaces**: PascalCase with descriptive name (`UserProfile`)
- **Props interfaces**: ComponentNameProps (`ButtonProps`)

### File Organization

```typescript
// 1. Imports (external, then internal)
import React from "react"
import { cn } from "@/lib/utils"

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Constants
const MAX_VALUE = 100

// 4. Helper functions
function helper() {
  // ...
}

// 5. Component
export function Component({ prop }: Props) {
  // 5a. Hooks
  const [state, setState] = useState()
  const { user } = useAuth()

  // 5b. Derived state
  const computed = useMemo(() => {}, [])

  // 5c. Event handlers
  const handleClick = useCallback(() => {}, [])

  // 5d. Effects
  useEffect(() => {}, [])

  // 5e. Render
  return <div />
}
```

## Common Tasks

### Adding a Form Field

1. Add field to interface
2. Add to default values
3. Add to validation schema (if using Zod)
4. Add input component to JSX
5. Wire up onChange handler

### Implementing Autocomplete

```typescript
const [suggestions, setSuggestions] = useState<any[]>([])

const handleSearch = async (value: string) => {
  if (value.length >= 3) {
    const response = await lookupApi.search(value)
    if (response.data) {
      setSuggestions(response.data)
    }
  } else {
    setSuggestions([])
  }
}

// In JSX
<Input
  value={value}
  onChange={(e) => handleSearch(e.target.value)}
/>
{suggestions.length > 0 && (
  <div className="suggestions">
    {suggestions.map((item) => (
      <div key={item.id} onClick={() => selectItem(item)}>
        {item.name}
      </div>
    ))}
  </div>
)}
```

### Adding Draft Persistence

```typescript
// Save
const saveDraft = useCallback(() => {
  const key = `draft:${id}`
  localStorage.setItem(key, JSON.stringify(data))
}, [data])

// Auto-save
useEffect(() => {
  const interval = setInterval(saveDraft, 10000)
  return () => clearInterval(interval)
}, [saveDraft])

// Load
useEffect(() => {
  const saved = localStorage.getItem(key)
  if (saved) {
    setData(JSON.parse(saved))
  }
}, [])
```

## Debugging

### Common Issues

**Issue: Component not re-rendering**
- Check if state is being mutated directly
- Ensure useState/useReducer is used correctly
- Verify dependencies in useEffect/useMemo/useCallback

**Issue: API calls failing**
- Check network tab in DevTools
- Verify VITE_API_BASE_URL in .env
- Check if backend is running
- Try with VITE_USE_MOCK_API=true

**Issue: TypeScript errors**
- Run `npm run build` to see all errors
- Check for missing imports
- Verify interface definitions
- Use `unknown` instead of `any`

**Issue: Styling not applied**
- Check Tailwind class names
- Verify theme variables in index.css
- Use browser DevTools to inspect
- Check for conflicting styles

### DevTools

**React DevTools**
- Install React DevTools browser extension
- Inspect component tree
- View props and state
- Profile performance

**Redux DevTools** (if added later)
- Time-travel debugging
- State inspection
- Action logging

## Performance Optimization

### Best Practices

1. **Code Splitting**
   ```typescript
   const LazyComponent = lazy(() => import("./Component"))
   ```

2. **Memoization**
   ```typescript
   const memoized = useMemo(() => expensive(data), [data])
   const callback = useCallback(() => {}, [])
   const MemoComponent = memo(Component)
   ```

3. **Lazy Loading**
   - Use React.lazy for routes
   - Defer loading of heavy components
   - Load images lazily

4. **Avoid Re-renders**
   - Move static content outside component
   - Use proper key props in lists
   - Split large components

## Building for Production

```bash
# Build
npm run build

# Preview build locally
npm run preview
```

### Build Output

- Output directory: `dist/`
- Assets are fingerprinted for caching
- CSS is extracted and minified
- JavaScript is bundled and minified

### Environment Variables

Production `.env`:
```
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://api.yourcompany.com
VITE_GOOGLE_CLIENT_ID=your_production_client_id
```

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router v6](https://reactrouter.com/en/main)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit for review
5. Merge to main after approval

## Support

For questions or issues:
- Check this documentation first
- Review the README.md and QUICKSTART.md
- Contact the development team
- Open an issue in your issue tracker
