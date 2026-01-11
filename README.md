# Contextual Web Notes Extension

A Chrome Extension that allows users to attach "sticky notes" to specific URLs or HTML elements on any website. Notes persist, sync across devices via a backend, and are rendered directly over the target website without breaking the host site's layout.

## 🏗️ Architecture

This is a **monorepo** built with **Turborepo** containing:

- **`apps/extension`**: Chrome Extension (React + Vite + Manifest V3)
- **`apps/backend`**: NestJS API with PostgreSQL (via Prisma)

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Docker (for PostgreSQL in development)

### Installation

1. **Install dependencies** (from root):
   ```bash
   npm install
   ```

2. **Set up the extension**:
   ```bash
   cd apps/extension
   npm install
   ```

3. **Set up the backend**:
   ```bash
   cd apps/backend
   npm install
   ```

### Development

#### Extension Development

1. **Start the extension dev server** (from `apps/extension`):
   ```bash
   npm run dev
   ```
   Keep this terminal running - it watches for changes and rebuilds automatically.

2. **Load the extension in Chrome** (one-time setup):
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `apps/extension/dist` directory

3. **Development workflow**:
   - Make changes to files in `src/`
   - Save the file (dev server auto-rebuilds)
   - Click the **reload icon** (🔄) on the extension card in `chrome://extensions/`
   - Refresh the page you're testing (F5 or Ctrl+R)
   - Your changes should now be visible!

4. **Test the Hello World button**:
   - Visit `https://www.google.com`
   - You should see a red "Hello World!" button in the top-right corner
   - Click it to see the alert

#### Backend Development

1. **Start PostgreSQL** (from `apps/backend`):
   ```bash
   docker-compose up -d
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Run database migrations** (Phase 3):
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Start the backend server**:
   ```bash
   npm run start:dev
   ```

   The API will be available at `http://localhost:3000`

### Building for Production

From the root directory:
```bash
npm run build
```

## 📁 Project Structure

```
.
├── apps/
│   ├── extension/          # Chrome Extension
│   │   ├── src/
│   │   │   ├── background/ # Service Worker
│   │   │   ├── content/    # Content Script (injected into pages)
│   │   │   ├── popup/      # Extension Popup UI
│   │   │   └── manifest.ts # Manifest V3 config
│   │   ├── icons/          # Extension icons (16x16, 48x48, 128x128)
│   │   └── vite.config.ts
│   │
│   └── backend/            # NestJS API
│       ├── src/
│       │   ├── app.module.ts
│       │   └── main.ts
│       └── prisma/
│           └── schema.prisma
│
├── package.json            # Root workspace config
└── turbo.json             # Turborepo config
```

## 🎯 Development Phases

### ✅ Phase 1: Scaffold & Manifest V3 Setup (COMPLETE)
- [x] Monorepo structure with Turborepo
- [x] Extension with React + Vite + CRXJS
- [x] NestJS backend scaffold
- [x] Hello World content script with red button

### ✅ Phase 2: The "Sticky Note" UI (COMPLETE)
- [x] NoteComponent in React
- [x] Draggable logic (custom implementation)
- [x] Shadow DOM encapsulation with Tailwind
- [x] Add Note button
- [x] Full header drag handle

### ✅ Phase 3: Backend & Database (COMPLETE)
- [x] Prisma schema and migrations setup
- [x] CRUD endpoints for notes (GET, POST, PATCH, DELETE)
- [x] CORS configuration for extension
- [x] Service worker API handlers
- [x] Content script integration with backend
- [x] Debounced saves
- [x] Notes persist across page reloads

### 🔄 Phase 4: Authentication & Sync (TODO)
- [ ] Firebase Auth or Clerk integration
- [ ] JWT token handling
- [ ] User-scoped notes

### 🔄 Phase 5: Advanced Features (TODO)
- [ ] SPA URL change detection
- [ ] Element anchoring with CSS selectors
- [ ] Position persistence

## 🔧 Extension Icons

You need to create extension icons before building:

1. Create three PNG files:
   - `apps/extension/icons/icon16.png` (16x16 pixels)
   - `apps/extension/icons/icon48.png` (48x48 pixels)
   - `apps/extension/icons/icon128.png` (128x128 pixels)

2. You can use any image editor or online tool to create these icons.

## 🛠️ Tech Stack

### Extension
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **@crxjs/vite-plugin** - Chrome Extension HMR support
- **Tailwind CSS** - Styling (scoped in Shadow DOM)
- **Manifest V3** - Latest Chrome Extension API

### Backend
- **NestJS** - Node.js framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **TypeScript** - Type safety

## 📝 Notes

- The content script uses **Shadow DOM** to prevent style conflicts with host websites
- The extension supports **SPA navigation** detection (ready for Phase 5)
- CORS is enabled on the backend to allow requests from the Chrome Extension

## 🐛 Troubleshooting

### Extension not loading
- Make sure you're loading from `apps/extension/dist` (not `apps/extension`)
- Check the browser console for errors
- Verify all dependencies are installed

### Content script not appearing
- Check that the page URL matches `<all_urls>` in manifest
- Open DevTools and check for console errors
- Verify the content script is injected (check Elements tab for `#contextual-notes-root`)

### Backend connection issues
- Ensure PostgreSQL is running (`docker-compose up -d`)
- Check `.env` file has correct `DATABASE_URL`
- Verify backend is running on port 3000

## 📄 License

MIT

