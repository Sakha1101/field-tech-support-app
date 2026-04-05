import { AppScreen } from "@/components/ui/app-screen";
import { crmStatuses } from "@/lib/constants";
import { updateCrmStatusAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui/page-header";
import { SimpleTable } from "@/components/tables/simple-table";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAdminCollections } from "@/lib/data/queries";
import { formatDateTime } from "@/lib/utils";

export default async function AdminCrmPage() {
  const { crm } = await getAdminCollections();
  return (
    <AppScreen className="space-y-5">
      <PageHeader title="Manage CRM Tickets" description="Review all CRM/app tickets across technicians." actions={<ExportCsvButton href="/api/export/crm" />} />
      <SimpleTable columns={["Ticket", "Technician", "Issue", "Status", "Update"]} rows={crm.map((item: any) => [
        item.ticket_number,
        item.technician_name,
        item.issue_type,
        <StatusBadge key={`${item.id}-status`} status={item.status} />,
        <form key={`${item.id}-form`} action={updateCrmStatusAction} className="space-y-2">
          <input type="hidden" name="id" value={item.id} />
          <select name="status" defaultValue={item.status} className="w-40 rounded-xl border border-line px-2 py-2 text-xs">
            {crmStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <input name="admin_comment" defaultValue={item.admin_comment ?? ""} placeholder="Admin comment" className="w-40 rounded-xl border border-line px-2 py-2 text-xs" />
          <input name="resolution" defaultValue={item.resolution ?? ""} placeholder="Resolution" className="w-40 rounded-xl border border-line px-2 py-2 text-xs" />
          <button type="submit" className="rounded-xl bg-ink px-3 py-2 text-xs font-bold text-white">Save</button>
          <div className="text-[11px] text-slate-500">{formatDateTime(item.created_at)}</div>
        </form>,
      ])} />
    </AppScreen>
  );
}
