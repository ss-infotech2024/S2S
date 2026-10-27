# Fusion Starter

S2S Skill Training Center: public website + student LMS, admin panel and API, built with React Router 6 SPA mode, TypeScript, Vitest, Zod and modern tooling.

The project has three separate parts: the student website (`client/`, Vite at the repo root), the admin panel (`admin/`, its own Vite app) and the API (`backend/`, a plain Node `http` server on MongoDB). There is no Express server in this repo.

## Tech Stack

- **PNPM**: Prefer pnpm
- **Frontend**: React 18 + React Router 6 (spa) + TypeScript + Vite + TailwindCSS 3
- **Backend**: `backend/server/index.js` — Node `http` + MongoDB, student sessions in an HttpOnly cookie, admin calls via `x-admin-token`
- **Testing**: Vitest (client), `node:test` (backend)
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## Project Structure

```
client/                   # Student website + student LMS (React SPA)
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── lib/studentApi.ts     # Student API base URL, session helpers
├── App.tsx               # App entry point and SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

admin/                    # Admin panel (separate Vite app, port 5174)
backend/                  # API server (port 8787)
├── server/index.js       # All routes
├── src/seed.json         # Seed data for empty collections
└── test/                 # Integration tests (use a throwaway database)
```

## Key Features

## SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page.
- Routes are defined in `client/App.tsx` using the `react-router-dom` import
- Route files are located in the `client/pages/` directory

For example, routes can be defined with:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

### Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/global.css` 
- **UI components**: Pre-built library in `client/components/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge` for conditional classes

```typescript
// cn utility usage
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // User overrides
)}
```

### API

- Base URL from `VITE_API_URL` (default `http://localhost:8787`); every route is prefixed with `/api/`.
- Public: `GET /api/courses` and other published content, form `POST`s, `/api/student-auth/*`.
- Student (session cookie): `GET /api/student/courses`, `GET /api/student/courses/:courseId` — only courses in the student's `assignedCourseIds`.
- Admin (`x-admin-token`): generic CRUD, `GET /api/students`, `PUT /api/students/:studentId/courses`, enrollment approval, setup-link resend.

## Development Commands

```bash
pnpm dev                     # Student website on http://localhost:8080
npm --prefix backend start   # API on http://localhost:8787 (needs backend/.env)
npm --prefix admin run dev   # Admin panel on http://localhost:5174
pnpm build                   # Production build of the website (dist/spa)
pnpm start                   # Preview the production build
pnpm typecheck               # TypeScript validation
pnpm test                    # Client Vitest tests
npm --prefix backend test    # Backend integration tests
```

## Adding Features

### Add new colors to the theme

Open `client/global.css` and `tailwind.config.ts` and add new tailwind colors.

### New API Route
Add a handler block in `backend/server/index.js` before the generic `/api/:table` handler. Derive the student from `getSessionStudent(req, res)`, never from request data, and check `isAdmin(req)` for admin routes.

### New Page Route
1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx` (wrap in `ProtectedStudentRoute` if it is student-only):
```typescript
<Route path="/my-page" element={<MyPage />} />
```

## Production Deployment

- **Standard**: `pnpm build`
- **Cloud Deployment**: Use either Netlify or Vercel via their MCP integrations for easy deployment. Both providers work well with this starter template.

## Architecture Notes

- Website, admin panel and API run as separate processes
- TypeScript throughout (client, server, shared)
- Full hot reload for rapid development
- Production-ready with multiple deployment options
- Comprehensive UI component library included
