import { AppScreen } from "@/components/ui/app-screen";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { InfoGrid } from "@/components/ui/info-grid";
import { getPartById } from "@/lib/data/queries";

export default async function PartDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const part = await getPartById(id);
  if (!part) notFound();

  return (
    <AppScreen className="space-y-5">
      <PageHeader title={part.part_name} description="Part detail and quick reference information." />
      <SectionCard className="overflow-hidden p-0">
        <div className="relative h-64 bg-slate-100">
          {part.image_url ? <Image src={part.image_url} alt={part.part_name} fill className="object-cover" /> : <div className="flex h-full items-center justify-center font-semibold text-slate-500">No part image</div>}
        </div>
        <div className="p-4">
          <InfoGrid items={[
            { label: "Part Code", value: part.part_code },
            { label: "FG Code", value: part.fg_code || "N/A" },
            { label: "Model", value: part.model_name || "N/A" },
            { label: "Category", value: `${part.category}${part.subcategory ? ` / ${part.subcategory}` : ""}` },
          ]} />
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{part.short_description || "No additional description available."}</div>
        </div>
      </SectionCard>
    </AppScreen>
  );
}
