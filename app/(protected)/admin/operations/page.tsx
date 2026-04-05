import { AppScreen } from "@/components/ui/app-screen";
import { operationsStatuses } from "@/lib/constants";
import { updateOperationsStatusAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui/page-header";
import { SimpleTable } from "@/components/tables/simple-table";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAdminCollections } from "@/lib/data/queries";
import { formatDateTime } from "@/lib/utils";

export default async function AdminOperationsPage() {
  const { operations } = await getAdminCollections();
  return (
    <AppScreen className="space-y-5">
      <PageHeader title="Manage Operations Requests" description="Review all operations requests across technicians." actions={<ExportCsvButton href="/api/export/operations" />} />
      <SimpleTable columns={["Request", "Technician", "Type", "Status", "Update"]} rows={operations.map((item: any) => [
        item.request_number,
        item.technician_name,
        item.request_type,
        <StatusBadge key={`${item.id}-status`} status={item.status} />,
        <form key={`${item.id}-form`} action={updateOperationsStatusAction} className="space-y-2">
          <input type="hidden" name="id" value={item.id} />
          <select name="status" defaultValue={item.status} className="w-40 rounded-xl border border-line px-2 py-2 text-xs">
            {operationsStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <input name="admin_comment" defaultValue={item.admin_comment ?? ""} placeholder="Admin comment" className="w-40 rounded-xl border border-line px-2 py-2 text-xs" />
          <button type="submit" className="rounded-xl bg-ink px-3 py-2 text-xs font-bold text-white">Save</button>
          <div className="text-[11px] text-slate-500">{formatDateTime(item.created_at)}</div>
        </form>,
      ])} />
    </AppScreen>
  );
}
