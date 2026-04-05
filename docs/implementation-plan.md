# Refactor Improvement Plan

## Current Structure Summary

### Current pages

- Auth: `/login`
- Technician: `/dashboard`, `/support`, `/parts`, `/parts/[id]`, `/crm`, `/crm/new`, `/crm/[id]`, `/operations`, `/operations/new`, `/operations/[id]`, `/spares`, `/spares/new`, `/spares/[id]`, `/activity`
- Admin and lead: `/admin`, `/admin/technicians`, `/admin/contacts`, `/admin/parts`, `/admin/crm`, `/admin/operations`, `/admin/spares`, `/admin/logins`, `/analytics`

### Current reusable building blocks

- Shared shell: `AppHeader`, `MobileNav`, `PageHeader`, `SectionCard`, `StatusBadge`, `EmptyState`, `InfoGrid`
- Form primitives: `TextField`, `TextAreaField`, `SelectField`, `SubmitButton`
- Feature blocks: `ContactCard`, `PartCard`, `ActionCard`, `MetricCard`, `SimpleTable`
- Data layer: `lib/actions`, `lib/data/queries`, `lib/auth`, `lib/supabase/*`, `lib/validators`

### Current data model already present

- `technicians`
- `login_history`
- `support_contacts`
- `support_logs`
- `parts`
- `crm_tickets`
- `operations_requests`
- `spare_issues`

## Keep / Modify / Remove

### Keep

- App Router structure under `app/(auth)` and `app/(protected)`
- Supabase SSR/auth client setup
- Route protection middleware
- Existing domain tables and role model
- Existing form/action pattern for typed submissions
- PWA manifest/config foundation

### Modify

- `app/globals.css`: convert from website shell to denser Android app shell
- `app/(protected)/layout.tsx`: app container, safe-area padding, tighter screen framing
- `components/mobile-nav.tsx`: active state, better touch targets, role-aware app navigation
- `components/ui/*`: stronger app-style cards, top bar, status chips, section spacing
- `app/(protected)/*`: simplify each screen for one-hand field use
- `lib/actions/index.ts`: add search logging, admin status updates, exports, image upload path stubs
- `lib/data/queries.ts`: add richer analytics aggregations, filters, admin detail queries
- `supabase/schema.sql`: add `search_logs`, storage prep notes, stronger RLS/indexes
- `supabase/seed/seed.sql`: extend seed data for logs and analytics testing
- `README.md`: update setup, Android/PWA notes, Capacitor-readiness notes
- `.env.example`: include any missing envs used for uploads/app URL

### Remove

- Duplicate CSV template under `templates/` after keeping the public copy
- JetBrains project folder `.idea/` from app handoff scope
- Any overly desktop-style max-width assumptions in shared layout

## Refactor Order

1. Update schema and seed data
2. Refactor shared mobile shell and navigation
3. Refactor technician home and primary task flows
4. Add search logging and richer analytics
5. Strengthen admin workflows and export paths
6. Finish docs and Capacitor notes

## Android UX Direction

- Use compact app-header + bottom tab bar
- Keep content inside phone-friendly width with strong touch targets
- Home screen shows exactly 6 core task cards first:
  - Call Support
  - Find Part Code
  - CRM/App Issue
  - Operations Request
  - Spare Part Issue
  - My Tickets
- Keep secondary actions like login activity and admin tools one level deeper
- Minimize typing by preferring chips, segmented filters, and quick selects
