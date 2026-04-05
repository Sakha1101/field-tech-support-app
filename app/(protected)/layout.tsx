import { MobileNav } from "@/components/mobile-nav";
import { AppHeader } from "@/components/ui/app-header";
import { getCurrentTechnician } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const technician = await getCurrentTechnician();

  return (
    <div className="app-shell min-h-screen">
      <div className="phone-frame safe-top safe-bottom flex min-h-screen flex-col">
        <AppHeader technician={technician} />
        <main className="flex-1">{children}</main>
        <MobileNav role={technician.role} />
      </div>
    </div>
  );
}
