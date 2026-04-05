import { AppScreen } from "@/components/ui/app-screen";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { SelectField, SubmitButton, TextAreaField } from "@/components/forms/field";
import { createCrmTicketAction } from "@/lib/actions";
import { getActiveCategories, getIssueTypes } from "@/lib/data/queries";

export default async function NewCrmTicketPage() {
  const [issueTypes, categories] = await Promise.all([getIssueTypes(), getActiveCategories()]);
  return (
    <AppScreen className="space-y-5">
      <PageHeader title="Create CRM Ticket" description="Raise typed CRM or app-related issues." />
      {issueTypes.length && categories.length ? (
        <SectionCard>
          <form action={createCrmTicketAction} className="space-y-4">
            <SelectField label="Issue Type" name="issue_type" options={issueTypes.map((item) => item.name)} required />
            <SelectField label="Category" name="category" options={categories.map((item) => item.name)} required />
            <TextAreaField label="Short Description" name="description" placeholder="Write what is happening and what you already tried." required />
            <SubmitButton>Submit CRM Ticket</SubmitButton>
          </form>
        </SectionCard>
      ) : !categories.length ? (
        <EmptyState title="No categories available" description="Ask an admin to add active categories before creating a CRM ticket." />
      ) : (
        <EmptyState title="No issue types available" description="Ask an admin to add issue types before creating a CRM ticket." />
      )}
    </AppScreen>
  );
}
