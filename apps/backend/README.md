# Backend App

NestJS backend for Contextual Web Notes.

## Development

```bash
# Start PostgreSQL (on port 5433 to avoid conflicts)
docker-compose up -d

# Install dependencies
npm install

# Set up environment (.env file should already exist with correct DATABASE_URL)
# If not, create .env with:
# DATABASE_URL=postgresql://user:password@localhost:5433/contextual_notes?schema=public
# PORT=3000
# NODE_ENV=development

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate -- --name init

# Start dev server
npm run start:dev
```

**Note**: The database runs on port **5433** (not 5432) to avoid conflicts with any local PostgreSQL instance.

## API Endpoints

- `GET /` - Health check
- `GET /health` - Health status
- `GET /notes?url=...` - Get all notes for a URL
- `POST /notes` - Create a new note
- `PATCH /notes/:id` - Update a note
- `DELETE /notes/:id` - Delete a note

## Database

- View data in Prisma Studio: `npm run prisma:studio`
- Access at: `http://localhost:5555`

