# Phase 3: Backend, Database & API Connection - Setup Guide

## Quick Start

### 1. Start PostgreSQL Database

```bash
cd apps/backend
docker-compose up -d
```

Verify it's running:
```bash
docker ps
```

You should see `contextual-notes-db` container.

### 2. Set Up Backend Environment

Create `.env` file in `apps/backend/` (or update if it exists):

```env
DATABASE_URL=postgresql://user:password@localhost:5433/contextual_notes?schema=public
PORT=3000
NODE_ENV=development
```

**Note**: Port 5433 is used (not 5432) to avoid conflicts with any local PostgreSQL instance.

### 3. Initialize Database

```bash
cd apps/backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

When prompted, enter migration name: `init`

### 4. Start Backend Server

```bash
cd apps/backend
npm run start:dev
```

Server should be running on `http://localhost:3000`

### 5. Test the Extension

1. **Rebuild extension** (if using dev mode):
   ```bash
   cd apps/extension
   npm run build
   ```

2. **Reload extension** in Chrome (`chrome://extensions/`)

3. **Visit** `https://www.google.com`

4. **Create a note** - Click the "+" button

5. **Type text** and **drag the note**

6. **Reload the page** - The note should still be there!

7. **Check database** - Open Prisma Studio:
   ```bash
   cd apps/backend
   npm run prisma:studio
   ```
   Visit `http://localhost:5555` to see all notes

## API Endpoints

- `GET /notes?url=...` - Get all notes for a URL
- `POST /notes` - Create a new note
  ```json
  {
    "url": "https://www.google.com",
    "content": "My note",
    "x": 100,
    "y": 200
  }
  ```
- `PATCH /notes/:id` - Update a note
  ```json
  {
    "content": "Updated content",
    "x": 150,
    "y": 250
  }
  ```
- `DELETE /notes/:id` - Delete a note

## File Structure

```
apps/
├── backend/
│   ├── src/
│   │   ├── notes/
│   │   │   ├── notes.controller.ts  # CRUD endpoints
│   │   │   ├── notes.service.ts     # Business logic
│   │   │   ├── notes.module.ts
│   │   │   └── dto/
│   │   ├── prisma/
│   │   │   ├── prisma.service.ts    # Prisma client wrapper
│   │   │   └── prisma.module.ts
│   │   └── main.ts                   # CORS configured
│   └── prisma/
│       └── schema.prisma             # Note model
│
└── extension/
    ├── src/
    │   ├── service-worker/
    │   │   ├── index.ts              # Message handlers
    │   │   └── api.ts                # Fetch calls to backend
    │   └── content/
    │       ├── ContentApp.tsx        # Fetches notes on load
    │       └── utils/
    │           └── api.ts            # Service worker communication
```

## How It Works

1. **Page Load**: Content script sends `FETCH_NOTES` message to service worker
2. **Service Worker**: Fetches notes from `http://localhost:3000/notes?url=...`
3. **Render**: Notes are displayed at their saved positions
4. **User Actions**:
   - **Create**: Sends `CREATE_NOTE` → POST to backend
   - **Update**: Debounced `UPDATE_NOTE` → PATCH to backend (500ms delay)
   - **Delete**: Sends `DELETE_NOTE` → DELETE to backend
5. **Reload**: Notes persist because they're in the database

## Troubleshooting

### Extension can't connect to backend
- ✅ Check backend is running: `curl http://localhost:3000/health`
- ✅ Check CORS in `apps/backend/src/main.ts`
- ✅ Verify manifest has `host_permissions` for `localhost:3000`

### Notes not persisting
- ✅ Check browser console for errors
- ✅ Check service worker console (chrome://extensions/ → service worker link)
- ✅ Verify database connection: `npm run prisma:studio`

### Migration errors
- ✅ Ensure PostgreSQL is running: `docker ps`
- ✅ Check `.env` DATABASE_URL is correct
- ✅ Try: `npm run prisma:migrate -- --reset` (⚠️ deletes data)

## Next Steps

Phase 4 will add:
- User authentication (Firebase/Clerk)
- User-scoped notes
- JWT token handling
