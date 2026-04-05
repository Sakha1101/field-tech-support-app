"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Headset, House, PackageSearch, Settings2, ShieldAlert, UserCircle2 } from "lucide-react";
import type { Role } from "@/types/app";
import { cn } from "@/lib/utils";

const technicianItems = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/support", label: "Support", icon: Headset },
  { href: "/parts", label: "Parts", icon: PackageSearch },
  { href: "/crm", label: "Tickets", icon: ShieldAlert },
  { href: "/activity", label: "Activity", icon: UserCircle2 },
];

const adminItems = [
  { href: "/admin", label: "Admin", icon: Settings2 },
  { href: "/support", label: "Support", icon: Headset },
  { href: "/parts", label: "Parts", icon: PackageSearch },
  { href: "/admin/crm", label: "Tickets", icon: ShieldAlert },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const leadItems = [
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/support", label: "Support", icon: Headset },
  { href: "/parts", label: "Parts", icon: PackageSearch },
  { href: "/crm", label: "Tickets", icon: ShieldAlert },
  { href: "/activity", label: "Activity", icon: UserCircle2 },
];

export function MobileNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = role === "admin" ? adminItems : role === "team_lead" ? leadItems : technicianItems;

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-[430px] border-t border-slate-200 bg-white px-3 py-2">
      <div className="grid grid-cols-5 gap-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center rounded-2xl px-2 py-2 text-center text-[11px] font-semibold",
                active ? "bg-brand-soft text-brand" : "text-slate-500",
              )}
            >
              <Icon className="mb-1 h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
