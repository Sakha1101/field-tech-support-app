import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("ft_session_id")?.value;

  if (sessionId) {
    await supabase
      .from("login_history")
      .update({ logout_time: new Date().toISOString() })
      .eq("session_id", sessionId)
      .is("logout_time", null);
  }

  await supabase.auth.signOut();
  cookieStore.delete("ft_session_id");
  return NextResponse.json({ ok: true });
}
