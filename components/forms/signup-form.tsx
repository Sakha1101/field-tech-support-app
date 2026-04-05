"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/browser";
import { finalizeTechnicianSignupAction } from "@/lib/actions";
import { normalizeMobileNumber } from "@/lib/validators";

export function SignupForm() {
  const router = useRouter();
  const supabase = createClient();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isPending, startTransition] = useTransition();

  const finishSignup = async () => {
    const normalizedMobileNumber = normalizeMobileNumber(mobileNumber);
    if (normalizedMobileNumber.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }

    const email = `${normalizedMobileNumber}@tech.test`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    if (!data.user?.id) {
      toast.error("Signup user was not created.");
      return;
    }

    startTransition(async () => {
      const result = await finalizeTechnicianSignupAction({
        mobileNumber: normalizedMobileNumber,
        fullName,
        authUserId: data.user.id,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Signup complete. Wait for admin approval, then log in.");
      await supabase.auth.signOut();
      router.push("/login?signup=success");
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">Mobile Number</span>
        <input
          value={mobileNumber}
          onChange={(event) => setMobileNumber(event.target.value)}
          placeholder="7757936036"
          className="w-full rounded-2xl border border-line px-4 py-3"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">Full Name</span>
        <input
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Enter full name"
          className="w-full rounded-2xl border border-line px-4 py-3"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">Create Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create password"
          className="w-full rounded-2xl border border-line px-4 py-3"
        />
      </label>
      <button
        type="button"
        onClick={finishSignup}
        disabled={isPending}
        className="w-full rounded-2xl bg-brand px-5 py-3 text-base font-bold text-white"
      >
        {isPending ? "Submitting..." : "Create Account"}
      </button>

      <p className="text-center text-xs text-slate-500">
        Already registered? <Link href="/login" className="font-semibold text-brand">Login</Link>
      </p>
    </div>
  );
}
