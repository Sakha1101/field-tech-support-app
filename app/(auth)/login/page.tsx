import { AppScreen } from "@/components/ui/app-screen";
import { LoginForm } from "@/components/forms/login-form";

const errorMessages: Record<string, { title: string; body: string }> = {
  invalid: {
    title: "Login failed",
    body: "Check your mobile number and password, then try again.",
  },
  profile: {
    title: "Account setup incomplete",
    body: "Your auth account exists but your technician profile is missing. Contact admin.",
  },
  pending: {
    title: "Approval pending",
    body: "Your signup is complete, but admin approval is still pending.",
  },
  inactive: {
    title: "Account inactive",
    body: "Your technician account is inactive. Contact admin.",
  },
  blocked: {
    title: "Account blocked",
    body: "Your technician account is blocked. Contact admin.",
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; signup?: string }>;
}) {
  const params = await searchParams;
  const errorState = params.error ? errorMessages[params.error] : null;
  const signupSuccess = params.signup === "success";

  return (
    <main className="app-shell min-h-screen">
      <div className="phone-frame flex min-h-screen flex-col justify-center">
        <AppScreen className="pb-8 pt-8">
          <div className="rounded-[28px] bg-brand p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">Field Support</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight">Technician Login</h1>
            <p className="mt-2 text-sm text-white/85">
              Sign in with your mobile number and password after signup and admin approval.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/80 bg-white p-5 shadow-card">
            {errorState ? (
              <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm font-bold text-amber-800">{errorState.title}</p>
                <p className="mt-1 text-sm text-amber-700">{errorState.body}</p>
              </div>
            ) : null}
            {signupSuccess ? (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-sm font-bold text-emerald-800">Signup complete</p>
                <p className="mt-1 text-sm text-emerald-700">Wait for admin approval, then log in with your mobile number and password.</p>
              </div>
            ) : null}
            <LoginForm />
          </div>
        </AppScreen>
      </div>
    </main>
  );
}
