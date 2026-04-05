import Link from "next/link";
import { loginAction } from "@/lib/actions";
import { SubmitButton, TextField } from "@/components/forms/field";

export function LoginForm() {
  return (
    <form action={loginAction} className="space-y-4">
      <TextField label="Mobile Number" name="mobile_number" placeholder="+919876543210" required />
      <TextField label="Password" name="password" type="password" placeholder="Enter password" required />
      <SubmitButton>Login</SubmitButton>
      <p className="text-center text-xs text-slate-500">
        New technician? <Link href="/signup" className="font-semibold text-brand">Create account</Link>
      </p>
    </form>
  );
}
