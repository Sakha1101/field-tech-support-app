import { AppScreen } from "@/components/ui/app-screen";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { SimpleTable } from "@/components/tables/simple-table";
import { getSupportCallLogs } from "@/lib/data/queries";

export default async function AdminSupportCallLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; date?: string }>;
}) {
  const params = await searchParams;
  const logs = await getSupportCallLogs(params);

  return (
    <AppScreen className="space-y-5">
      <PageHeader
        title="Support Call Logs"
        description="Review technician support calls, category demand, and escalation usage."
      />

      <SectionCard>
        <form className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search technician, category, issue type, or contact"
            className="rounded-2xl border border-line px-4 py-3"
          />
          <input
            type="date"
            name="date"
            defaultValue={params.date}
            className="rounded-2xl border border-line px-4 py-3"
          />
          <button type="submit" className="rounded-2xl bg-brand px-4 py-3 font-bold text-white">
            Filter
          </button>
        </form>
      </SectionCard>

      {!logs.length ? (
        <EmptyState
          title="No support call logs found"
          description="Try a different search or date filter, or wait for technicians to start placing logged calls."
        />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {logs.map((log: any) => (
              <SectionCard key={log.id} className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                    {log.category_name}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {log.issue_type_name}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    L{log.escalation_level}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">{log.technician_name}</h3>
                  <p className="text-sm text-slate-600">{log.technician_mobile}</p>
                </div>
                <div className="grid gap-2 rounded-2xl bg-slate-50 p-3 text-sm">
                  <p><span className="font-semibold">Contact:</span> {log.support_contact_name}</p>
                  <p><span className="font-semibold">Contact Mobile:</span> {log.support_contact_mobile}</p>
                  <p><span className="font-semibold">Call Action:</span> {log.call_action}</p>
                  <p><span className="font-semibold">Created:</span> {new Date(log.created_at).toLocaleString("en-IN")}</p>
                </div>
              </SectionCard>
            ))}
          </div>

          <div className="hidden md:block">
            <SimpleTable
              columns={[
                "Technician",
                "Category",
                "Issue Type",
                "Contact",
                "Level",
                "Action",
                "Created",
              ]}
              rows={logs.map((log: any) => [
                <div key={`${log.id}-tech`}>
                  <p className="font-semibold text-ink">{log.technician_name}</p>
                  <p className="text-xs text-slate-500">{log.technician_mobile}</p>
                </div>,
                log.category_name,
                log.issue_type_name,
                <div key={`${log.id}-contact`}>
                  <p className="font-semibold text-ink">{log.support_contact_name}</p>
                  <p className="text-xs text-slate-500">{log.support_contact_mobile}</p>
                </div>,
                `L${log.escalation_level}`,
                log.call_action,
                new Date(log.created_at).toLocaleString("en-IN"),
              ])}
            />
          </div>
        </>
      )}
    </AppScreen>
  );
}
