# Backend Setup Guide - Phase 3

## Prerequisites

- Docker Desktop installed and running
- Node.js >= 18.0.0
- npm or yarn

## Step 1: Start PostgreSQL Database

```bash
cd apps/backend
docker-compose up -d
```

This will start PostgreSQL on port 5432.

Verify it's running:
```bash
docker ps
```

You should see `contextual-notes-db` container running.

## Step 2: Set Up Environment Variables

Create a `.env` file in `apps/backend/`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/contextual_notes?schema=public"
PORT=3000
NODE_ENV=development
```

## Step 3: Generate Prisma Client

```bash
cd apps/backend
npm run prisma:generate
```

This generates the Prisma Client based on the schema.

## Step 4: Run Database Migrations

```bash
cd apps/backend
npm run prisma:migrate
```

This will:
- Create the database tables
- Run the initial migration
- Apply the Note model schema

**Note**: When prompted for a migration name, enter `init` or press Enter for the default.

## Step 5: Start the Backend Server

```bash
cd apps/backend
npm run start:dev
```

The server should start on `http://localhost:3000`

You should see:
```
🚀 Backend server running on http://localhost:3000
```

## Step 6: Verify API Endpoints

Test the API:

```bash
# Health check
curl http://localhost:3000/health

# Create a note
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.google.com","content":"Test note","x":100,"y":200}'

# Get notes for URL
curl "http://localhost:3000/notes?url=https://www.google.com"
```

## Step 7: View Database (Optional)

Open Prisma Studio to view/edit data:

```bash
cd apps/backend
npm run prisma:studio
```

This opens a browser at `http://localhost:5555` where you can see all notes in the database.

## Troubleshooting

### Database connection issues
- Make sure Docker is running
- Check if PostgreSQL container is up: `docker ps`
- Verify DATABASE_URL in `.env` matches docker-compose.yml

### Port already in use
- Change PORT in `.env` or docker-compose.yml
- Make sure nothing else is using port 3000 or 5432

### Migration errors
- Try: `npm run prisma:migrate -- --reset` (⚠️ This will delete all data!)
- Check Prisma schema syntax
- Ensure Prisma client is generated: `npm run prisma:generate`

### CORS errors from extension
- Verify backend is running on `http://localhost:3000`
- Check CORS configuration in `src/main.ts`
- Ensure extension manifest has host_permissions for localhost

## Next Steps

Once backend is running, test the extension:
1. Load extension in Chrome
2. Visit `google.com`
3. Create a note
4. Reload the page - note should persist!
5. Check Prisma Studio to see the note in the database
