-- Create matching auth users first, then replace the auth_user_id values below.

insert into public.technicians (
  auth_user_id,
  technician_code,
  full_name,
  username,
  mobile_number,
  email,
  city,
  state,
  service_center,
  category_access,
  assigned_categories,
  role,
  approval_status,
  is_active
) values
  ('00000000-0000-0000-0000-000000000001', 'ADMIN001', 'Primary Admin', 'admin.main', '9999999999', 'admin@example.com', 'Pune', 'Maharashtra', 'Central', array['All'], array['All'], 'admin', 'approved', true),
  ('00000000-0000-0000-0000-000000000002', 'TECH001', 'Ravi Kumar', 'tech.ravi', '9876543210', 'tech.ravi@example.com', 'Pune', 'Maharashtra', 'Pune SC', array['Fan', 'Mixer Grinder'], array['Fan'], 'technician', 'approved', true),
  ('00000000-0000-0000-0000-000000000003', 'LEAD001', 'Neha Singh', 'lead.neha', '9876543211', 'lead.neha@example.com', 'Mumbai', 'Maharashtra', 'Regional Lead', array['Fan', 'Kitchen Appliances'], array['Fan', 'Kitchen Appliances'], 'team_lead', 'approved', true)
on conflict (technician_code) do nothing;

insert into public.support_contacts (name, designation, phone, category, subcategory, issue_type, notes, priority_order, is_active)
values
  ('Manish', 'Support Engineer', '9999999001', 'Fan', 'Mechanical', 'Mechanical', 'Primary mechanical support', 1, true),
  ('Vedant', 'Electrical Support', '9999999002', 'Fan', 'Electrical', 'Electrical', 'Primary electrical support', 2, true),
  ('Hasan', 'Product Specialist', '9999999003', 'Fan', 'TPW / Exhaust / Table / Wall Mount Fan', 'Product Support', 'General fan product support', 3, true),
  ('Sachin', 'Appliance Support', '9999999004', 'Mixer Grinder', 'General', 'Product Support', 'Mixer grinder support', 4, true),
  ('Manoj', 'Smart Devices Support', '9999999005', 'Smart Lock', 'General', 'Product Support', 'Smart lock support', 5, true),
  ('Pradip', 'Fan Lead', '9999999006', 'Fan', 'Lead', 'Escalation', 'Fan escalation lead', 6, true),
  ('Sakha', 'Kitchen Appliances Lead', '9999999007', 'Kitchen Appliances', 'Lead', 'Escalation', 'Kitchen escalation lead', 7, true)
on conflict do nothing;

insert into public.categories (name, is_active)
values
  ('Fan', true),
  ('Mixer Grinder', true),
  ('TPW', true),
  ('Smart Lock', true)
on conflict (name) do nothing;

insert into public.issue_types (name, is_active)
values
  ('Mechanical', true),
  ('Electrical', true),
  ('Product/Part Issue', true),
  ('Customer Escalation', true)
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

insert into public.parts (category, subcategory, model_name, fg_code, part_name, part_code, short_description, image_url, tags, is_active)
values
  ('Fan', 'Mechanical', 'Renesa 1200', 'FG-FAN-001', 'Motor Assembly', 'PT-1001', 'Main motor assembly for fan.', 'https://images.unsplash.com/photo-1581093458791-9d42e5d5df47', array['motor', 'fan', 'assembly'], true),
  ('Fan', 'Electrical', 'Renesa 1200', 'FG-FAN-001', 'Capacitor', 'PT-1002', 'Electrical capacitor for start/run support.', 'https://images.unsplash.com/photo-1518770660439-4636190af475', array['capacitor', 'fan'], true),
  ('Mixer Grinder', 'General', 'MG Pro 500', 'FG-MIX-002', 'Jar Coupler', 'PT-2001', 'Replacement coupler for mixer jar.', null, array['coupler', 'mixer', 'jar'], true)
on conflict (part_code) do nothing;

insert into public.search_logs (technician_id, search_type, search_query, result_count)
select id, 'part_name', 'motor assembly', 1
from public.technicians
where technician_code = 'TECH001'
on conflict do nothing;

insert into public.crm_tickets (ticket_number, technician_id, technician_name, technician_phone, issue_type, category, description, status)
select 'CRM-10000001', id, full_name, mobile_number, 'Login issue', 'CRM', 'Sample seeded CRM login issue.', 'New'
from public.technicians
where technician_code = 'TECH001'
on conflict (ticket_number) do nothing;

insert into public.operations_requests (request_number, technician_id, technician_name, technician_phone, request_type, quantity, size, location, description, status)
select 'OPS-10000001', id, full_name, mobile_number, 'T-shirt required', 2, 'L', 'Pune', 'Need replacement field uniform.', 'Approved'
from public.technicians
where technician_code = 'TECH001'
on conflict (request_number) do nothing;

insert into public.spare_issues (issue_number, technician_id, technician_name, technician_phone, category, subcategory, model_name, fg_code, part_name, part_code, issue_type, description, status)
select 'SPR-10000001', id, full_name, mobile_number, 'Fan', 'Mechanical', 'Renesa 1200', 'FG-FAN-001', 'Motor Assembly', 'PT-1001', 'Spare not available', 'Motor assembly not available in local inventory.', 'In Review'
from public.technicians
where technician_code = 'TECH001'
on conflict (issue_number) do nothing;
