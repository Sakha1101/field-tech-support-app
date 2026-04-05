import { AppScreen } from "@/components/ui/app-screen";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { getUserRecords } from "@/lib/data/queries";
import { formatDateTime } from "@/lib/utils";
import { SectionCard } from "@/components/ui/section-card";

export default async function CrmTicketsPage() {
  const tickets = await getUserRecords("crm_tickets");
  return (
    <AppScreen className="space-y-5">
      <PageHeader title="My CRM Tickets" description="Track your app and CRM issue tickets." actions={<Link href="/crm/new" className="rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white">New Ticket</Link>} />
      {tickets.length ? (
        <div className="space-y-3">
          {tickets.map((ticket: any) => (
            <Link key={ticket.id} href={`/crm/${ticket.id}`} className="block">
              <SectionCard className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink">{ticket.ticket_number}</p>
                    <p className="text-sm text-slate-600">{ticket.issue_type}</p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>
                <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                  <span>{formatDateTime(ticket.created_at)}</span>
                  <span className="font-semibold text-brand">Open</span>
                </div>
              </SectionCard>
            </Link>
          ))}
        </div>
      ) : <EmptyState title="No CRM tickets yet" description="Create your first typed app issue ticket." />}
    </AppScreen>
  );
}
