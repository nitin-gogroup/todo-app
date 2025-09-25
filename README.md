# Demo Todo Playwright

A full-stack Todo application built with Next.js, Drizzle ORM, SQLite. Includes authentication, API routes, and a modern UI.

## Features
- User authentication (NextAuth.js, credentials)
- Todo CRUD operations
- SQLite database via Drizzle ORM
- Modern UI with Radix UI and shadcn/ui components
- TypeScript throughout

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

### Installation
```bash
pnpm install
```

### Database Setup
- Local: Uses SQLite (`file:./db.sqlite`)
- Remote: Set up SQLite file url and update `.env.local`:
	```env
    DATABASE_URL="sqlite.db"
	DATABASE_AUTH_TOKEN="your-auth-token"
	```
- Run migrations:
```bash
pnpm db:migrate
```

### Running the App
```bash
pnpm dev
```

## Project Structure
```
src/
	app/           # Next.js app directory
	components/    # UI components
	db/            # Drizzle ORM schema & db setup
	modules/       # Feature modules (home, signin, signup)
	shared/        # Shared types & constants
	utils/         # Utility functions
public/          # Static assets
```

## Environment Variables
See `.env.local` for required variables:
- `AUTH_SECRET` - NextAuth secret
- `DATABASE_URL` - SQLite or remote DB URL
