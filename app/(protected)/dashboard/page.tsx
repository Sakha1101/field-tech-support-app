import { adminHomeCards, teamLeadHomeCards, technicianHomeCards } from "@/lib/constants";
import Link from "next/link";
import { getDashboardMetrics } from "@/lib/data/queries";
import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ActionCard } from "@/components/dashboard/action-card";
import { SectionCard } from "@/components/ui/section-card";
import { AppScreen } from "@/components/ui/app-screen";

export default async function DashboardPage() {
  const { cards, technician } = await getDashboardMetrics();
  const homeCards =
    technician.role === "admin"
      ? adminHomeCards
      : technician.role === "team_lead"
        ? teamLeadHomeCards
        : technicianHomeCards;
  const title =
    technician.role === "admin"
      ? "Admin Home"
      : technician.role === "team_lead"
        ? "Team Lead Home"
        : `Hello, ${technician.full_name.split(" ")[0]}`;
  const description =
    technician.role === "admin"
      ? "Use these admin shortcuts to manage field operations."
      : technician.role === "team_lead"
        ? "Use these shortcuts to review team activity and ticket workload."
        : "Use the six main cards below for your daily field tasks.";

  return (
    <AppScreen className="space-y-5">
      <PageHeader title={title} description={description} />
      <div className="grid grid-cols-2 gap-3">
        {homeCards.map((card) => <ActionCard key={card.href} {...card} />)}
      </div>
      {technician.role === "technician" ? <SectionCard>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-ink">More</h2>
            <p className="text-sm text-slate-600">View login activity and recent access details.</p>
          </div>
          <Link href="/activity" className="rounded-2xl bg-ink px-4 py-3 text-sm font-bold text-white">
            My Login Activity
          </Link>
        </div>
      </SectionCard> : null}
    </AppScreen>
  );
}
