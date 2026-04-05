import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { supportSeedMapping } from "@/lib/constants";
import { getCurrentTechnician } from "@/lib/auth";
import type { TicketTable } from "@/types/app";
import { unstable_noStore as noStore } from "next/cache";

type QueryParams = {
  q?: string;
  category?: string;
  issue_type?: string;
};

function buildCounts(items: Array<Record<string, any>>, key: string) {
  return Object.entries(
    items.reduce<Record<string, number>>((acc, item) => {
      const value = item[key] ?? "Unknown";
      acc[value] = (acc[value] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => Number(b.value) - Number(a.value));
}

export async function getDashboardMetrics() {
  const technician = await getCurrentTechnician();

  if (!isSupabaseConfigured()) {
    return {
      cards: [
        { label: "Support Calls", value: 0, helper: "Connect Supabase to load live data" },
        { label: "CRM Tickets", value: 0, helper: "No records yet" },
        { label: "Operations", value: 0, helper: "No records yet" },
        { label: "Spare Issues", value: 0, helper: "No records yet" },
      ],
      technician,
    };
  }

  const supabase = await createClient();
  const scopeFilter =
    technician.role === "technician"
      ? (query: any) => query.eq("technician_id", technician.id)
      : (query: any) => query;
  const [supportLogs, crmTickets, operationsRequests, spareIssues] = await Promise.all([
    scopeFilter(supabase.from("support_logs").select("id", { count: "exact", head: true })),
    scopeFilter(supabase.from("crm_tickets").select("id", { count: "exact", head: true })),
    scopeFilter(supabase.from("operations_requests").select("id", { count: "exact", head: true })),
    scopeFilter(supabase.from("spare_issues").select("id", { count: "exact", head: true })),
  ]);

  return {
    cards: [
      { label: "Support Calls", value: supportLogs.count ?? 0, helper: technician.role === "technician" ? "Your logged support queries" : "Visible support query volume" },
      { label: "CRM Tickets", value: crmTickets.count ?? 0, helper: technician.role === "technician" ? "Your app and CRM issues" : "Visible CRM issue volume" },
      { label: "Operations", value: operationsRequests.count ?? 0, helper: technician.role === "technician" ? "Your operations requests" : "Visible operations workload" },
      { label: "Spare Issues", value: spareIssues.count ?? 0, helper: technician.role === "technician" ? "Your spare issue tickets" : "Visible spare issue volume" },
    ],
    technician,
  };
}

export async function getSupportContacts(params: QueryParams) {
  if (!isSupabaseConfigured()) {
    return supportSeedMapping.filter((item) => {
      const categoryMatch = params.category ? item.category.toLowerCase().includes(params.category.toLowerCase()) : true;
      const issueMatch = params.issue_type ? item.issue_type.toLowerCase().includes(params.issue_type.toLowerCase()) : true;
      return categoryMatch && issueMatch;
    });
  }

  const supabase = await createClient();
  let query = supabase.from("support_contacts").select("*").eq("is_active", true).order("priority_order");
  if (params.category) query = query.ilike("category", `%${params.category}%`);
  if (params.issue_type) query = query.ilike("issue_type", `%${params.issue_type}%`);
  const { data } = await query;
  return data ?? [];
}

export async function getSupportRoutingOptions() {
  const supabase = await createClient();
  const [categories, issueTypes] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("name"),
    supabase.from("issue_types").select("*").eq("is_active", true).order("name"),
  ]);

  return {
    categories: categories.data ?? [],
    issueTypes: issueTypes.data ?? [],
  };
}

export async function getIssueTypes() {
  const supabase = await createClient();
  const { data } = await supabase.from("issue_types").select("id, name, is_active").order("name");
  return data ?? [];
}

export async function getActiveCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id, name, is_active").eq("is_active", true).order("name");
  return data ?? [];
}

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id, name, is_active").order("name");
  return data ?? [];
}

export async function getSupportRoutingContacts(params: {
  category_id?: string;
  q?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("support_contacts")
    .select("id, name, designation, mobile_number, notes, escalation_level, category_id")
    .eq("is_active", true);

  if (params.category_id) {
    query = query.eq("category_id", params.category_id);
  }

  const { data } = await query
    .order("escalation_level")
    .order("name");
  return data ?? [];
}

export async function getSupportCallLogs(params?: {
  q?: string;
  date?: string;
}) {
  const supabase = await createClient();
  const search = params?.q?.trim();
  let query = supabase
    .from("support_call_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `technician_name.ilike.%${search}%,technician_mobile.ilike.%${search}%,category_name.ilike.%${search}%,issue_type_name.ilike.%${search}%,support_contact_name.ilike.%${search}%,support_contact_mobile.ilike.%${search}%`,
    );
  }

  if (params?.date) {
    const start = new Date(`${params.date}T00:00:00.000Z`);
    const end = new Date(`${params.date}T23:59:59.999Z`);
    query = query.gte("created_at", start.toISOString()).lte("created_at", end.toISOString());
  }

  const { data } = await query.limit(200);
  return data ?? [];
}

