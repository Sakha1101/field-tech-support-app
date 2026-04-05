import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SectionCard } from "@/components/ui/section-card";

export function ActionCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href}>
      <SectionCard className="h-full transition hover:-translate-y-0.5">
        <div className="flex h-full items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-ink">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          </div>
          <ChevronRight className="mt-1 h-5 w-5 text-brand" />
        </div>
      </SectionCard>
    </Link>
  );
}
