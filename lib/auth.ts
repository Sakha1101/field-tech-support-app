import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { TechnicianProfile } from "@/types/app";

export const getCurrentTechnician = cache(async (): Promise<TechnicianProfile> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: technician, error } = await supabase
    .from("technicians")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !technician) {
    redirect("/login?error=profile");
  }

  if (technician.approval_status === "blocked") {
    redirect("/login?error=blocked");
  }

  if (technician.approval_status !== "approved") {
    redirect("/login?error=pending");
  }

  if (!technician.is_active) {
    redirect("/login?error=inactive");
  }

  return technician as TechnicianProfile;
});
