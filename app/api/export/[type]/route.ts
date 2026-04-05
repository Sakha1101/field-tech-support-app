import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedTables: Record<string, string> = {
  technicians: "technicians",
  contacts: "support_contacts",
  parts: "parts",
  crm: "crm_tickets",
  operations: "operations_requests",
  spares: "spare_issues",
  logins: "login_history",
  support_logs: "support_logs",
  search_logs: "search_logs",
};

function toCsv(rows: Array<Record<string, unknown>>) {
  if (!rows.length) return "No data\n";
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\n");
}

export async function GET(_: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const table = allowedTables[type];
  if (!table) {
    return NextResponse.json({ error: "Unknown export type" }, { status: 404 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return new NextResponse(toCsv((data ?? []) as Array<Record<string, unknown>>), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=${type}.csv`,
    },
  });
}
