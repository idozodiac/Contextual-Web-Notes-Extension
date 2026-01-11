# Troubleshooting: Content Script Not Appearing

If you don't see the "Hello World!" button on google.com, follow these steps:

## Step 1: Verify Extension is Loaded

1. Go to `chrome://extensions/`
2. Make sure "Developer mode" is enabled (top right toggle)
3. Find "Contextual Web Notes" in the list
4. Verify it's **enabled** (toggle should be ON)
5. If you see an error icon, click it to see the error message

## Step 2: Reload the Extension

1. After building (`npm run build`), click the **reload icon** (circular arrow) on the extension card
2. This ensures the latest build is loaded

## Step 3: Check Browser Console

1. Visit `https://www.google.com`
2. Open DevTools (F12 or Right-click → Inspect)
3. Go to the **Console** tab
4. Look for messages starting with `[Contextual Notes]`
5. You should see:
   - `[Contextual Notes] Content script initializing...`
   - `[Contextual Notes] Content script initialized successfully!`

## Step 4: Check for Errors

In the Console tab, look for any **red error messages**. Common issues:

- **Content Security Policy (CSP) errors**: Some sites block inline scripts
- **Module loading errors**: Check if files are loading correctly
- **React errors**: Check if React is initializing properly

## Step 5: Check Elements Tab

1. In DevTools, go to the **Elements** tab
2. Search for `contextual-notes-root` (Ctrl+F)
3. You should see a `<div id="contextual-notes-root">` element
4. Expand it to see the Shadow DOM content

## Step 6: Verify Content Script is Registered

1. Go to `chrome://extensions/`
2. Click "Details" on your extension
3. Scroll down to "Inspect views"
4. You should see content scripts listed

## Step 7: Test on a Simple Page

Try visiting a simpler page like `https://example.com` to rule out site-specific issues.

## Common Fixes

### Extension Not Loading
- Make sure you're loading from `apps/extension/dist` (not `apps/extension`)
- Rebuild: `cd apps/extension && npm run build`
- Reload the extension in `chrome://extensions/`

### Content Script Not Running
- Check browser console for errors
- Verify the manifest.json has correct content_scripts configuration
- Try disabling other extensions that might interfere

### Button Not Visible
- Check if the element exists in the DOM (Elements tab)
- Check if there are CSS conflicts (try `z-index: 999999` in inline styles)
- Verify the Shadow DOM is rendering correctly

## Still Not Working?

1. Check the **Service Worker** console:
   - Go to `chrome://extensions/`
   - Click "service worker" link under your extension
   - Check for errors there

2. Try a **hard refresh** on google.com (Ctrl+Shift+R)

3. **Rebuild and reload**:
   ```bash
   cd apps/extension
   npm run build
   ```
   Then reload the extension in `chrome://extensions/`

