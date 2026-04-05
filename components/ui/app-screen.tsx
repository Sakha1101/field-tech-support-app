import { cn } from "@/lib/utils";

export function AppScreen({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-4 px-4 pb-28 pt-4", className)}>{children}</div>;
}
