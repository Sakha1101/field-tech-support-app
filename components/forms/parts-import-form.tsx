import Link from "next/link";
import { SectionCard } from "@/components/ui/section-card";

export function PartsImportForm() {
  return (
    <SectionCard>
      <form action="/api/parts/import" method="post" encType="multipart/form-data" className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-ink">CSV Import</h3>
          <p className="mt-1 text-sm text-slate-600">Upload a CSV using the provided template to bulk import parts.</p>
        </div>
        <input type="file" name="file" accept=".csv,text/csv" required className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
        <button type="submit" className="rounded-2xl bg-ink px-4 py-3 text-sm font-bold text-white">
          Import CSV
        </button>
        <Link href="/templates/parts-import-template.csv" className="block text-sm font-semibold text-brand">
          Download CSV template
        </Link>
      </form>
    </SectionCard>
  );
}
