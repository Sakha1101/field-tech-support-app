import { AppScreen } from "@/components/ui/app-screen";
import { PageHeader } from "@/components/ui/page-header";
import { SimpleTable } from "@/components/tables/simple-table";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import { getAdminCollections } from "@/lib/data/queries";
import { formatDateTime } from "@/lib/utils";

export default async function AdminLoginsPage() {
  const { logins } = await getAdminCollections();
  return (
    <AppScreen className="space-y-5">
      <PageHeader title="Admin Login History" description="Review successful technician login activity." actions={<ExportCsvButton href="/api/export/logins" />} />
      <SimpleTable columns={["Username", "Technician", "Login", "Logout", "Platform"]} rows={logins.map((item: any) => [item.username, item.technician_id, formatDateTime(item.login_time), formatDateTime(item.logout_time), item.platform || "N/A"])} />
    </AppScreen>
  );
}
