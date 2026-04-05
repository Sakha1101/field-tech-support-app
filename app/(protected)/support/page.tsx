import { AppScreen } from "@/components/ui/app-screen";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SupportRoutingPanel } from "@/components/support/support-routing-panel";
import { getCurrentTechnician } from "@/lib/auth";
import { getSupportRoutingContacts, getSupportRoutingOptions } from "@/lib/data/queries";

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{ category_id?: string; issue_type_id?: string; q?: string; show?: string }>;
}) {
  const params = await searchParams;
  const technician = await getCurrentTechnician();
  const shouldShowContacts = params.show === "1" && Boolean(params.category_id) && Boolean(params.issue_type_id);
  const [{ categories, issueTypes }, contacts] = await Promise.all([
    getSupportRoutingOptions(),
    shouldShowContacts ? getSupportRoutingContacts({ category_id: params.category_id }) : Promise.resolve([]),
  ]);

  return (
    <AppScreen className="space-y-5">
      <PageHeader title="Call Support" description="Choose category and issue type, then load the escalation contacts for that product." />
      {!categories.length || !issueTypes.length ? (
        <EmptyState title="Support setup is not ready" description="Ask an admin to activate categories and issue types first." />
      ) : (
        <SupportRoutingPanel
          categories={categories as any}
          issueTypes={issueTypes as any}
          contacts={contacts as any}
          selectedCategoryId={params.category_id}
          selectedIssueTypeId={params.issue_type_id}
          showContacts={shouldShowContacts}
          technician={technician}
        />
      )}
    </AppScreen>
  );
}
