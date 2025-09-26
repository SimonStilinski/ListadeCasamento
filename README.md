# Wedding Gift List - Minimal Next.js Scaffold

**What this is**
- A minimal Next.js app that provides:
  - Public page with a list of gifts (name, image, external link).
  - Button "Marcar como comprado" that marks items as purchased.
  - Simple admin page to add/edit/remove gifts.
  - Backend API routes that store data in a JSON file (`data/gifts.json`) so no DB setup required.

**How to run locally**
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run dev server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000

**Notes**
- This uses a file-based JSON "database" (`data/gifts.json`). For production, migrate to a real DB (Postgres / Supabase).
- Admin "login" is a fake front-end-only flow for demo. Protect admin routes for production.
- To reset example data, edit `data/gifts.json`.

**Files included**
- pages/* : Next.js pages (index, admin, api)
- public/* : example images
- data/gifts.json : seeded example gifts