export async function getParts(params: QueryParams) {
  noStore();
  if (!isSupabaseConfigured()) return [];
  const technician = await getCurrentTechnician();
  const supabase = await createClient();
  const search = params.q?.trim();
  const category = params.category?.trim();
  let query = supabase.from("parts").select("*").eq("is_active", true).order("part_name");
  if (search) {
    query = query.or(
      `part_name.ilike.%${search}%,part_code.ilike.%${search}%,fg_code.ilike.%${search}%,model_name.ilike.%${search}%,category.ilike.%${search}%,tags.cs.{${search}}`,
    );
  }
  if (category) query = query.ilike("category", `%${category}%`);
  const { data } = await query.limit(50);
  if (search || category) {
    const searchQuery = [search, category].filter(Boolean).join(" | ");
    await supabase.from("search_logs").insert({
      technician_id: technician.id,
      search_type: search ? "keyword" : "category",
      search_query: searchQuery,
      result_count: data?.length ?? 0,
    });
  }
  return data ?? [];
}

export async function getPartById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("parts").select("*").eq("id", id).single();
  return data;
}

export async function getUserRecords(table: TicketTable) {
  const technician = await getCurrentTechnician();
  const supabase = await createClient();
  const { data } = await supabase.from(table).select("*").eq("technician_id", technician.id).order("created_at", { ascending: false });
  return data ?? [];
}

export async function getUserRecordById(table: TicketTable, id: string) {
  const technician = await getCurrentTechnician();
  const supabase = await createClient();
  const { data } = await supabase.from(table).select("*").eq("id", id).eq("technician_id", technician.id).single();
  return data;
}

export async function getLoginActivity() {
  const technician = await getCurrentTechnician();
  const supabase = await createClient();
  const { data } = await supabase.from("login_history").select("*").eq("technician_id", technician.id).order("login_time", { ascending: false });
  return data ?? [];
}

export async function getAdminCollections() {
  noStore();
  const supabase = await createClient();
  const [technicians, contacts, parts, crm, operations, spares, logins, categories, issueTypes] = await Promise.all([
    supabase.from("technicians").select("*").order("created_at", { ascending: false }),
    supabase.from("support_contacts").select("*").order("escalation_level").order("name"),
    supabase.from("parts").select("*").order("created_at", { ascending: false }),
    supabase.from("crm_tickets").select("*").order("created_at", { ascending: false }),
    supabase.from("operations_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("spare_issues").select("*").order("created_at", { ascending: false }),
    supabase.from("login_history").select("*").order("login_time", { ascending: false }).limit(100),
    supabase.from("categories").select("*").order("name"),
    supabase.from("issue_types").select("*").order("name"),
  ]);

  return {
    technicians: technicians.data ?? [],
    contacts: contacts.data ?? [],
    parts: parts.data ?? [],
    crm: crm.data ?? [],
    operations: operations.data ?? [],
    spares: spares.data ?? [],
    logins: logins.data ?? [],
    categories: categories.data ?? [],
    issueTypes: issueTypes.data ?? [],
  };
}

export async function getAnalyticsSummary() {
  const supabase = await createClient();
  const [loginHistory, supportLogs, crm, operations, spares, technicians, searchLogs] = await Promise.all([
    supabase.from("login_history").select("*").order("login_time", { ascending: false }),
    supabase.from("support_logs").select("*"),
    supabase.from("crm_tickets").select("*"),
    supabase.from("operations_requests").select("*"),
    supabase.from("spare_issues").select("*"),
    supabase.from("technicians").select("id, full_name, role, category_access"),
    supabase.from("search_logs").select("*"),
  ]);

  const topTechnicians = buildCounts(
    [...(crm.data ?? []), ...(operations.data ?? []), ...(spares.data ?? [])],
    "technician_name",
  ).slice(0, 5);

  const lastLoginByTechnician = Object.values(
    (loginHistory.data ?? []).reduce<Record<string, any>>((acc, entry: any) => {
      const key = entry.username;
      if (!acc[key] || new Date(entry.login_time) > new Date(acc[key].login_time)) {
        acc[key] = entry;
      }
      return acc;
    }, {}),
  );

  return {
    loginHistory: loginHistory.data ?? [],
    supportLogs: supportLogs.data ?? [],
    crm: crm.data ?? [],
    operations: operations.data ?? [],
    spares: spares.data ?? [],
    technicians: technicians.data ?? [],
    searchLogs: searchLogs.data ?? [],
    supportByPerson: buildCounts(supportLogs.data ?? [], "assigned_person_name"),
    supportByCategory: buildCounts(supportLogs.data ?? [], "category"),
    supportByIssueType: buildCounts(supportLogs.data ?? [], "issue_type"),
    topSearches: buildCounts(searchLogs.data ?? [], "search_query").slice(0, 5),
    dailyActiveTechnicians: new Set(
      (loginHistory.data ?? [])
        .filter((entry: any) => new Date(entry.login_time).toDateString() === new Date().toDateString())
        .map((entry: any) => entry.technician_id),
    ).size,
    lastLoginByTechnician,
    topTechnicians,
  };
}
