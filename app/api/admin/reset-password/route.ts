import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.json();
  const admin = createAdminClient();
  const result = await admin.auth.admin.updateUserById(body.userId, {
    password: body.password,
  });

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
