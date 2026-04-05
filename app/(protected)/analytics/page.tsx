import { AppScreen } from "@/components/ui/app-screen";
import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SectionCard } from "@/components/ui/section-card";
import { getAnalyticsSummary } from "@/lib/data/queries";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import { formatDateTime } from "@/lib/utils";

export default async function AnalyticsPage() {
  const {
    loginHistory,
    supportLogs,
    crm,
    operations,
    spares,
    dailyActiveTechnicians,
    supportByPerson,
    supportByCategory,
    supportByIssueType,
    topSearches,
    lastLoginByTechnician,
    topTechnicians,
  } = await getAnalyticsSummary();
  const openRequests = crm.filter((item: any) => !["Resolved", "Closed"].includes(item.status)).length + operations.filter((item: any) => !["Delivered", "Closed", "Rejected"].includes(item.status)).length + spares.filter((item: any) => !["Resolved", "Closed"].includes(item.status)).length;
  const closedRequests = crm.filter((item: any) => ["Resolved", "Closed"].includes(item.status)).length + operations.filter((item: any) => ["Delivered", "Closed"].includes(item.status)).length + spares.filter((item: any) => ["Resolved", "Closed"].includes(item.status)).length;

  return (
    <AppScreen className="space-y-5">
      <PageHeader title="Analytics Dashboard" description="Track workload, technician activity, query types, and login trends." actions={<ExportCsvButton href="/api/export/support_logs" />} />
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Total Logins" value={loginHistory.length} helper="Successful login records" />
        <MetricCard label="Daily Active" value={dailyActiveTechnicians} helper="Technicians active today" />
        <MetricCard label="Support Logs" value={supportLogs.length} helper="Support directory usage" />
        <MetricCard label="Open Requests" value={openRequests} helper="Across CRM, operations, and spares" />
        <MetricCard label="Closed Requests" value={closedRequests} helper="Resolved or closed items" />
      </div>
      <SectionCard>
        <h2 className="text-base font-bold text-ink">Available Filters</h2>
        <p className="mt-2 text-sm text-slate-600">Date range, category, issue type, support person, and technician filters are supported by the schema and can be expanded into chart filters next.</p>
      </SectionCard>
      <div className="grid gap-3">
        <SectionCard>
          <h2 className="text-base font-bold text-ink">Support by Person</h2>
          <div className="mt-3 space-y-2 text-sm">
            {supportByPerson.slice(0, 5).map((item) => <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2"><span>{item.label}</span><span className="font-bold">{String(item.value)}</span></div>)}
          </div>
        </SectionCard>
        <SectionCard>
          <h2 className="text-base font-bold text-ink">Support by Category</h2>
          <div className="mt-3 space-y-2 text-sm">
            {supportByCategory.slice(0, 5).map((item) => <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2"><span>{item.label}</span><span className="font-bold">{String(item.value)}</span></div>)}
          </div>
        </SectionCard>
        <SectionCard>
          <h2 className="text-base font-bold text-ink">Support by Issue Type</h2>
          <div className="mt-3 space-y-2 text-sm">
            {supportByIssueType.slice(0, 5).map((item) => <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2"><span>{item.label}</span><span className="font-bold">{String(item.value)}</span></div>)}
          </div>
        </SectionCard>
        <SectionCard>
          <h2 className="text-base font-bold text-ink">Top Searched Parts</h2>
          <div className="mt-3 space-y-2 text-sm">
            {topSearches.slice(0, 5).map((item) => <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2"><span>{item.label}</span><span className="font-bold">{String(item.value)}</span></div>)}
          </div>
        </SectionCard>
        <SectionCard>
          <h2 className="text-base font-bold text-ink">Top Technicians by Request Volume</h2>
          <div className="mt-3 space-y-2 text-sm">
            {topTechnicians.slice(0, 5).map((item) => <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2"><span>{item.label}</span><span className="font-bold">{String(item.value)}</span></div>)}
          </div>
        </SectionCard>
        <SectionCard>
          <h2 className="text-base font-bold text-ink">Last Login by Technician</h2>
          <div className="mt-3 space-y-2 text-sm">
            {lastLoginByTechnician.slice(0, 5).map((item: any) => <div key={item.id} className="rounded-2xl bg-slate-50 px-3 py-2"><div className="font-semibold">{item.username}</div><div className="text-slate-500">{formatDateTime(item.login_time)}</div></div>)}
          </div>
        </SectionCard>
        <SectionCard>
          <h2 className="text-base font-bold text-ink">Volumes</h2>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm">CRM Tickets: {crm.length}</div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm">Operations Requests: {operations.length}</div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm">Spare Issues: {spares.length}</div>
          </div>
        </SectionCard>
      </div>
    </AppScreen>
  );
}
