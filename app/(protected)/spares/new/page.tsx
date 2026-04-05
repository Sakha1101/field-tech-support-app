import { AppScreen } from "@/components/ui/app-screen";
import { EmptyState } from "@/components/ui/empty-state";
import { SelectField, SubmitButton, TextAreaField, TextField } from "@/components/forms/field";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { createSpareIssueAction } from "@/lib/actions";
import { getActiveCategories, getIssueTypes } from "@/lib/data/queries";

export default async function NewSpareIssuePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const [issueTypes, categories] = await Promise.all([getIssueTypes(), getActiveCategories()]);
  return (
    <AppScreen className="space-y-5">
      <PageHeader title="Create Spare Issue" description="Raise typed spare-related issues for review." />
      {error === "validation" ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          Please enter all required fields correctly. Description must be long enough.
        </div>
      ) : null}
      {issueTypes.length && categories.length ? (
        <SectionCard>
          <form action={createSpareIssueAction} className="space-y-4">
            <SelectField label="Category" name="category" options={categories.map((item) => item.name)} required />
            <TextField label="Subcategory" name="subcategory" placeholder="Mechanical / Electrical" />
            <TextField label="Model Name" name="model_name" placeholder="Model or product name" />
            <TextField label="FG Code" name="fg_code" placeholder="FG12345" />
            <TextField label="Part Name" name="part_name" placeholder="Blade assembly" />
            <TextField label="Part Code" name="part_code" placeholder="PC12345" />
            <SelectField label="Issue Type" name="issue_type" options={issueTypes.map((item) => item.name)} required />
            <TextAreaField label="Description" name="description" placeholder="Explain the spare issue" required />
            <SubmitButton>Submit Spare Issue</SubmitButton>
          </form>
        </SectionCard>
      ) : !categories.length ? (
        <EmptyState title="No categories available" description="Ask an admin to add active categories before creating a spare issue." />
      ) : (
        <EmptyState title="No issue types available" description="Ask an admin to add issue types before creating a spare issue." />
      )}
    </AppScreen>
  );
}
