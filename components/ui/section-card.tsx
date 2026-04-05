import { cn } from "@/lib/utils";

export function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[22px] border border-white/80 bg-white p-4 shadow-card", className)}>
      {children}
    </section>
  );
}
