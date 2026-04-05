import { AppScreen } from "@/components/ui/app-screen";
import { PageHeader } from "@/components/ui/page-header";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import { PartForm } from "@/components/forms/part-form";
import { PartsImportForm } from "@/components/forms/parts-import-form";
import { SimpleTable } from "@/components/tables/simple-table";
import { deletePartAction, togglePartStatusAction, updatePartAction } from "@/lib/actions";
import { getAdminCollections } from "@/lib/data/queries";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

export default async function AdminPartsPage({ searchParams }: { searchParams: Promise<{ q?: string; edit?: string }> }) {
  noStore();
  const { parts } = await getAdminCollections();
  const { q, edit } = await searchParams;
  const filtered = q
    ? parts.filter((item: any) =>
        [item.part_name, item.part_code, item.fg_code, item.model_name, item.category]
          .filter(Boolean)
          .some((value: string) => value.toLowerCase().includes(q.toLowerCase())),
      )
    : parts;
  return (
    <AppScreen className="space-y-5">
      <PageHeader title="Manage Parts" description="Add parts manually or bulk import via CSV." actions={<ExportCsvButton href="/api/export/parts" />} />
      <form className="grid gap-3 rounded-[24px] border border-white/80 bg-white/95 p-4 shadow-card">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search part name, code, FG code, model, or category"
          className="w-full rounded-2xl border border-line px-4 py-3"
        />
        <button type="submit" className="rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white">
          Search Parts
        </button>
      </form>
      <PartForm />
      <PartsImportForm />
      <SimpleTable
        columns={["Part", "Code", "FG Code", "Model", "Category", "Actions"]}
        rows={filtered.map((item: any) => [
          edit === item.id ? (
            <input form={`part-edit-${item.id}`} name="part_name" defaultValue={item.part_name} className="w-40 rounded-xl border border-line px-2 py-2 text-xs" />
          ) : item.part_name,
          edit === item.id ? (
            <input form={`part-edit-${item.id}`} name="part_code" defaultValue={item.part_code} className="w-32 rounded-xl border border-line px-2 py-2 text-xs" />
          ) : item.part_code,
          edit === item.id ? (
            <input form={`part-edit-${item.id}`} name="fg_code" defaultValue={item.fg_code || ""} className="w-28 rounded-xl border border-line px-2 py-2 text-xs" />
          ) : (item.fg_code || "N/A"),
          edit === item.id ? (
            <input form={`part-edit-${item.id}`} name="model_name" defaultValue={item.model_name || ""} className="w-32 rounded-xl border border-line px-2 py-2 text-xs" />
          ) : (item.model_name || "N/A"),
          edit === item.id ? (
            <input form={`part-edit-${item.id}`} name="category" defaultValue={item.category} className="w-32 rounded-xl border border-line px-2 py-2 text-xs" />
          ) : item.category,
          <div key={item.id} className="flex gap-2">
            {edit === item.id ? (
              <>
                <form id={`part-edit-${item.id}`} action={updatePartAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="subcategory" value={item.subcategory || ""} />
                  <input type="hidden" name="short_description" value={item.short_description || ""} />
                </form>
                <button form={`part-edit-${item.id}`} type="submit" className="rounded-xl bg-ink px-3 py-2 text-xs font-bold text-white">
                  Save
                </button>
                <Link href={q ? `/admin/parts?q=${encodeURIComponent(q)}` : "/admin/parts"} className="rounded-xl border border-line px-3 py-2 text-xs font-bold">
                  Cancel
                </Link>
              </>
            ) : (
              <Link href={q ? `/admin/parts?q=${encodeURIComponent(q)}&edit=${item.id}` : `/admin/parts?edit=${item.id}`} className="rounded-xl border border-line px-3 py-2 text-xs font-bold">
                Edit
              </Link>
            )}
            <form action={togglePartStatusAction}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="is_active" value={String(item.is_active)} />
              <button type="submit" className="rounded-xl border border-line px-3 py-2 text-xs font-bold">
                {item.is_active ? "Deactivate" : "Activate"}
              </button>
            </form>
            <form action={deletePartAction}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white">
                Delete
              </button>
            </form>
          </div>,
        ])}
      />
    </AppScreen>
  );
}
