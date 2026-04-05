import { AppScreen } from "@/components/ui/app-screen";
import Link from "next/link";
import { Users, Phone, Package, Ticket, ClipboardList, Wrench, BarChart3, Layers3 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

const items = [
  { href: "/admin/technicians", label: "Manage Technicians", icon: Users },
  { href: "/admin/contacts", label: "Manage Contacts", icon: Phone },
  { href: "/admin/categories", label: "Manage Categories", icon: Layers3 },
  { href: "/admin/parts", label: "Manage Parts", icon: Package },
  { href: "/admin/crm", label: "Manage CRM Tickets", icon: Ticket },
  { href: "/admin/operations", label: "Manage Operations", icon: ClipboardList },
  { href: "/admin/spares", label: "Manage Spare Issues", icon: Wrench },
  { href: "/admin/logins", label: "Login History", icon: Users },
  { href: "/analytics", label: "Analytics Dashboard", icon: BarChart3 },
];

export default function AdminDashboardPage() {
  return (
    <AppScreen className="space-y-5">
      <PageHeader title="Admin Dashboard" description="Manage technicians, contacts, parts, and typed tickets." />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <SectionCard className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand-soft p-3 text-brand"><Icon className="h-5 w-5" /></div>
              <div className="font-bold text-ink">{label}</div>
            </SectionCard>
          </Link>
        ))}
      </div>
    </AppScreen>
  );
}
