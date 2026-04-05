import { AppScreen } from "@/components/ui/app-screen";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { SimpleTable } from "@/components/tables/simple-table";
import { createCategoryAction, deleteCategoryAction, toggleCategoryStatusAction } from "@/lib/actions";
import { getCategories } from "@/lib/data/queries";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <AppScreen className="space-y-5">
      <PageHeader title="Manage Categories" description="Add and activate/deactivate categories." />
      <SectionCard>
        <form action={createCategoryAction} className="grid gap-3">
          <input name="name" placeholder="Category name" className="rounded-2xl border border-line px-4 py-3" />
          <button type="submit" className="rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white">Add Category</button>
        </form>
      </SectionCard>
      {categories.length ? (
        <SimpleTable
          columns={["Name", "Status", "Actions"]}
          rows={categories.map((item: any) => [
            item.name,
            item.is_active ? "Active" : "Inactive",
            <div key={item.id} className="flex gap-2">
              <form action={toggleCategoryStatusAction}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="is_active" value={String(item.is_active)} />
                <button type="submit" className="rounded-xl border border-line px-3 py-2 text-xs font-bold">
                  {item.is_active ? "Deactivate" : "Activate"}
                </button>
              </form>
              <form action={deleteCategoryAction}>
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white">
                  Delete
                </button>
              </form>
            </div>,
          ])}
        />
      ) : (
        <EmptyState title="No categories yet" description="Add your first category to use it across support and ticket forms." />
      )}
    </AppScreen>
  );
}
