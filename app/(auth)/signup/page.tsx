import { AppScreen } from "@/components/ui/app-screen";
import { SignupForm } from "@/components/forms/signup-form";

export default function SignupPage() {
  return (
    <main className="app-shell min-h-screen">
      <div className="phone-frame flex min-h-screen flex-col justify-center">
        <AppScreen className="pb-8 pt-8">
          <div className="rounded-[28px] bg-brand p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">Field Support</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight">Technician Signup</h1>
            <p className="mt-2 text-sm text-white/85">
              Create your account using mobile number and password. Admin approval is required before access.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/80 bg-white p-5 shadow-card">
            <SignupForm />
          </div>
        </AppScreen>
      </div>
    </main>
  );
}
