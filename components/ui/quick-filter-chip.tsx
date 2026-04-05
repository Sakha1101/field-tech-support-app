import Link from "next/link";
import { cn } from "@/lib/utils";

export function QuickFilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-semibold",
        active
          ? "border-brand bg-brand text-white"
          : "border-slate-200 bg-white text-slate-700",
      )}
    >
      {label}
    </Link>
  );
}
