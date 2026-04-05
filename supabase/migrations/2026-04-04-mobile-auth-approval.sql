do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'technician_approval_status'
  ) then
    create type public.technician_approval_status as enum ('pending', 'approved', 'blocked');
  end if;
end $$;

alter table public.technicians
  alter column technician_code drop not null,
  alter column full_name drop not null,
  alter column username drop not null;

alter table public.technicians
  add column if not exists approval_status public.technician_approval_status not null default 'pending';

alter table public.technicians
  alter column is_active set default false;

create index if not exists idx_technicians_approval_status
  on public.technicians(approval_status, is_active);

update public.technicians
set approval_status = 'approved'
where role in ('admin', 'team_lead')
  and approval_status = 'pending';

drop policy if exists "technician signup insert own pending profile" on public.technicians;
create policy "technician signup insert own pending profile" on public.technicians
for insert with check (
  auth.uid() = auth_user_id
  and role = 'technician'
  and approval_status = 'pending'
);
