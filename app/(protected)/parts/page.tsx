import { AppScreen } from "@/components/ui/app-screen";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { QuickFilterChip } from "@/components/ui/quick-filter-chip";
import { supportCategories } from "@/lib/constants";
import { getParts } from "@/lib/data/queries";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

export default async function PartsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  noStore();
  const params = await searchParams;
  const search = params.q?.trim();
  const category = params.category?.trim();
  const hasSearch = Boolean(search || category);
  const parts = hasSearch ? await getParts(params) : [];

  return (
    <AppScreen className="space-y-5">
      <PageHeader title="Part Finder" description="Search by category, model, FG code, part name, or part code. Optimized for fast mobile use." />
      <form className="grid gap-3 rounded-[24px] border border-white/80 bg-white/95 p-4 shadow-card sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <input name="q" defaultValue={params.q} placeholder="Search part code, part name, FG code, model" className="min-w-0 rounded-2xl border border-line px-4 py-3" />
        <input name="category" defaultValue={params.category} placeholder="Category" className="min-w-0 rounded-2xl border border-line px-4 py-3" />
        <button type="submit" className="rounded-2xl bg-brand px-4 py-3 font-bold text-white sm:col-span-2">Search</button>
      </form>
      <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
        {supportCategories.map((category) => (
          <QuickFilterChip key={category} href={`/parts?category=${encodeURIComponent(category)}`} label={category} active={params.category === category} />
        ))}
      </div>
      {parts.length ? (
        <div className="space-y-3">
          {parts.map((part: any) => (
            <Link
              key={part.id}
              href={`/parts/${part.id}`}
              className="block rounded-[22px] border border-white/80 bg-white p-4 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{part.category}</p>
                  <h3 className="truncate text-base font-bold text-ink">{part.part_name}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Code: {part.part_code} {part.fg_code ? `| FG: ${part.fg_code}` : ""} {part.model_name ? `| ${part.model_name}` : ""}
                  </p>
                </div>
                <span className="shrink-0 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">
                  View
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title={hasSearch ? "No parts found" : "Search to find parts"}
          description={
            hasSearch
              ? "Try part code, FG code, model, part name, or category."
              : "Search by part code, FG code, model, part name, or choose category."
          }
        />
      )}
    </AppScreen>
  );
}
