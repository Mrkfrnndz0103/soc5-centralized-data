# Documentation Auto-Update System (Next.js)

Automated system that keeps documentation synchronized with code changes for the Next.js build.

## How It Works

The updater monitors code changes and refreshes Markdown files:

- API changes → updates `API_REFERENCE.md`
- `package.json` version → updates `README.md` and `PROJECT_SUMMARY.md`
- Route/page changes in `app/` → updates `IMPLEMENTATION_PLAN.md`
- Any change → updates timestamps

## Usage

### Manual Update
```bash
npm run docs:update
```

### Watch Mode (Development)
```bash
npm run docs:watch
```

### Automatic (Git Commit)
Docs update automatically via the pre-commit hook installed by `scripts/setup-hooks.js`.

## What Gets Updated

| File Changed | Documentation Updated |
|--------------|----------------------|
| `lib/api.ts` | `API_REFERENCE.md` |
| `package.json` | `README.md`, `PROJECT_SUMMARY.md` |
| `app/**` | `IMPLEMENTATION_PLAN.md` |
| Any file | Timestamps in all docs |

## Scripts

### `scripts/update-docs.js`
- Scans source and updates docs based on mappings
- Refreshes timestamps and versions

### `scripts/watch-docs.js`
- Watches `app/`, `lib/`, `package.json`, `supabase/migrations/`
- Triggers updates on change

### `scripts/setup-hooks.js`
- Installs Git pre-commit hook
- Runs on `npm install`

## Configuration

Key config (inside `scripts/update-docs.js`):

```javascript
const CONFIG = {
  appDir: path.join(__dirname, '../app'),
  libDir: path.join(__dirname, '../lib'),
  docsDir: path.join(__dirname, '../docs'),
  rootDir: path.join(__dirname, '..'),
  packageJson: path.join(__dirname, '../package.json'),
};
```

## Workflow

1. Make code changes
2. Run `npm run docs:watch` during development (optional)
3. Commit changes (pre-commit hook updates docs)
4. Review doc diffs before pushing

## Examples

### Adding New API Function
- Add function to `lib/api.ts`
- On commit or `npm run docs:update`, `API_REFERENCE.md` is refreshed

### Changing Version
- Update `package.json` version
- `README.md` and `PROJECT_SUMMARY.md` reflect the new version after update

### Creating New Route
- Add `app/(app)/reports/page.tsx`
- `IMPLEMENTATION_PLAN.md` marks route work as complete during update

## Troubleshooting

### Hook Not Running
```bash
node scripts/setup-hooks.js
```

### Watch Mode Issues
```bash
pkill -f watch-docs        # Unix/Mac
taskkill /F /IM node.exe /FI "WINDOWTITLE eq watch-docs"  # Windows
npm run docs:watch
```

### Manual Update Fails
```bash
node scripts/update-docs.js --verbose
```

## Disable Auto-Update

- Single commit: `git commit --no-verify -m "message"`
- Permanent: remove `.git/hooks/pre-commit`

## Best Practices

1. Keep `npm run docs:watch` running while developing
2. Review doc diffs before pushing
3. Update mappings when adding new folders or file types
4. Ensure environment variables use Next.js naming (`NEXT_PUBLIC_*`)

## Future Enhancements

- AI-assisted doc generation
- Changelog automation
- Breaking change detection
- Multi-language support

## Support

If issues persist:
- Confirm Node.js version (14+)
- Check script output for errors
- Contact the SOC5 Development Team

---

**Last Updated**: 2024-01  
**Maintained by**: SOC5 Development Team
