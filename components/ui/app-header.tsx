import Link from "next/link";
import { LogOut } from "lucide-react";
import type { TechnicianProfile } from "@/types/app";
import { LogoutButton } from "@/components/ui/logout-button";

export function AppHeader({ technician }: { technician: TechnicianProfile }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/dashboard" className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
            Field Tech
          </Link>
          <p className="mt-1 text-sm font-semibold text-ink">{technician.full_name}</p>
          <p className="text-xs capitalize text-slate-500">{technician.role.replace("_", " ")}</p>
        </div>
        <LogoutButton className="min-h-11 rounded-2xl px-3">
          <LogOut className="h-4 w-4" />
          <span className="text-xs">Logout</span>
        </LogoutButton>
      </div>
    </header>
  );
}
