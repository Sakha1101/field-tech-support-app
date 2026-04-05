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

alter table public.support_contacts add column if not exists mobile_number text;
alter table public.support_contacts add column if not exists category_id uuid;
alter table public.support_contacts add column if not exists issue_type_id uuid;
alter table public.support_contacts add column if not exists escalation_level integer not null default 1;
alter table public.support_contacts alter column designation drop not null;

do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'support_contacts_category_fk'
  ) then
    alter table public.support_contacts
      add constraint support_contacts_category_fk
      foreign key (category_id) references public.categories(id) on delete set null;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'support_contacts_issue_type_fk'
  ) then
    alter table public.support_contacts
      add constraint support_contacts_issue_type_fk
      foreign key (issue_type_id) references public.issue_types(id) on delete set null;
  end if;
end $$;

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

create index if not exists idx_support_contacts_routing on public.support_contacts(category_id, issue_type_id, escalation_level, is_active);
create index if not exists idx_categories_active on public.categories(is_active, name);
create index if not exists idx_issue_types_active on public.issue_types(is_active, name);
create index if not exists idx_support_call_logs_technician on public.support_call_logs(technician_id, created_at desc);

alter table public.categories enable row level security;
alter table public.issue_types enable row level security;
alter table public.support_call_logs enable row level security;

drop policy if exists "categories readable by authenticated" on public.categories;
create policy "categories readable by authenticated" on public.categories
for select using (auth.uid() is not null);

drop policy if exists "admins manage categories" on public.categories;
create policy "admins manage categories" on public.categories
for all using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

drop policy if exists "issue types readable by authenticated" on public.issue_types;
create policy "issue types readable by authenticated" on public.issue_types
for select using (auth.uid() is not null);

drop policy if exists "admins manage issue types" on public.issue_types;
create policy "admins manage issue types" on public.issue_types
for all using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

drop policy if exists "support call logs insert own" on public.support_call_logs;
create policy "support call logs insert own" on public.support_call_logs
for insert with check (technician_id in (select id from public.technicians where auth_user_id = auth.uid()));

drop policy if exists "support call logs read scoped" on public.support_call_logs;
create policy "support call logs read scoped" on public.support_call_logs
for select using (
  technician_id in (select id from public.technicians where auth_user_id = auth.uid())
  or public.current_app_role() in ('admin', 'team_lead')
);

insert into public.categories (name, is_active)
values ('Fan', true), ('Mixer Grinder', true), ('TPW', true), ('Smart Lock', true)
on conflict (name) do nothing;

insert into public.issue_types (name, is_active)
values ('Mechanical', true), ('Electrical', true), ('Product/Part Issue', true), ('Customer Escalation', true)
on conflict (name) do nothing;

update public.support_contacts sc
set
  mobile_number = coalesce(sc.mobile_number, sc.phone),
  category_id = c.id,
  issue_type_id = it.id,
  escalation_level = case when sc.subcategory = 'Lead' or sc.issue_type = 'Escalation' then 2 else 1 end
from public.categories c, public.issue_types it
where sc.category = c.name
  and (
    (sc.issue_type = 'Mechanical' and it.name = 'Mechanical')
    or (sc.issue_type = 'Electrical' and it.name = 'Electrical')
    or (sc.issue_type = 'Product Support' and it.name = 'Product/Part Issue')
    or (sc.issue_type = 'Escalation' and it.name = 'Customer Escalation')
  );
