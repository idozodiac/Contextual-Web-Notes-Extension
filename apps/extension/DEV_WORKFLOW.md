# Development Workflow

## Quick Start

1. **Start the dev server** (in one terminal):
   ```bash
   cd apps/extension
   npm run dev
   ```

2. **Load the extension in Chrome** (one-time setup):
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `apps/extension/dist` folder

3. **Make changes and test**:
   - Edit files in `src/`
   - Save changes
   - Click the **reload icon** (🔄) on the extension card in `chrome://extensions/`
   - Refresh the page you're testing (F5)

## Tips

### Faster Reloading
- Keep `chrome://extensions/` open in a tab
- After saving changes, just click the reload icon on the extension card
- Then refresh your test page

### Hot Module Replacement (HMR)
- CRXJS supports HMR, but Chrome extensions require a manual reload
- Content scripts: Reload extension + refresh page
- Popup: Reload extension + reopen popup
- Background service worker: Reload extension

### Debugging
- **Content Scripts**: Open DevTools on the page (F12)
- **Popup**: Right-click extension icon → Inspect popup
- **Background**: Go to `chrome://extensions/` → Click "service worker" link

### Production Build
When ready to package:
```bash
npm run build
```
This creates an optimized build in `dist/` ready for the Chrome Web Store.

