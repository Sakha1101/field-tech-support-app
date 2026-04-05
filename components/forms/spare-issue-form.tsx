import { spareIssueTypes } from "@/lib/constants";
import { createSpareIssueAction } from "@/lib/actions";
import { SelectField, SubmitButton, TextAreaField, TextField } from "@/components/forms/field";
import { SectionCard } from "@/components/ui/section-card";

export function SpareIssueForm() {
  return (
    <SectionCard>
      <form action={createSpareIssueAction} className="space-y-4">
        <TextField label="Category" name="category" placeholder="Fan / Mixer / Smart Lock" required />
        <TextField label="Subcategory" name="subcategory" placeholder="Mechanical / Electrical" />
        <TextField label="Model Name" name="model_name" placeholder="Model or product name" />
        <TextField label="FG Code" name="fg_code" placeholder="FG12345" />
        <TextField label="Part Name" name="part_name" placeholder="Blade assembly" />
        <TextField label="Part Code" name="part_code" placeholder="PC12345" />
        <SelectField label="Issue Type" name="issue_type" options={[...spareIssueTypes]} required />
        <TextAreaField label="Description" name="description" placeholder="Explain the spare issue" required />
        <SubmitButton>Submit Spare Issue</SubmitButton>
      </form>
    </SectionCard>
  );
}
