export const crmIssueTypes = [
  "App not opening",
  "Unable to close call",
  "Login issue",
  "Sync issue",
  "Data not visible",
  "Other",
] as const;

export const operationsRequestTypes = [
  "Tool bag required",
  "Jig required",
  "T-shirt required",
  "Other operations request",
] as const;

export const spareIssueTypes = [
  "Spare not available",
  "Part not received",
  "Wrong part received",
  "Defective tag issue",
  "Damaged part received",
  "Other spare issue",
] as const;

export const crmStatuses = ["New", "In Progress", "Waiting for User", "Resolved", "Closed"] as const;

export const operationsStatuses = ["New", "Approved", "Rejected", "Dispatched", "Delivered", "Closed"] as const;

export const spareStatuses = ["New", "In Review", "Waiting for Update", "Resolved", "Closed"] as const;

export const technicianHomeCards = [
  { title: "Call Support", href: "/support", description: "Find the right support person fast." },
  { title: "Find Part Code", href: "/parts", description: "Search part code, FG code, model, or name." },
  { title: "CRM/App Issue", href: "/crm/new", description: "Raise app or CRM-related typed tickets." },
  { title: "Operations Request", href: "/operations/new", description: "Request tools, jig, or uniform items." },
  { title: "Spare Part Issue", href: "/spares/new", description: "Raise spare shortages or wrong part issues." },
  { title: "My Tickets", href: "/crm", description: "Track CRM, operations, and spare issues." },
];

export const adminHomeCards = [
  { title: "Manage Technicians", href: "/admin/technicians", description: "Create users and control access." },
  { title: "Manage Contacts", href: "/admin/contacts", description: "Maintain support routing." },
  { title: "Manage Parts", href: "/admin/parts", description: "Add parts, images, and CSV imports." },
  { title: "CRM Tickets", href: "/admin/crm", description: "Review app and CRM issues." },
  { title: "Operations", href: "/admin/operations", description: "Handle operations requests." },
  { title: "Spare Issues", href: "/admin/spares", description: "Review spare issue workload." },
] as const;

export const teamLeadHomeCards = [
  { title: "Analytics", href: "/analytics", description: "Track technician activity and issue volume." },
  { title: "Support Contacts", href: "/support", description: "Review support routing usage." },
  { title: "Part Finder", href: "/parts", description: "Look up part usage and search demand." },
  { title: "CRM Tickets", href: "/crm", description: "View scoped CRM ticket records." },
  { title: "Operations", href: "/operations", description: "View scoped operations records." },
  { title: "Spare Issues", href: "/spares", description: "View scoped spare issue records." },
] as const;

export const supportCategories = [
  "Fan",
  "Mixer Grinder",
  "Smart Lock",
  "Kitchen Appliances",
] as const;

export const supportIssueTypes = [
  "Mechanical",
  "Electrical",
  "Product Support",
  "Escalation",
] as const;

export const supportSeedMapping = [
  { id: "00000000-0000-0000-0000-000000000101", category: "Fan", subcategory: "Mechanical", issue_type: "Mechanical", name: "Manish", designation: "Support Engineer", phone: "9999999001" },
  { id: "00000000-0000-0000-0000-000000000102", category: "Fan", subcategory: "Electrical", issue_type: "Electrical", name: "Vedant", designation: "Electrical Support", phone: "9999999002" },
  { id: "00000000-0000-0000-0000-000000000103", category: "Fan", subcategory: "TPW / Exhaust / Table / Wall Mount Fan", issue_type: "Product Support", name: "Hasan", designation: "Product Specialist", phone: "9999999003" },
  { id: "00000000-0000-0000-0000-000000000104", category: "Mixer Grinder", subcategory: "General", issue_type: "Product Support", name: "Sachin", designation: "Appliance Support", phone: "9999999004" },
  { id: "00000000-0000-0000-0000-000000000105", category: "Smart Lock", subcategory: "General", issue_type: "Product Support", name: "Manoj", designation: "Smart Devices Support", phone: "9999999005" },
  { id: "00000000-0000-0000-0000-000000000106", category: "Fan", subcategory: "Lead", issue_type: "Escalation", name: "Pradip", designation: "Fan Lead", phone: "9999999006" },
  { id: "00000000-0000-0000-0000-000000000107", category: "Kitchen Appliances", subcategory: "Lead", issue_type: "Escalation", name: "Sakha", designation: "Kitchen Appliances Lead", phone: "9999999007" },
] as const;
