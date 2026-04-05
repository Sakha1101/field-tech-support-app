import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  New: "bg-sky-100 text-sky-700",
  "In Progress": "bg-amber-100 text-amber-800",
  "Waiting for User": "bg-violet-100 text-violet-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Closed: "bg-slate-200 text-slate-700",
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-700",
  blocked: "bg-rose-100 text-rose-700",
  active: "bg-teal-100 text-teal-700",
  inactive: "bg-slate-200 text-slate-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-700",
  Dispatched: "bg-blue-100 text-blue-700",
  Delivered: "bg-teal-100 text-teal-700",
  "In Review": "bg-amber-100 text-amber-800",
  "Waiting for Update": "bg-violet-100 text-violet-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold", colorMap[status] ?? "bg-slate-100 text-slate-700")}>
      {status}
    </span>
  );
}
