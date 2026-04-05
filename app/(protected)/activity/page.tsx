import { AppScreen } from "@/components/ui/app-screen";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { SimpleTable } from "@/components/tables/simple-table";
import { getDashboardMetrics, getLoginActivity } from "@/lib/data/queries";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";

export default async function ActivityPage() {
  const [activity, dashboardMetrics] = await Promise.all([
    getLoginActivity(),
    getDashboardMetrics(),
  ]);

  return (
    <AppScreen className="space-y-5">
      <PageHeader title="My Login Activity" description="Review your recent login and logout records." />
      <div className="grid grid-cols-2 gap-3">
        {dashboardMetrics.cards.map((card) => {
          if (card.label === "CRM Tickets") {
            return <Link key={card.label} href="/crm" className="block"><MetricCard {...card} /></Link>;
          }
          if (card.label === "Operations") {
            return <Link key={card.label} href="/operations" className="block"><MetricCard {...card} /></Link>;
          }
          if (card.label === "Spare Issues") {
            return <Link key={card.label} href="/spares" className="block"><MetricCard {...card} /></Link>;
          }
          return <MetricCard key={card.label} {...card} />;
        })}
      </div>
      {activity.length ? (
        <SimpleTable
          columns={["Username", "Login", "Logout", "Platform", "Status"]}
          rows={activity.map((item: any) => [item.username, formatDateTime(item.login_time), formatDateTime(item.logout_time), item.platform || "N/A", item.login_status || "success"])}
        />
      ) : <EmptyState title="No login records yet" description="Your successful logins will appear here." />}
    </AppScreen>
  );
}
