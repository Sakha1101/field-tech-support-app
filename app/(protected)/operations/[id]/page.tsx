import { AppScreen } from "@/components/ui/app-screen";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { InfoGrid } from "@/components/ui/info-grid";
import { getUserRecordById } from "@/lib/data/queries";
import { formatDateTime } from "@/lib/utils";

export default async function OperationsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getUserRecordById("operations_requests", id);
  if (!request) notFound();

  return (
    <AppScreen className="space-y-5">
      <PageHeader title={request.request_number} description="Operations request details and status." />
      <SectionCard className="space-y-4">
        <StatusBadge status={request.status} />
        <InfoGrid items={[
          { label: "Request Type", value: request.request_type },
          { label: "Quantity", value: String(request.quantity) },
          { label: "Size", value: request.size || "N/A" },
          { label: "Location", value: request.location },
          { label: "Created", value: formatDateTime(request.created_at) },
        ]} />
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{request.description}</div>
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"><span className="font-semibold">Admin Comment:</span> {request.admin_comment || "No comment yet."}</div>
      </SectionCard>
    </AppScreen>
  );
}
