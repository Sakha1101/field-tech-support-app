import Image from "next/image";
import Link from "next/link";
import { SectionCard } from "@/components/ui/section-card";

export function PartCard({ part }: { part: any }) {
  return (
    <SectionCard className="overflow-hidden p-0">
      <div className="relative h-40 bg-slate-100">
        {part.image_url ? <Image src={part.image_url} alt={part.part_name} fill className="object-cover" /> : <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">No Image</div>}
      </div>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{part.category}</p>
          <h3 className="mt-1 text-lg font-bold text-ink">{part.part_name}</h3>
          <p className="text-sm text-slate-600">{part.short_description || "No description available."}</p>
        </div>
        <div className="grid gap-2 rounded-2xl bg-slate-50 p-3 text-sm">
          <p><span className="font-semibold">Part Code:</span> {part.part_code}</p>
          <p><span className="font-semibold">FG Code:</span> {part.fg_code || "N/A"}</p>
          <p><span className="font-semibold">Model:</span> {part.model_name || "N/A"}</p>
        </div>
        <Link href={`/parts/${part.id}`} className="block rounded-2xl bg-ink px-4 py-3 text-center font-bold text-white">View Details</Link>
      </div>
    </SectionCard>
  );
}
