import { AppScreen } from "@/components/ui/app-screen";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { SimpleTable } from "@/components/tables/simple-table";
import { getUserRecords } from "@/lib/data/queries";
import { formatDateTime } from "@/lib/utils";

export default async function SparesPage() {
  const issues = await getUserRecords("spare_issues");
  return (
    <AppScreen className="space-y-5">
      <PageHeader title="My Spare Issues" description="Track spare issue tickets and resolutions." actions={<Link href="/spares/new" className="rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white">New Spare Issue</Link>} />
      {issues.length ? (
        <SimpleTable
          columns={["Issue", "Type", "Status", "Created", "Open"]}
          rows={issues.map((item: any) => [
            item.issue_number,
            item.issue_type,
            <StatusBadge key={`${item.id}-status`} status={item.status} />,
            formatDateTime(item.created_at),
            <Link key={`${item.id}-link`} href={`/spares/${item.id}`} className="font-semibold text-brand">View</Link>,
          ])}
        />
      ) : <EmptyState title="No spare issues yet" description="Submit your first spare-part issue." />}
    </AppScreen>
  );
}
