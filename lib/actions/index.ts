"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentTechnician } from "@/lib/auth";
import { crmStatuses, operationsStatuses, spareStatuses } from "@/lib/constants";
import type { TicketTable } from "@/types/app";
import { crmTicketSchema, issueTypeSchema, loginSchema, normalizeMobileNumber, operationsRequestSchema, partSchema, spareIssueSchema, supportCategorySchema, supportContactSchema, supportLogSchema, technicianSchema } from "@/lib/validators";

function generateTicket(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-8)}`;
}

export async function loginAction(formData: FormData) {
  const input = loginSchema.parse({
    mobile_number: formData.get("mobile_number"),
    password: formData.get("password"),
  });
  const normalizedMobileNumber = normalizeMobileNumber(input.mobile_number);
  if (normalizedMobileNumber.length !== 10) redirect("/login?error=invalid");

  const supabase = await createClient();
  const email = `${normalizedMobileNumber}@tech.test`;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (error || !data.user) redirect("/login?error=invalid");

  const { data: technician } = await supabase
    .from("technicians")
    .select("id, auth_user_id, mobile_number, is_active, role, approval_status")
    .or(`auth_user_id.eq.${data.user.id},mobile_number.eq.${normalizedMobileNumber}`)
    .single();

  if (!technician) {
    await supabase.auth.signOut();
    redirect("/login?error=profile");
  }

  if (technician.approval_status === "blocked") {
    await supabase.auth.signOut();
    redirect("/login?error=blocked");
  }

  if (technician.approval_status !== "approved") {
    await supabase.auth.signOut();
    redirect("/login?error=pending");
  }

  if (!technician.is_active) {
    await supabase.auth.signOut();
    redirect("/login?error=inactive");
  }

  if (!technician.auth_user_id || technician.auth_user_id !== data.user.id) {
    const admin = createAdminClient();
    await admin.from("technicians").update({ auth_user_id: data.user.id }).eq("id", technician.id);
  }

  const cookieStore = await cookies();
  const sessionId = randomUUID();
  cookieStore.set("ft_session_id", sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  await supabase.from("login_history").insert({
    technician_id: technician.id,
    auth_user_id: data.user.id,
    username: normalizedMobileNumber,
    session_id: sessionId,
    login_time: new Date().toISOString(),
    device_type: "mobile_web",
    platform: "android_web",
    login_status: "success",
  });

  if (technician.role === "admin") redirect("/admin");
  if (technician.role === "team_lead") redirect("/analytics");
  redirect("/dashboard");
}

export async function createCrmTicketAction(formData: FormData) {
  const technician = await getCurrentTechnician();
  const input = crmTicketSchema.parse({
    issue_type: formData.get("issue_type"),
    category: formData.get("category"),
    description: formData.get("description"),
  });
  const supabase = await createClient();
  await supabase.from("crm_tickets").insert({
    ticket_number: generateTicket("CRM"),
    technician_id: technician.id,
    technician_name: technician.full_name,
    technician_phone: technician.mobile_number,
    issue_type: input.issue_type,
    category: input.category,
    description: input.description,
    status: "New",
  });
  redirect("/crm?success=1");
}

export async function createOperationsRequestAction(formData: FormData) {
  const technician = await getCurrentTechnician();
  const parsed = operationsRequestSchema.safeParse({
    request_type: formData.get("request_type"),
    quantity: formData.get("quantity"),
    size: formData.get("size"),
    location: formData.get("location"),
    description: formData.get("description"),
  });
  if (!parsed.success) redirect("/operations/new?error=validation");
  const input = parsed.data;
  const supabase = await createClient();
  await supabase.from("operations_requests").insert({
    request_number: generateTicket("OPS"),
    technician_id: technician.id,
    technician_name: technician.full_name,
    technician_phone: technician.mobile_number,
    request_type: input.request_type,
    quantity: input.quantity,
    size: input.size,
    location: input.location,
    description: input.description,
    status: "New",
  });
  redirect("/operations?success=1");
}

export async function createSpareIssueAction(formData: FormData) {
  const technician = await getCurrentTechnician();
  const parsed = spareIssueSchema.safeParse({
    category: formData.get("category"),
    subcategory: formData.get("subcategory"),
    model_name: formData.get("model_name"),
    fg_code: formData.get("fg_code"),
    part_name: formData.get("part_name"),
    part_code: formData.get("part_code"),
    issue_type: formData.get("issue_type"),
    description: formData.get("description"),
  });
  if (!parsed.success) redirect("/spares/new?error=validation");
  const input = parsed.data;
  const supabase = await createClient();
  await supabase.from("spare_issues").insert({
    issue_number: generateTicket("SPR"),
    technician_id: technician.id,
    technician_name: technician.full_name,
    technician_phone: technician.mobile_number,
    category: input.category,
    subcategory: input.subcategory,
    model_name: input.model_name,
    fg_code: input.fg_code,
    part_name: input.part_name,
    part_code: input.part_code,
    issue_type: input.issue_type,
    description: input.description,
    status: "New",
  });
  redirect("/spares?success=1");
}

export async function logSupportAction(formData: FormData) {
  const technician = await getCurrentTechnician();
  const input = supportLogSchema.parse({
    category: formData.get("category"),
    issue_type: formData.get("issue_type"),
    assigned_person_id: formData.get("assigned_person_id"),
    assigned_person_name: formData.get("assigned_person_name"),
    notes: formData.get("notes"),
  });
  const supabase = await createClient();
  await supabase.from("support_logs").insert({
    technician_id: technician.id,
    technician_name: technician.full_name,
    category: input.category,
    issue_type: input.issue_type,
    assigned_person_name: input.assigned_person_name,
    assigned_person_id: input.assigned_person_id,
    notes: input.notes,
  });
  redirect("/support?logged=1");
}

export async function createTechnicianAction(formData: FormData) {
  const input = technicianSchema.parse({
    full_name: formData.get("full_name"),
    technician_code: formData.get("technician_code"),
    username: formData.get("username"),
    mobile_number: formData.get("mobile_number"),
    email: formData.get("email"),
    city: formData.get("city"),
    state: formData.get("state"),
    service_center: formData.get("service_center"),
    role: formData.get("role"),
    category_access: formData.get("category_access"),
  });
  const normalizedMobileNumber = normalizeMobileNumber(input.mobile_number);

  const supabase = await createClient();
  await supabase.from("technicians").insert({
    technician_code: input.technician_code ?? null,
    full_name: input.full_name,
    username: input.username ?? normalizedMobileNumber,
    mobile_number: normalizedMobileNumber,
    email: input.email || null,
    city: input.city,
    state: input.state,
    service_center: input.service_center,
    category_access: input.category_access ? input.category_access.split(",").map((item) => item.trim()) : [],
    role: input.role,
    approval_status: "approved",
    is_active: true,
  });
  redirect("/admin/technicians?created=1");
}

export async function createSupportContactAction(formData: FormData) {
  const input = supportContactSchema.parse({
    name: formData.get("name"),
    designation: formData.get("designation"),
    mobile_number: formData.get("mobile_number"),
    category_id: formData.get("category_id"),
    escalation_level: formData.get("escalation_level"),
  });
  const supabase = await createClient();
  const { data: category } = await supabase.from("categories").select("name").eq("id", input.category_id).single();
  await supabase.from("support_contacts").insert({
    name: input.name,
    designation: input.designation || null,
    phone: input.mobile_number,
    mobile_number: input.mobile_number,
    category: category?.name ?? null,
    category_id: input.category_id,
    issue_type: null,
    issue_type_id: null,
    escalation_level: input.escalation_level,
    is_active: true,
  });
  redirect("/admin/contacts?created=1");
}

export async function updateSupportContactAction(formData: FormData) {
  const input = supportContactSchema.parse({
    name: formData.get("name"),
    designation: formData.get("designation"),
    mobile_number: formData.get("mobile_number"),
    category_id: formData.get("category_id"),
    escalation_level: formData.get("escalation_level"),
  });
  const id = String(formData.get("id"));
  const supabase = await createClient();
  const { data: category } = await supabase.from("categories").select("name").eq("id", input.category_id).single();
  await supabase.from("support_contacts").update({
    name: input.name,
    designation: input.designation || null,
    phone: input.mobile_number,
    mobile_number: input.mobile_number,
    category: category?.name ?? null,
    category_id: input.category_id,
    issue_type: null,
    issue_type_id: null,
    escalation_level: input.escalation_level,
  }).eq("id", id);
  redirect("/admin/contacts?updated=1");
}

export async function createPartAction(formData: FormData) {
  const input = partSchema.parse({
    category: formData.get("category"),
    subcategory: formData.get("subcategory"),
    model_name: formData.get("model_name"),
    fg_code: formData.get("fg_code"),
    part_name: formData.get("part_name"),
    part_code: formData.get("part_code"),
    short_description: formData.get("short_description"),
    image_url: formData.get("image_url"),
    tags: formData.get("tags"),
  });
  const normalizedPartCode = input.part_code.trim();
  const imageFile = formData.get("part_image");
  let uploadedImageUrl = input.image_url || "";

  if (imageFile instanceof File && imageFile.size > 0) {
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_PARTS_BUCKET || "part-images";
    const admin = createAdminClient();
    const fileExt = imageFile.name.split(".").pop() || "jpg";
    const filePath = `parts/${Date.now()}-${randomUUID()}.${fileExt}`;
    const arrayBuffer = await imageFile.arrayBuffer();
    const { error } = await admin.storage.from(bucket).upload(filePath, Buffer.from(arrayBuffer), {
      contentType: imageFile.type || "image/jpeg",
      upsert: false,
    });
    if (!error) {
      const {
        data: { publicUrl },
      } = admin.storage.from(bucket).getPublicUrl(filePath);
      uploadedImageUrl = publicUrl;
    }
  }

  const supabase = await createClient();
  const { data: existingPart } = await supabase
    .from("parts")
    .select("id")
    .eq("part_code", normalizedPartCode)
    .maybeSingle();

  if (existingPart) {
    redirect("/admin/parts?error=duplicate");
  }

  await supabase.from("parts").insert({
    ...input,
    part_code: normalizedPartCode,
    image_url: uploadedImageUrl || null,
    tags: input.tags ? input.tags.split(",").map((item) => item.trim()) : [],
    is_active: true,
  });
  redirect("/admin/parts?created=1");
}

export async function updatePartAction(formData: FormData) {
  const id = String(formData.get("id"));
  const input = partSchema.omit({ image_url: true, tags: true }).parse({
    category: formData.get("category"),
    subcategory: formData.get("subcategory"),
    model_name: formData.get("model_name"),
    fg_code: formData.get("fg_code"),
    part_name: formData.get("part_name"),
    part_code: formData.get("part_code"),
    short_description: formData.get("short_description"),
  });

  const supabase = await createClient();
  await supabase.from("parts").update({
    part_name: input.part_name,
    part_code: input.part_code.trim(),
    fg_code: input.fg_code || null,
    model_name: input.model_name || null,
    category: input.category,
    subcategory: input.subcategory || null,
    short_description: input.short_description || null,
  }).eq("id", id);
  redirect("/admin/parts?updated=1");
}

export async function toggleTechnicianStatusAction(formData: FormData) {
  const id = String(formData.get("id"));
  const isActive = String(formData.get("is_active")) === "true";
  const admin = createAdminClient();
  const { error } = await admin.from("technicians").update({ is_active: !isActive }).eq("id", id);
  if (error) redirect("/admin/technicians?error=update");
  redirect("/admin/technicians?updated=1");
}

export async function setTechnicianApprovalAction(formData: FormData) {
  const id = String(formData.get("id"));
  const approvalStatus = String(formData.get("approval_status"));
  const admin = createAdminClient();
  const payload: { approval_status: string; is_active?: boolean } = { approval_status: approvalStatus };
  if (approvalStatus === "blocked") payload.is_active = false;
  if (approvalStatus === "approved") payload.is_active = false;
  const { error } = await admin.from("technicians").update(payload).eq("id", id);
  if (error) redirect("/admin/technicians?error=update");
  redirect("/admin/technicians?updated=1");
}

export async function finalizeTechnicianSignupAction(input: {
  mobileNumber: string;
  fullName?: string;
  authUserId?: string;
}) {
  const normalizedPhone = normalizeMobileNumber(input.mobileNumber);
  if (!input.authUserId) {
    return { ok: false, error: "No signup user found." };
  }
  if (normalizedPhone.length !== 10) {
    return { ok: false, error: "Enter a valid mobile number." };
  }

  const admin = createAdminClient();
  const { data: existingTechnician } = await admin
    .from("technicians")
    .select("*")
    .eq("mobile_number", normalizedPhone)
    .maybeSingle();

  if (existingTechnician?.approval_status === "blocked") {
    return { ok: false, error: "This technician is blocked. Contact admin." };
  }

  if (existingTechnician && existingTechnician.auth_user_id && existingTechnician.auth_user_id !== input.authUserId) {
    return { ok: false, error: "This mobile number is already linked to another account." };
  }

  const generatedCode = `PENDING-${normalizedPhone.slice(-6)}`;
  const generatedName = input.fullName?.trim() || existingTechnician?.full_name || "Pending Technician";

  if (existingTechnician) {
    const { error } = await admin
      .from("technicians")
      .update({
        auth_user_id: input.authUserId,
        full_name: existingTechnician.full_name || generatedName,
        username: existingTechnician.username || normalizedPhone,
        technician_code: existingTechnician.technician_code || generatedCode,
      })
      .eq("id", existingTechnician.id);

    if (error) {
      return { ok: false, error: error.message };
    }
  } else {
    const { error } = await admin.from("technicians").insert({
      auth_user_id: input.authUserId,
      full_name: generatedName,
      username: normalizedPhone,
      technician_code: generatedCode,
      mobile_number: normalizedPhone,
      role: "technician",
      approval_status: "pending",
      is_active: false,
    });

    if (error) {
      return { ok: false, error: error.message };
    }
  }

  return { ok: true };
}

export async function resetTechnicianPasswordAction(formData: FormData) {
  const userId = String(formData.get("auth_user_id"));
  const password = String(formData.get("password"));
  const admin = createAdminClient();
  await admin.auth.admin.updateUserById(userId, { password });
  redirect("/admin/technicians?reset=1");
}

export async function toggleSupportContactStatusAction(formData: FormData) {
  const id = String(formData.get("id"));
  const isActive = String(formData.get("is_active")) === "true";
  const supabase = await createClient();
  await supabase.from("support_contacts").update({ is_active: !isActive }).eq("id", id);
  redirect("/admin/contacts?updated=1");
}

export async function deleteSupportContactAction(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("support_contacts").delete().eq("id", id);
  redirect("/admin/contacts?deleted=1");
}

export async function createSupportCategoryAction(formData: FormData) {
  const input = supportCategorySchema.parse({
    name: formData.get("name"),
  });
  const supabase = await createClient();
  await supabase.from("categories").insert({ name: input.name, is_active: true });
  redirect("/admin/categories?created=1");
}

export async function createCategoryAction(formData: FormData) {
  const input = supportCategorySchema.parse({
    name: formData.get("name"),
  });
  const supabase = await createClient();
  const { data: existingCategory } = await supabase.from("categories").select("id").ilike("name", input.name).maybeSingle();
  if (existingCategory) redirect("/admin/categories?error=duplicate");
  await supabase.from("categories").insert({ name: input.name, is_active: true });
  redirect("/admin/categories?created=1");
}

export async function toggleSupportCategoryStatusAction(formData: FormData) {
  const id = String(formData.get("id"));
  const isActive = String(formData.get("is_active")) === "true";
  const supabase = await createClient();
  await supabase.from("categories").update({ is_active: !isActive }).eq("id", id);
  redirect("/admin/categories?updated=1");
}

export async function toggleCategoryStatusAction(formData: FormData) {
  const id = String(formData.get("id"));
  const isActive = String(formData.get("is_active")) === "true";
  const supabase = await createClient();
  await supabase.from("categories").update({ is_active: !isActive }).eq("id", id);
  redirect("/admin/categories?updated=1");
}

export async function deleteCategoryAction(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  redirect("/admin/categories?deleted=1");
}

export async function createIssueTypeAction(formData: FormData) {
  const input = issueTypeSchema.parse({
    name: formData.get("name"),
  });
  const supabase = await createClient();
  await supabase.from("issue_types").insert({ name: input.name, is_active: true });
  redirect("/admin/issue-types?created=1");
}

export async function deleteIssueTypeAction(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("issue_types").delete().eq("id", id);
  redirect("/admin/issue-types?deleted=1");
}

export async function toggleIssueTypeStatusAction(formData: FormData) {
  const id = String(formData.get("id"));
  const isActive = String(formData.get("is_active")) === "true";
  const supabase = await createClient();
  await supabase.from("issue_types").update({ is_active: !isActive }).eq("id", id);
  redirect("/admin/issue-types?updated=1");
}

export async function togglePartStatusAction(formData: FormData) {
  const id = String(formData.get("id"));
  const isActive = String(formData.get("is_active")) === "true";
  const supabase = await createClient();
  await supabase.from("parts").update({ is_active: !isActive }).eq("id", id);
  redirect("/admin/parts?updated=1");
}

export async function deletePartAction(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("parts").delete().eq("id", id);
  redirect("/admin/parts?deleted=1");
}

async function updateTicketTableStatus(
  table: TicketTable,
  id: string,
  status: string,
  adminComment?: string,
  resolution?: string,
) {
  const supabase = await createClient();
  const payload: Record<string, string> = { status };
  if (adminComment) payload.admin_comment = adminComment;
  if (resolution) payload.resolution = resolution;
  await supabase.from(table).update(payload).eq("id", id);
}

export async function updateCrmStatusAction(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const adminComment = String(formData.get("admin_comment") ?? "");
  const resolution = String(formData.get("resolution") ?? "");
  if (!crmStatuses.includes(status as (typeof crmStatuses)[number])) redirect("/admin/crm?error=status");
  await updateTicketTableStatus("crm_tickets", id, status, adminComment, resolution);
  redirect("/admin/crm?updated=1");
}

export async function updateOperationsStatusAction(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const adminComment = String(formData.get("admin_comment") ?? "");
  if (!operationsStatuses.includes(status as (typeof operationsStatuses)[number])) redirect("/admin/operations?error=status");
  await updateTicketTableStatus("operations_requests", id, status, adminComment);
  redirect("/admin/operations?updated=1");
}

export async function updateSpareStatusAction(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const adminComment = String(formData.get("admin_comment") ?? "");
  const resolution = String(formData.get("resolution") ?? "");
  if (!spareStatuses.includes(status as (typeof spareStatuses)[number])) redirect("/admin/spares?error=status");
  await updateTicketTableStatus("spare_issues", id, status, adminComment, resolution);
  redirect("/admin/spares?updated=1");
}
