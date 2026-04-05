import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function parseCsv(text: string) {
  const [headerLine, ...rows] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((item) => item.trim());
  return rows
    .map((row) => row.split(","))
    .filter((row) => row.length >= headers.length)
    .map((cells) =>
      headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = (cells[index] ?? "").trim();
        return acc;
      }, {}),
    );
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.redirect(new URL("/admin/parts?error=no-file", request.url));
  }

  const text = await file.text();
  const rows = parseCsv(text).map((row) => ({
    category: row.category,
    subcategory: row.subcategory || null,
    model_name: row.model_name || null,
    fg_code: row.fg_code || null,
    part_name: row.part_name,
    part_code: row.part_code,
    short_description: row.short_description || null,
    image_url: row.image_url || null,
    tags: row.tags ? row.tags.split("|").map((item) => item.trim()) : [],
    is_active: true,
  }));

  const supabase = await createClient();
  await supabase.from("parts").insert(rows);

  return NextResponse.redirect(new URL("/admin/parts?imported=1", request.url));
}
