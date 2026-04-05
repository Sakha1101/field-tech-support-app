import { z } from "zod";

export function normalizeMobileNumber(value: string) {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly.slice(-10);
}

export const loginSchema = z.object({
  mobile_number: z.string().min(10, "Enter mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  mobile_number: z.string().min(10, "Enter mobile number"),
  otp: z.string().min(4, "Enter OTP"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2).optional(),
});

export const crmTicketSchema = z.object({
  issue_type: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(10).max(500),
});

export const operationsRequestSchema = z.object({
  request_type: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(999),
  size: z.string().optional(),
  location: z.string().min(2).max(120),
  description: z.string().min(5).max(500),
});

export const spareIssueSchema = z.object({
  category: z.string().min(1),
  subcategory: z.string().optional(),
  model_name: z.string().optional(),
  fg_code: z.string().optional(),
  part_name: z.string().optional(),
  part_code: z.string().optional(),
  issue_type: z.string().min(1),
  description: z.string().min(10).max(500),
});

export const supportLogSchema = z.object({
  category: z.string().min(1),
  issue_type: z.string().min(1),
  assigned_person_id: z.string().uuid(),
  assigned_person_name: z.string().min(1),
  notes: z.string().max(300).optional(),
});

export const technicianSchema = z.object({
  full_name: z.string().min(2),
  technician_code: z.string().min(2).optional().or(z.literal("")),
  username: z.string().min(3).optional().or(z.literal("")),
  mobile_number: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().optional(),
  state: z.string().optional(),
  service_center: z.string().optional(),
  role: z.enum(["technician", "admin", "team_lead"]),
  category_access: z.string().optional(),
});

export const supportContactSchema = z.object({
  name: z.string().min(2),
  designation: z.string().optional(),
  mobile_number: z.string().min(10),
  category_id: z.string().uuid(),
  escalation_level: z.coerce.number().int().min(1).max(2),
});

export const supportCategorySchema = z.object({
  name: z.string().min(2),
});

export const issueTypeSchema = z.object({
  name: z.string().min(2),
});

export const partSchema = z.object({
  category: z.string().min(1),
  subcategory: z.string().optional(),
  model_name: z.string().optional(),
  fg_code: z.string().optional(),
  part_name: z.string().min(2),
  part_code: z.string().min(2),
  short_description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  tags: z.string().optional(),
});
