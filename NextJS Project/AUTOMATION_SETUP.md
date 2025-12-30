# Documentation Auto-Update System (Next.js Ready)

## What Was Created

### Scripts (in `scripts/` folder)
1. **update-docs.js** - Syncs code changes to docs
2. **watch-docs.js** - File watcher for real-time updates during development
3. **setup-hooks.js** - Installs Git pre-commit hook automatically
4. **README.md** - Scripts documentation

### Documentation
1. **docs/AUTO_UPDATE.md** - Guide for the auto-update system

### Git Hook
- **pre-commit** - Automatically updates docs on every commit

### Package.json Scripts
```json
{
  "docs:update": "node scripts/update-docs.js",
  "docs:watch": "node scripts/watch-docs.js",
  "postinstall": "node scripts/setup-hooks.js"
}
```

## How It Works

**When you change:**
- `lib/api.ts` or route handlers → updates `docs/API_REFERENCE.md`
- `package.json` version → updates `README.md` and `PROJECT_SUMMARY.md`
- `app/**` routes or pages → updates `docs/IMPLEMENTATION_PLAN.md`
- Any file → updates timestamps

### Ways to Update

#### Automatic (Git Commit)
```bash
git add .
git commit -m "your message"
# Docs update via pre-commit hook
```

#### Watch Mode (Development)
```bash
npm run docs:watch
```

#### Manual
```bash
npm run docs:update
```

## What Gets Updated

| Code Change | Documentation Updated |
|-------------|----------------------|
| Add API function in `lib/api.ts` | `docs/API_REFERENCE.md` |
| Change version in `package.json` | `README.md`, `PROJECT_SUMMARY.md` |
| Create or update route in `app/` | `docs/IMPLEMENTATION_PLAN.md` |
| Any code change | Timestamps in all docs |

## Testing the System

```bash
# 1. Manual update
npm run docs:update

# 2. Watch mode
npm run docs:watch
# Make a change to lib/api.ts and confirm docs update

# 3. Git hook
echo "// test" >> lib/api.ts
git add .
git commit -m "test"
# Verify docs changed
```

## Benefits

- Always up-to-date documentation
- No manual doc edits required
- Consistent formatting
- Automatic version tracking
- Timestamps maintained across docs

## Configuration

All settings live in `scripts/update-docs.js`:

```javascript
const CONFIG = {
  appDir: path.join(__dirname, '../app'),
  libDir: path.join(__dirname, '../lib'),
  docsDir: path.join(__dirname, '../docs'),
  rootDir: path.join(__dirname, '..'),
  packageJson: path.join(__dirname, '../package.json'),
};
```

## Troubleshooting

### Hook Not Running
```bash
node scripts/setup-hooks.js
```

### Permission Issues (Unix/Mac)
```bash
chmod +x scripts/*.js
chmod +x .git/hooks/pre-commit
```

### Watch Mode Stuck
```bash
pkill -f watch-docs   # Unix/Mac
taskkill /F /IM node.exe /FI "WINDOWTITLE eq watch-docs"   # Windows
```

## Customization

To add a new mapping, edit `scripts/update-docs.js`:

```javascript
function updateNewDoc() {
  const sourceFile = path.join(CONFIG.appDir, 'new-route.tsx');
  const docPath = path.join(CONFIG.docsDir, 'NEW_DOC.md');
  // update logic...
}
```

## Next Steps

1. Verify with `npm run docs:update`
2. Keep `npm run docs:watch` running during development
3. Let the pre-commit hook keep docs in sync

## Support

If the auto-update system fails:
1. Check Node.js version (14+)
2. Run `npm run docs:update` manually
3. Review console output for errors
4. Contact the SOC5 Development Team

---

**Status**: Fully operational (Next.js ready)  
**Last Updated**: 2024-01  
**Maintained by**: SOC5 Development Team
