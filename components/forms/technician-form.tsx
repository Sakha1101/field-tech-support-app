import { createTechnicianAction } from "@/lib/actions";
import { SelectField, SubmitButton, TextField } from "@/components/forms/field";
import { SectionCard } from "@/components/ui/section-card";

export function TechnicianForm() {
  return (
    <SectionCard>
      <form action={createTechnicianAction} className="grid gap-4 md:grid-cols-2">
        <TextField label="Full Name" name="full_name" required />
        <TextField label="Technician Code" name="technician_code" />
        <TextField label="Username" name="username" />
        <TextField label="Mobile Number" name="mobile_number" required />
        <TextField label="Email" name="email" type="email" />
        <TextField label="City" name="city" />
        <TextField label="State" name="state" />
        <TextField label="Service Center" name="service_center" />
        <TextField label="Category Access" name="category_access" placeholder="Fan, Mixer Grinder" />
        <SelectField label="Role" name="role" options={["technician", "team_lead", "admin"]} required />
        <div className="md:col-span-2">
          <SubmitButton className="md:w-auto">Create Technician Record</SubmitButton>
        </div>
      </form>
    </SectionCard>
  );
}
