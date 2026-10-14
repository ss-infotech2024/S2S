# Skill Training Center · Admin

Standalone, frontend-only admin console for the Skill Training Center (SS Infotech) website.

**Login:** ID `admin@123` · Password `admin@123` (override with `VITE_ADMIN_ID` / `VITE_ADMIN_PASSWORD` in `.env`).

## Run / deploy
```
npm install
npm run dev        # http://localhost:5174
npm run build      # outputs dist/ (deploy to Netlify/Vercel; SPA rewrites included)
```

## What's inside
Sidebar: Dashboard · Courses · Online Training · Classroom Training · Colleges & Gallery · Placements · Blog · Students / Users · Contact Enquiries · Settings.
Online/Classroom batches link to a course; students record mode (online/classroom) and batch. Settings holds the institute profile, backup, restore and reset.
Search, status filters, pagination, CSV export, field validation, 30-minute idle sign-out, login lockout after 5 wrong attempts.
Courses, placements and blog are pre-filled from the website's current content.

## CRUD on every screen
- **Create**: Add new / Copy (duplicates a row as a draft with a fresh slug / enrollment ID).
- **Read**: searchable, sortable (click a column heading), paginated lists; click a row's name for a read-only detail view of every field.
- **Update**: Edit form with validation, one-click Live/Draft and status toggles, and bulk **Set live / Set draft / Set status** on selected rows.
- **Delete**: single or bulk delete with confirmation.
- **Linked data stays consistent**: renaming a course, trainer, centre, college, country, category or company updates every row that refers to it; deleting something still in use shows where it is used first. Duplicate URL slugs / enrollment IDs are rejected.

## API (`npm run server`)
`GET /api/:table`, `GET /api/:table/:id`, `POST /api/:table`, `PUT|PATCH /api/:table/:id`, `DELETE /api/:table/:id`.
Admin calls need the `x-admin-token` header. Missing rows return 404, duplicate slugs 409, bad bodies 400. The website may only POST to forms (enrollments, enquiries, corp/overseas enquiries, testimonials) and read published rows.

## Important limits (no backend)
- Data is saved in this browser only. Use **Back up data** often; clearing browser data erases it.
- The login is a front-end gate. The ID and password are readable in the built JavaScript, so anyone technical can bypass it. Do not use it to protect sensitive student data until a real backend login is added.
- Edits here do not change the public website yet.

## Backend later
Only `src/store.ts` touches storage. Replace `listRows`, `saveRow`, `deleteRow` with API calls.
