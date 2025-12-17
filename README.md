# Project Build Guide

## Tech Stack

This project is built using the following technologies:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Prerequisites

Make sure your system has Node.js and npm installed.

We recommend using nvm to install Node.js: [nvm Installation Guide](https://github.com/nvm-sh/nvm#installing-and-updating)

## Environment Variables

Copy `.env.example` to `.env` and provide your Supabase credentials:

```
cp .env.example .env
```

Update `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the project values. Never commit real keys.

## Install Dependencies

```sh
npm install
```

## Development Server

Start the development server with hot reload and instant preview:

```sh
npm run dev
```

## Build Project

Build for production:

```sh
npm run build
```

## Preview Build

Preview the built project:

```sh
npm run preview
```

## Project Structure

```
src/
├── components/     # UI Components
├── pages/         # Page Components
├── hooks/         # Custom Hooks
├── lib/           # Utility Library
└── main.tsx       # Application Entry Point
```

## Bootstrapping the First Admin User

1. Create the initial email/password user through the Supabase dashboard or CLI using:
   - Email: `thimos.arvanitis@admin.local`
   - Password: `Realmadrid_7`
2. Copy the new user’s UUID (`auth.users.id`).
3. Insert that UUID into the `public.admins` table so the account has admin rights:

```sql
insert into public.admins (id) values ('<copied-user-id>');
```

Only rows in `public.admins` are treated as administrators in the application and by the Row Level Security policies.
