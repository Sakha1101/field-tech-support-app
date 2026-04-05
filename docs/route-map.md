# Route Map

## Technician

- `/login` - username/mobile + password login
- `/dashboard` - app home with 6 main task cards
- `/support` - support category selection, issue-type filtering, contact cards, call/log actions
- `/parts` - part finder with category/model/FG/name/code search
- `/parts/[id]` - part detail with image and identifiers
- `/crm/new` - create CRM/app issue ticket
- `/crm` - my CRM tickets
- `/crm/[id]` - CRM ticket detail
- `/operations/new` - create operations request
- `/operations` - my operations requests
- `/operations/[id]` - operations request detail
- `/spares/new` - create spare issue
- `/spares` - my spare issues
- `/spares/[id]` - spare issue detail
- `/activity` - my login activity

## Admin / Team Lead

- `/admin` - admin home
- `/admin/technicians` - create/search/activate/deactivate/reset password
- `/admin/contacts` - manage support contacts
- `/admin/parts` - manage parts and import CSV
- `/admin/crm` - manage CRM tickets
- `/admin/operations` - manage operations requests
- `/admin/spares` - manage spare issues
- `/admin/logins` - login monitoring
- `/analytics` - analytics dashboard with filters

## API Routes

- `/api/auth/logout` - logout + update login history
- `/api/admin/users` - admin create auth user
- `/api/admin/reset-password` - admin reset password
- `/api/parts/import` - parts CSV import

## Future-ready for Capacitor

- Keep route structure shallow and mobile-first
- Avoid browser-only patterns that conflict with WebView packaging
- Prefer same-origin API routes and Supabase server actions for later Android wrapping
