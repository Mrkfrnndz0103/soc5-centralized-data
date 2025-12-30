# Scripts (Next.js)

Automation scripts for keeping documentation synchronized with the Next.js codebase.

## Available Scripts

### `update-docs.js`
Automatically updates documentation files based on code changes.

**Usage:**
```bash
npm run docs:update
```

**Updates:**
- `docs/API_REFERENCE.md` from `lib/api.ts`
- `README.md` and `PROJECT_SUMMARY.md` from `package.json` version
- `docs/IMPLEMENTATION_PLAN.md` from `app/**` routes/pages
- Timestamps across all docs

### `watch-docs.js`
Watches for file changes and updates docs in real time.

**Usage:**
```bash
npm run docs:watch
```

**Watches:**
- `app/` directory
- `lib/` directory
- `package.json`
- `supabase/migrations/`

### `setup-hooks.js`
Installs the Git pre-commit hook for automatic documentation updates.

**Usage:**
```bash
node scripts/setup-hooks.js
```

**Runs automatically on:**
- `npm install`
- `npm ci`

## Configuration

Shared config (inside scripts):
```javascript
const CONFIG = {
  appDir: '../app',
  libDir: '../lib',
  docsDir: '../docs',
  rootDir: '..',
  packageJson: '../package.json',
};
```

## Workflow Integration

```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Doc watcher
npm run docs:watch
```

Before committing:
```bash
npm run docs:update
git diff docs/
git commit -m "message"   # pre-commit hook will also update docs
```

## Troubleshooting

**Hook not working**
```bash
node scripts/setup-hooks.js
```

**Permission denied (Unix/Mac)**
```bash
chmod +x scripts/*.js
chmod +x .git/hooks/pre-commit
```

**Watch mode stuck**
```bash
pkill -f watch-docs          # Unix/Mac
taskkill /F /IM node.exe /FI "WINDOWTITLE eq watch-docs"  # Windows
```

## See Also

- [docs/AUTO_UPDATE.md](../docs/AUTO_UPDATE.md) - Auto-update details
- [docs/IMPLEMENTATION_PLAN.md](../docs/IMPLEMENTATION_PLAN.md) - Roadmap and feature status
