import { operationsRequestTypes } from "@/lib/constants";
import { createOperationsRequestAction } from "@/lib/actions";
import { SelectField, SubmitButton, TextAreaField, TextField } from "@/components/forms/field";
import { SectionCard } from "@/components/ui/section-card";

export function OperationsRequestForm() {
  return (
    <SectionCard>
      <form action={createOperationsRequestAction} className="space-y-4">
        <SelectField label="Request Type" name="request_type" options={[...operationsRequestTypes]} required />
        <TextField label="Quantity" name="quantity" type="number" placeholder="1" required />
        <TextField label="Size (if relevant)" name="size" placeholder="M / L / XL" />
        <TextField label="Location" name="location" placeholder="City / service center / address" required />
        <TextAreaField label="Description" name="description" placeholder="Short request details" required />
        <SubmitButton>Submit Operations Request</SubmitButton>
      </form>
    </SectionCard>
  );
}
