import { AppScreen } from "@/components/ui/app-screen";
import { PageHeader } from "@/components/ui/page-header";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { resetTechnicianPasswordAction, setTechnicianApprovalAction, toggleTechnicianStatusAction } from "@/lib/actions";
import { getAdminCollections } from "@/lib/data/queries";
import { formatDateTime } from "@/lib/utils";

export default async function AdminTechniciansPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { technicians } = await getAdminCollections();
  const { q } = await searchParams;
  const filtered = q
    ? technicians.filter((item: any) =>
        [item.full_name, item.technician_code, item.mobile_number, item.username]
          .filter(Boolean)
          .some((value: string) => value.toLowerCase().includes(q.toLowerCase())),
      )
    : technicians;

  return (
    <AppScreen className="space-y-5">
      <PageHeader title="Manage Technicians" description="Review technician access and manage account approval status." actions={<ExportCsvButton href="/api/export/technicians" />} />
      <form className="grid gap-3 rounded-[24px] border border-white/80 bg-white/95 p-4 shadow-card">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name, code, mobile number, or username"
          className="w-full rounded-2xl border border-line px-4 py-3"
        />
        <button type="submit" className="rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white">
          Search Technician
        </button>
      </form>
      <SimpleTable
        columns={["Name", "Mobile", "Code", "Role", "Approval", "Activity", "Created", "Actions"]}
        rows={filtered.map((item: any) => [
          item.full_name || "Pending Technician",
          item.mobile_number,
          item.technician_code || "-",
          item.role,
          <StatusBadge key={`${item.id}-approval`} status={item.approval_status} />,
          <StatusBadge key={`${item.id}-activity`} status={item.approval_status === "blocked" ? "inactive" : item.is_active ? "active" : "inactive"} />,
          formatDateTime(item.created_at),
          <div key={item.id} className="space-y-2">
            <div className="flex gap-2">
              {item.approval_status === "pending" ? (
                <form action={setTechnicianApprovalAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="approval_status" value="approved" />
                  <button type="submit" className="rounded-xl border border-emerald-300 px-3 py-2 text-xs font-bold text-emerald-700">
                    Approve
                  </button>
                </form>
              ) : null}
              {item.approval_status === "approved" ? (
                <form action={setTechnicianApprovalAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="approval_status" value="blocked" />
                  <button type="submit" className="rounded-xl border border-rose-300 px-3 py-2 text-xs font-bold text-rose-700">
                    Block
                  </button>
                </form>
              ) : null}
              {item.approval_status === "blocked" ? (
                <>
                  <span className="inline-flex items-center rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
                    Blocked
                  </span>
                  <form action={setTechnicianApprovalAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="approval_status" value="approved" />
                    <button type="submit" className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700">
                      Unblock
                    </button>
                  </form>
                </>
              ) : null}
            </div>
            {item.approval_status === "approved" ? (
              <form action={toggleTechnicianStatusAction}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="is_active" value={String(item.is_active)} />
                <button type="submit" className="rounded-xl border border-line px-3 py-2 text-xs font-bold">
                  {item.is_active ? "Deactivate" : "Activate"}
                </button>
              </form>
            ) : null}
            {item.auth_user_id ? (
              <form action={resetTechnicianPasswordAction} className="flex gap-2">
                <input type="hidden" name="auth_user_id" value={item.auth_user_id} />
                <input name="password" placeholder="New password" className="w-32 rounded-xl border border-line px-2 py-2 text-xs" />
                <button type="submit" className="rounded-xl bg-ink px-3 py-2 text-xs font-bold text-white">
                  Reset
                </button>
              </form>
            ) : (
              <div className="text-[11px] text-slate-500">No linked auth account yet</div>
            )}
          </div>,
        ])}
      />
    </AppScreen>
  );
}
