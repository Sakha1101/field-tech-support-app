import { AppScreen } from "@/components/ui/app-screen";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { InfoGrid } from "@/components/ui/info-grid";
import { getUserRecordById } from "@/lib/data/queries";
import { formatDateTime } from "@/lib/utils";

export default async function CrmTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await getUserRecordById("crm_tickets", id);
  if (!ticket) notFound();

  return (
    <AppScreen className="space-y-5">
      <PageHeader title={ticket.ticket_number} description="CRM ticket details and latest status." />
      <SectionCard className="space-y-4">
        <StatusBadge status={ticket.status} />
        <InfoGrid items={[
          { label: "Issue Type", value: ticket.issue_type },
          { label: "Category", value: ticket.category },
          { label: "Created", value: formatDateTime(ticket.created_at) },
          { label: "Updated", value: formatDateTime(ticket.updated_at) },
        ]} />
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{ticket.description}</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Admin Comment</p><p className="mt-2 text-sm text-slate-700">{ticket.admin_comment || "No comment yet."}</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Resolution</p><p className="mt-2 text-sm text-slate-700">{ticket.resolution || "Not resolved yet."}</p></div>
        </div>
      </SectionCard>
    </AppScreen>
  );
}
