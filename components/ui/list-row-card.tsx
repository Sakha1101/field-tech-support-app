import { cn } from "@/lib/utils";

export function ListRowCard({
  title,
  subtitle,
  meta,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[22px] border border-white/80 bg-white p-4 shadow-card", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-ink">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
        </div>
        {meta}
      </div>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
