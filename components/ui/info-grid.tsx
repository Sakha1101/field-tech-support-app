export function InfoGrid({
  items,
}: {
  items: Array<{ label: string; value: React.ReactNode }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
          <div className="mt-1 text-sm font-semibold text-ink">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
