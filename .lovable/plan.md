# Admin Course Editor

Set up Lovable Cloud so approved admins can edit programs/courses through a web UI, while students continue to browse without login.

## What gets built

### Backend (Lovable Cloud)
- **Tables**
  - `programs` — id, slug, name, degree_type, transfer_to, total_units, notes
  - `courses` — id, program_id (FK), code, title, units, year, semester, prerequisites (text[]), satisfies (text[]), optional (bool), note, sort_order
  - `user_roles` — user_id, role (enum: `admin`)
- **Security**
  - RLS on all tables
  - Public `SELECT` on `programs` and `courses` (so students see pathways without login)
  - `INSERT/UPDATE/DELETE` on `programs` and `courses` restricted to admins via `has_role(auth.uid(), 'admin')` security-definer function
  - `user_roles` readable by the row's own user; writes admin-only
- **Seed**: migrate the current `src/data/program.json` into the new tables on first run.

### Auth
- Email + password sign in
- Google sign in (broker)
- `/login` page (public)
- No public signup form — admins are provisioned by you assigning the `admin` role in the database. Anyone can technically create an auth account, but without a role they see no admin UI.

### Frontend
- **Public pages** (existing) — switched to fetch from Cloud instead of the static JSON. Students see no difference.
- **`/admin`** — protected. Lists all programs, lets admin:
  - Create / rename / delete a program
  - Open a program → edit course table inline (add row, edit fields, delete, reorder, toggle optional, edit note)
- **Header** — shows "Admin" link + "Sign out" when signed-in admin, "Sign in" otherwise.

### How you become the first admin
After Cloud is enabled and you sign up once, I'll give you a one-line SQL snippet to run in the Cloud → Database tool that grants your user the `admin` role. From then on you (or any other admin) can promote others through the admin UI.

## Out of scope for this pass
- GE course list editor (stays static for now — easy to add later)
- Drag-and-drop course reordering (use up/down buttons first)
- Audit log of edits
- Bulk Excel re-import through the UI (you can still send me an .xlsx and I'll reseed)

## Technical notes
- All DB access goes through TanStack `createServerFn` — public reads use `supabaseAdmin` with explicit column projection; admin writes use `requireSupabaseAuth` + `has_role` check.
- The static `src/data/program.json` stays in the repo as the seed source but is no longer read at runtime.
