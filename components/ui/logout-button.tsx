"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function LogoutButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700",
        className,
      )}
      onClick={() => {
        startTransition(async () => {
          const result = await fetch("/api/auth/logout", { method: "POST" });
          if (!result.ok) {
            toast.error("Logout failed");
            return;
          }
          router.push("/login");
          router.refresh();
        });
      }}
      disabled={isPending}
    >
      {isPending ? "Signing out..." : children}
    </button>
  );
}
