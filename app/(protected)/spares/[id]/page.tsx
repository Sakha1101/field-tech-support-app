import { AppScreen } from "@/components/ui/app-screen";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { InfoGrid } from "@/components/ui/info-grid";
import { getUserRecordById } from "@/lib/data/queries";
import { formatDateTime } from "@/lib/utils";

export default async function SpareIssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const issue = await getUserRecordById("spare_issues", id);
  if (!issue) notFound();

  return (
    <AppScreen className="space-y-5">
      <PageHeader title={issue.issue_number} description="Spare issue details and latest updates." />
      <SectionCard className="space-y-4">
        <StatusBadge status={issue.status} />
        <InfoGrid items={[
          { label: "Issue Type", value: issue.issue_type },
          { label: "Category", value: issue.category },
          { label: "Model / FG", value: `${issue.model_name || "N/A"} / ${issue.fg_code || "N/A"}` },
          { label: "Part", value: `${issue.part_name || "N/A"} / ${issue.part_code || "N/A"}` },
          { label: "Created", value: formatDateTime(issue.created_at) },
        ]} />
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{issue.description}</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Admin Comment</p><p className="mt-2 text-sm text-slate-700">{issue.admin_comment || "No comment yet."}</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Resolution</p><p className="mt-2 text-sm text-slate-700">{issue.resolution || "Not resolved yet."}</p></div>
        </div>
      </SectionCard>
    </AppScreen>
  );
}
