import { AppScreen } from "@/components/ui/app-screen";
import { OperationsRequestForm } from "@/components/forms/operations-request-form";
import { PageHeader } from "@/components/ui/page-header";

export default async function NewOperationsRequestPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <AppScreen className="space-y-5">
      <PageHeader title="Create Operations Request" description="Raise typed operations requests for tools and logistics." />
      {error === "validation" ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          Please enter all required fields correctly. Description must be long enough.
        </div>
      ) : null}
      <OperationsRequestForm />
    </AppScreen>
  );
}
