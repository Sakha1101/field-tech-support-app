import { AppScreen } from "@/components/ui/app-screen";
import { PageHeader } from "@/components/ui/page-header";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import { SupportContactForm } from "@/components/forms/support-contact-form";
import { SimpleTable } from "@/components/tables/simple-table";
import { deleteSupportContactAction, toggleSupportContactStatusAction, updateSupportContactAction } from "@/lib/actions";
import { getAdminCollections } from "@/lib/data/queries";

export default async function AdminContactsPage() {
  const { contacts, categories } = await getAdminCollections();
  return (
    <AppScreen className="space-y-5">
      <PageHeader title="Manage Contacts" description="Maintain support routing by category and escalation level." actions={<ExportCsvButton href="/api/export/contacts" />} />
      <SupportContactForm categories={categories} />
      <SimpleTable
        columns={["Name", "Route", "Mobile", "Level", "Actions"]}
        rows={contacts.map((item: any) => [
          item.name,
          `${categories.find((category: any) => category.id === item.category_id)?.name || item.category || "-"}`,
          item.mobile_number || item.phone,
          item.escalation_level,
          <div key={item.id} className="space-y-2">
            <form action={updateSupportContactAction} className="grid gap-2">
              <input type="hidden" name="id" value={item.id} />
              <input name="name" defaultValue={item.name} className="w-40 rounded-xl border border-line px-2 py-2 text-xs" />
              <input name="designation" defaultValue={item.designation ?? ""} placeholder="Designation" className="w-40 rounded-xl border border-line px-2 py-2 text-xs" />
              <input name="mobile_number" defaultValue={item.mobile_number || item.phone} className="w-40 rounded-xl border border-line px-2 py-2 text-xs" />
              <select name="category_id" defaultValue={item.category_id} className="w-40 rounded-xl border border-line px-2 py-2 text-xs">
                {categories.map((category: any) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              <select name="escalation_level" defaultValue={String(item.escalation_level)} className="w-40 rounded-xl border border-line px-2 py-2 text-xs">
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
              <button type="submit" className="rounded-xl bg-ink px-3 py-2 text-xs font-bold text-white">Save</button>
            </form>
            <div className="flex gap-2">
              <form action={toggleSupportContactStatusAction}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="is_active" value={String(item.is_active)} />
                <button type="submit" className="rounded-xl border border-line px-3 py-2 text-xs font-bold">
                  {item.is_active ? "Deactivate" : "Activate"}
                </button>
              </form>
              <form action={deleteSupportContactAction}>
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white">
                  Delete
                </button>
              </form>
            </div>
          </div>,
        ])}
      />
    </AppScreen>
  );
}
