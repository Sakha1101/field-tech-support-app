import { createSupportContactAction } from "@/lib/actions";
import { SubmitButton, TextField } from "@/components/forms/field";
import { SectionCard } from "@/components/ui/section-card";

export function SupportContactForm({
  categories,
}: {
  categories: Array<{ id: string; name: string }>;
}) {
  return (
    <SectionCard>
      <form action={createSupportContactAction} className="grid gap-4 md:grid-cols-2">
        <TextField label="Name" name="name" required />
        <TextField label="Designation" name="designation" />
        <TextField label="Mobile Number" name="mobile_number" required />
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Category</span>
          <select name="category_id" required className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-base outline-none transition focus:border-brand">
            <option value="">Select</option>
            {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Escalation Level</span>
          <select name="escalation_level" required className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-base outline-none transition focus:border-brand">
            <option value="">Select</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </label>
        <div className="md:col-span-2">
          <SubmitButton className="md:w-auto">Add Support Contact</SubmitButton>
        </div>
      </form>
    </SectionCard>
  );
}
