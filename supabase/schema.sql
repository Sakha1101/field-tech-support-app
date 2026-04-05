create extension if not exists "pgcrypto";

create type public.app_role as enum ('technician', 'admin', 'team_lead');
create type public.technician_approval_status as enum ('pending', 'approved', 'blocked');
create type public.crm_ticket_status as enum ('New', 'In Progress', 'Waiting for User', 'Resolved', 'Closed');
create type public.operations_request_status as enum ('New', 'Approved', 'Rejected', 'Dispatched', 'Delivered', 'Closed');
create type public.spare_issue_status as enum ('New', 'In Review', 'Waiting for Update', 'Resolved', 'Closed');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.technicians (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  technician_code text unique,
  full_name text,
  username text unique,
  mobile_number text not null unique,
  email text unique,
  city text,
  state text,
  service_center text,
  category_access text[] default '{}',
  assigned_categories text[] default '{}',
  role public.app_role not null default 'technician',
  approval_status public.technician_approval_status not null default 'pending',
  is_active boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.login_history (
  id uuid primary key default gen_random_uuid(),
  technician_id uuid not null references public.technicians(id) on delete cascade,
  auth_user_id uuid references auth.users(id) on delete cascade,
  username text not null,
  login_time timestamptz not null default timezone('utc', now()),
  logout_time timestamptz,
  session_id uuid not null default gen_random_uuid(),
  device_type text,
  platform text,
  login_status text not null default 'success',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.support_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text,
  phone text,
  mobile_number text,
  category text,
  category_id uuid,
  subcategory text,
  issue_type text,
  issue_type_id uuid,
  notes text,
  priority_order integer not null default 1,
  escalation_level integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.issue_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.support_contacts
  add constraint support_contacts_category_fk foreign key (category_id) references public.categories(id) on delete set null;

alter table public.support_contacts
  add constraint support_contacts_issue_type_fk foreign key (issue_type_id) references public.issue_types(id) on delete set null;

create table if not exists public.support_call_logs (
  id uuid primary key default gen_random_uuid(),
  technician_id uuid not null references public.technicians(id) on delete cascade,
  technician_name text not null,
  technician_mobile text not null,
  category_id uuid references public.categories(id) on delete set null,
  category_name text not null,
  issue_type_id uuid references public.issue_types(id) on delete set null,
  issue_type_name text not null,
  support_contact_id uuid references public.support_contacts(id) on delete set null,
  support_contact_name text not null,
  support_contact_mobile text not null,
  escalation_level integer not null,
  call_action text not null default 'call',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.support_logs (
  id uuid primary key default gen_random_uuid(),
  technician_id uuid not null references public.technicians(id) on delete cascade,
  technician_name text not null,
  category text not null,
  issue_type text not null,
  assigned_person_name text not null,
  assigned_person_id uuid references public.support_contacts(id) on delete set null,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.parts (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  subcategory text,
  model_name text,
  fg_code text,
  part_name text not null,
  part_code text not null unique,
  short_description text,
  image_url text,
  tags text[] default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.search_logs (
  id uuid primary key default gen_random_uuid(),
  technician_id uuid not null references public.technicians(id) on delete cascade,
  search_type text not null,
  search_query text not null,
  result_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.crm_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  technician_id uuid not null references public.technicians(id) on delete cascade,
  technician_name text not null,
  technician_phone text not null,
  issue_type text not null,
  category text not null,
  description text not null,
  status public.crm_ticket_status not null default 'New',
  admin_comment text,
  resolution text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.operations_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique,
  technician_id uuid not null references public.technicians(id) on delete cascade,
  technician_name text not null,
  technician_phone text not null,
  request_type text not null,
  quantity integer not null default 1,
  size text,
  location text not null,
  description text not null,
  status public.operations_request_status not null default 'New',
  admin_comment text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.spare_issues (
  id uuid primary key default gen_random_uuid(),
  issue_number text not null unique,
  technician_id uuid not null references public.technicians(id) on delete cascade,
  technician_name text not null,
  technician_phone text not null,
  category text not null,
  subcategory text,
  model_name text,
  fg_code text,
  part_name text,
  part_code text,
  issue_type text not null,
  description text not null,
  status public.spare_issue_status not null default 'New',
  admin_comment text,
  resolution text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_technicians_username on public.technicians(username);
create index if not exists idx_technicians_mobile_number on public.technicians(mobile_number);
create index if not exists idx_technicians_approval_status on public.technicians(approval_status, is_active);
create index if not exists idx_login_history_technician on public.login_history(technician_id, login_time desc);
create index if not exists idx_support_contacts_lookup on public.support_contacts(category, issue_type, is_active);
create index if not exists idx_support_contacts_routing on public.support_contacts(category_id, issue_type_id, escalation_level, is_active);
create index if not exists idx_categories_active on public.categories(is_active, name);
create index if not exists idx_issue_types_active on public.issue_types(is_active, name);
create index if not exists idx_support_call_logs_technician on public.support_call_logs(technician_id, created_at desc);
create index if not exists idx_parts_lookup on public.parts(category, model_name, fg_code, part_code);
create index if not exists idx_search_logs_technician on public.search_logs(technician_id, created_at desc);
create index if not exists idx_search_logs_query on public.search_logs(search_type, search_query);
create index if not exists idx_crm_tickets_technician on public.crm_tickets(technician_id, created_at desc);
create index if not exists idx_operations_requests_technician on public.operations_requests(technician_id, created_at desc);
create index if not exists idx_spare_issues_technician on public.spare_issues(technician_id, created_at desc);

drop trigger if exists trg_technicians_updated_at on public.technicians;
create trigger trg_technicians_updated_at before update on public.technicians for each row execute procedure public.set_updated_at();
drop trigger if exists trg_support_contacts_updated_at on public.support_contacts;
create trigger trg_support_contacts_updated_at before update on public.support_contacts for each row execute procedure public.set_updated_at();
drop trigger if exists trg_parts_updated_at on public.parts;
create trigger trg_parts_updated_at before update on public.parts for each row execute procedure public.set_updated_at();
drop trigger if exists trg_crm_tickets_updated_at on public.crm_tickets;
create trigger trg_crm_tickets_updated_at before update on public.crm_tickets for each row execute procedure public.set_updated_at();
drop trigger if exists trg_operations_requests_updated_at on public.operations_requests;
create trigger trg_operations_requests_updated_at before update on public.operations_requests for each row execute procedure public.set_updated_at();
drop trigger if exists trg_spare_issues_updated_at on public.spare_issues;
create trigger trg_spare_issues_updated_at before update on public.spare_issues for each row execute procedure public.set_updated_at();

alter table public.technicians enable row level security;
alter table public.login_history enable row level security;
alter table public.support_contacts enable row level security;
alter table public.categories enable row level security;
alter table public.issue_types enable row level security;
alter table public.support_call_logs enable row level security;
alter table public.support_logs enable row level security;
alter table public.parts enable row level security;
alter table public.search_logs enable row level security;
alter table public.crm_tickets enable row level security;
alter table public.operations_requests enable row level security;
alter table public.spare_issues enable row level security;

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
as $$
  select role from public.technicians where auth_user_id = auth.uid()
$$;

create or replace function public.current_categories()
returns text[]
language sql
stable
as $$
  select coalesce(assigned_categories, category_access, '{}') from public.technicians where auth_user_id = auth.uid()
$$;

create policy "technicians read own profile" on public.technicians
for select using (auth.uid() = auth_user_id or public.current_app_role() = 'admin');

create policy "technician signup insert own pending profile" on public.technicians
for insert with check (
  auth.uid() = auth_user_id
  and role = 'technician'
  and approval_status = 'pending'
);

create policy "admins manage technicians" on public.technicians
for all using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "technicians read own logins" on public.login_history
for select using (
  technician_id in (select id from public.technicians where auth_user_id = auth.uid())
  or public.current_app_role() = 'admin'
  or (
    public.current_app_role() = 'team_lead'
    and exists (
      select 1 from public.technicians t
      where t.id = login_history.technician_id
      and coalesce(t.category_access, '{}') && coalesce(public.current_categories(), '{}')
    )
  )
);

create policy "authenticated insert login history" on public.login_history
for insert with check (auth.uid() is not null);

create policy "authenticated update own login history" on public.login_history
for update using (auth.uid() = auth_user_id or public.current_app_role() = 'admin');

create policy "support contacts readable by authenticated" on public.support_contacts
for select using (auth.uid() is not null);

create policy "admins manage support contacts" on public.support_contacts
for all using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "categories readable by authenticated" on public.categories
for select using (auth.uid() is not null);

create policy "admins manage categories" on public.categories
for all using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "issue types readable by authenticated" on public.issue_types
for select using (auth.uid() is not null);

create policy "admins manage issue types" on public.issue_types
for all using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "support call logs insert own" on public.support_call_logs
for insert with check (technician_id in (select id from public.technicians where auth_user_id = auth.uid()));

create policy "support call logs read scoped" on public.support_call_logs
for select using (
  technician_id in (select id from public.technicians where auth_user_id = auth.uid())
  or public.current_app_role() in ('admin', 'team_lead')
);

create policy "support logs insert authenticated" on public.support_logs
for insert with check (auth.uid() is not null);

create policy "support logs read scoped" on public.support_logs
for select using (
  technician_id in (select id from public.technicians where auth_user_id = auth.uid())
  or public.current_app_role() in ('admin', 'team_lead')
);

create policy "parts readable by authenticated" on public.parts
for select using (auth.uid() is not null);

create policy "admins manage parts" on public.parts
for all using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "search logs insert own" on public.search_logs
for insert with check (technician_id in (select id from public.technicians where auth_user_id = auth.uid()));

create policy "search logs read scoped" on public.search_logs
for select using (
  technician_id in (select id from public.technicians where auth_user_id = auth.uid())
  or public.current_app_role() in ('admin', 'team_lead')
);

create policy "crm insert own" on public.crm_tickets
for insert with check (technician_id in (select id from public.technicians where auth_user_id = auth.uid()));

create policy "crm read scoped" on public.crm_tickets
for select using (
  technician_id in (select id from public.technicians where auth_user_id = auth.uid())
  or public.current_app_role() in ('admin', 'team_lead')
);

create policy "crm update admin" on public.crm_tickets
for update using (public.current_app_role() = 'admin');

create policy "operations insert own" on public.operations_requests
for insert with check (technician_id in (select id from public.technicians where auth_user_id = auth.uid()));

create policy "operations read scoped" on public.operations_requests
for select using (
  technician_id in (select id from public.technicians where auth_user_id = auth.uid())
  or public.current_app_role() in ('admin', 'team_lead')
);

create policy "operations update admin" on public.operations_requests
for update using (public.current_app_role() = 'admin');

create policy "spares insert own" on public.spare_issues
for insert with check (technician_id in (select id from public.technicians where auth_user_id = auth.uid()));

create policy "spares read scoped" on public.spare_issues
for select using (
  technician_id in (select id from public.technicians where auth_user_id = auth.uid())
  or public.current_app_role() in ('admin', 'team_lead')
);

create policy "spares update admin" on public.spare_issues
for update using (public.current_app_role() = 'admin');
