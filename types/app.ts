export type Role = "technician" | "admin" | "team_lead";
export type ApprovalStatus = "pending" | "approved" | "blocked";

export type TechnicianProfile = {
  id: string;
  auth_user_id: string;
  technician_code: string | null;
  full_name: string | null;
  username: string | null;
  mobile_number: string;
  email: string | null;
  city: string | null;
  state: string | null;
  service_center: string | null;
  category_access: string[] | null;
  assigned_categories?: string[] | null;
  role: Role;
  approval_status: ApprovalStatus;
  is_active: boolean;
};

export type DashboardMetric = {
  label: string;
  value: string | number;
  helper?: string;
};

export type IssueType = {
  id: string;
  name: string;
  is_active?: boolean;
};

export type TicketTable = "crm_tickets" | "operations_requests" | "spare_issues";
