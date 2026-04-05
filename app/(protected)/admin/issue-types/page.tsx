import { AppScreen } from "@/components/ui/app-screen";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { SimpleTable } from "@/components/tables/simple-table";
import { createIssueTypeAction, deleteIssueTypeAction, toggleIssueTypeStatusAction } from "@/lib/actions";
import { getIssueTypes } from "@/lib/data/queries";

export default async function AdminIssueTypesPage() {
  const issueTypes = await getIssueTypes();

  return (
    <AppScreen className="space-y-5">
      <PageHeader title="Manage Issue Types" description="Add and activate/deactivate issue types for support routing." />
      <SectionCard>
        <form action={createIssueTypeAction} className="grid gap-3">
          <input name="name" placeholder="Issue type name" className="rounded-2xl border border-line px-4 py-3" />
          <button type="submit" className="rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white">Add Issue Type</button>
        </form>
      </SectionCard>
      {issueTypes.length ? (
        <SimpleTable
          columns={["Name", "Status", "Actions"]}
          rows={issueTypes.map((item: any) => [
            item.name,
            item.is_active ? "Active" : "Inactive",
            <div key={item.id} className="flex gap-2">
              <form action={toggleIssueTypeStatusAction}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="is_active" value={String(item.is_active)} />
                <button type="submit" className="rounded-xl border border-line px-3 py-2 text-xs font-bold">
                  {item.is_active ? "Deactivate" : "Activate"}
                </button>
              </form>
              <form action={deleteIssueTypeAction}>
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white">
                  Delete
                </button>
              </form>
            </div>,
          ])}
        />
      ) : (
        <EmptyState title="No issue types yet" description="Add your first issue type to make CRM and spare forms selectable." />
      )}
    </AppScreen>
  );
}
