import { SectionCard } from "@/components/ui/section-card";

export function MetricCard({ label, value, helper }: { label: string; value: string | number; helper?: string }) {
  return (
    <SectionCard>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <h3 className="mt-2 text-3xl font-bold text-ink">{value}</h3>
      {helper ? <p className="mt-1 text-sm text-slate-600">{helper}</p> : null}
    </SectionCard>
  );
}
