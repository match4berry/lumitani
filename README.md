# Lumitani Dashboard

Basic monorepo with a TypeScript Express API (`server/`) and a placeholder frontend (`client/`).

## Prerequisites

- Node.js 20+
- npm 10+
- Docker + Docker Compose

## Quick Setup

1. Install server dependencies:

```bash
cd server
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

3. Start PostgreSQL with Docker (from repo root):

```bash
cd ..
npm run db:up
```

4. Run the API in development mode (from repo root):

```bash
npm run dev
```

5. Health check:

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{"status":"ok"}
```

## Useful Commands

From repo root:

- `npm run dev` - start server in watch mode
- `npm run build` - compile TypeScript server to `server/dist`
- `npm run start` - run compiled server
- `npm run db:up` - start PostgreSQL container
- `npm run db:down` - stop PostgreSQL container

## Notes

- SQL files in `server/src/migrations` are auto-run by the Postgres container on first initialization.
- `client/` is currently empty and ready for frontend setup.
