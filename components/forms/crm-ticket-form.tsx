import { crmIssueTypes } from "@/lib/constants";
import { createCrmTicketAction } from "@/lib/actions";
import { SelectField, SubmitButton, TextAreaField, TextField } from "@/components/forms/field";
import { SectionCard } from "@/components/ui/section-card";

export function CrmTicketForm() {
  return (
    <SectionCard>
      <form action={createCrmTicketAction} className="space-y-4">
        <SelectField label="Issue Type" name="issue_type" options={[...crmIssueTypes]} required />
        <TextField label="Category" name="category" placeholder="Fan / Mixer / Smart Lock / CRM" required />
        <TextAreaField label="Short Description" name="description" placeholder="Write what is happening and what you already tried." required />
        <SubmitButton>Submit CRM Ticket</SubmitButton>
      </form>
    </SectionCard>
  );
}
