import { AppScreen } from "@/components/ui/app-screen";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { SimpleTable } from "@/components/tables/simple-table";
import { getUserRecords } from "@/lib/data/queries";
import { formatDateTime } from "@/lib/utils";

export default async function OperationsPage() {
  const requests = await getUserRecords("operations_requests");
  return (
    <AppScreen className="space-y-5">
      <PageHeader title="My Operations Requests" description="Track tools, jig, and uniform requests." actions={<Link href="/operations/new" className="rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white">New Request</Link>} />
      {requests.length ? (
        <SimpleTable
          columns={["Request", "Type", "Status", "Created", "Open"]}
          rows={requests.map((item: any) => [
            item.request_number,
            item.request_type,
            <StatusBadge key={`${item.id}-status`} status={item.status} />,
            formatDateTime(item.created_at),
            <Link key={`${item.id}-link`} href={`/operations/${item.id}`} className="font-semibold text-brand">View</Link>,
          ])}
        />
      ) : <EmptyState title="No operations requests yet" description="Submit your first operations request." />}
    </AppScreen>
  );
}
