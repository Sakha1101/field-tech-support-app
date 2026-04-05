import { createPartAction } from "@/lib/actions";
import { SubmitButton, TextAreaField, TextField } from "@/components/forms/field";
import { SectionCard } from "@/components/ui/section-card";

export function PartForm() {
  return (
    <SectionCard>
      <form action={createPartAction} className="grid gap-4 md:grid-cols-2">
        <TextField label="Category" name="category" required />
        <TextField label="Subcategory" name="subcategory" />
        <TextField label="Model Name" name="model_name" />
        <TextField label="FG Code" name="fg_code" />
        <TextField label="Part Name" name="part_name" required />
        <TextField label="Part Code" name="part_code" required />
        <TextField label="Image URL" name="image_url" placeholder="https://..." />
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Part Image Upload</span>
          <input
            type="file"
            name="part_image"
            accept="image/*"
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm"
          />
        </label>
        <TextField label="Tags" name="tags" placeholder="motor, winding, fan" />
        <div className="md:col-span-2">
          <TextAreaField label="Short Description" name="short_description" placeholder="Short part details" />
        </div>
        <div className="md:col-span-2">
          <SubmitButton className="md:w-auto">Add Part</SubmitButton>
        </div>
      </form>
    </SectionCard>
  );
}
