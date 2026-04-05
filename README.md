# Field Tech Support PWA

Android-friendly field technician support app built on Next.js, TypeScript, Tailwind CSS, and Supabase.

This project was refactored from the generated MVP into a more app-like mobile experience instead of a general website layout. The current structure is intentionally kept compatible with later Capacitor Android wrapping for Google Play distribution.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, Storage, and Row Level Security
- PWA support with `next-pwa`
- Vercel-ready deployment
- Future-ready for Capacitor Android packaging

## Core Modules

- Technician authentication with username/mobile + password
- Support contact directory with `tel:` calling and query logging
- Part code finder with image support and CSV import
- CRM/App issue ticketing
- Operations requests
- Spare part issues
- Login and activity tracking
- Admin and team lead analytics
- Admin management screens

## Current Refactor Direction

- Reused the generated route/action/schema foundation instead of rebuilding from scratch
- Shifted the shell toward an Android app feel with a phone-width frame, sticky header, and bottom tab navigation
- Kept technician flows card-based and touch-friendly
- Extended the schema with `search_logs` for part search analytics
- Added inline admin status updates and CSV export endpoints
- Added Supabase Storage-based part image upload support

## Setup

1. Create a Supabase project.
2. Create a public Storage bucket named `part-images` or set `NEXT_PUBLIC_SUPABASE_PARTS_BUCKET` to your bucket name.
3. Run [schema.sql](/D:/field-tech-support-pwa/supabase/schema.sql) in Supabase SQL Editor.
4. Create matching auth users for admin and sample technicians.
5. Run [seed.sql](/D:/field-tech-support-pwa/supabase/seed/seed.sql).
6. Copy `.env.example` to `.env.local`.
7. Fill in the environment values.
8. Install dependencies with `npm install`.
9. Run the app with `npm run dev`.
10. Deploy to Vercel with the same environment variables.

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_PARTS_BUCKET`

## Auth Model

- No public signup
- Admin creates users
- Login accepts technician username or mobile number
- Supabase Auth still uses email/password behind the scenes
- Technician must be active to access the app
- Successful login inserts into `login_history`
- Logout updates `logout_time`
- Middleware protects app routes

## Database Tables

- `technicians`
- `login_history`
- `support_contacts`
- `support_logs`
- `parts`
- `search_logs`
- `crm_tickets`
- `operations_requests`
- `spare_issues`

## CSV and Exports

- Parts import template: [parts-import-template.csv](/D:/field-tech-support-pwa/public/templates/parts-import-template.csv)
- Admin CSV export routes:
  - `/api/export/technicians`
  - `/api/export/contacts`
  - `/api/export/parts`
  - `/api/export/crm`
  - `/api/export/operations`
  - `/api/export/spares`
  - `/api/export/logins`
  - `/api/export/support_logs`

## Capacitor-Ready Notes

- Keep navigation shallow and route-driven
- Keep assets and manifest stable for WebView packaging
- Prefer same-origin API routes and server actions over browser-only integrations
- Avoid desktop-only hover dependencies in core technician flows
- When adding Capacitor later, start with:
  1. `npm install @capacitor/core @capacitor/cli`
  2. `npx cap init`
  3. `npx cap add android`
  4. Build the Next.js app as a static/PWA-compatible web bundle strategy that matches your hosting choice
  5. Sync with `npx cap sync android`

## Docs

- [Implementation Plan](/D:/field-tech-support-pwa/docs/implementation-plan.md)
- [Route Map](/D:/field-tech-support-pwa/docs/route-map.md)
- [Component Map](/D:/field-tech-support-pwa/docs/component-list.md)
- [Screen Map](/D:/field-tech-support-pwa/docs/screen-map.md)

## Notes

- This environment does not currently have Node.js installed, so dependency install, lint, typecheck, and production build were not run here.
- The UI refactor focused on mobile technician usability first; admin screens remain functional but can be further card-optimized later if your admin users are also primarily mobile.
- Full charting for daily, weekly, and monthly trends can be layered on top of the current analytics data shape without changing the schema again.
