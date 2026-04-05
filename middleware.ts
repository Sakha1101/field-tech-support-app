import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const protectedMatchers = [
  "/dashboard",
  "/support",
  "/parts",
  "/crm",
  "/operations",
  "/spares",
  "/activity",
  "/admin",
  "/analytics",
];

const adminOnlyMatchers = ["/admin"];

const leadAllowedMatchers = ["/analytics"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  const isProtected = protectedMatchers.some((path) => pathname.startsWith(path));
  if (!isProtected) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const { data: technician } = await supabase
    .from("technicians")
    .select("role, is_active, approval_status")
    .eq("auth_user_id", user.id)
    .single();

  if (!technician) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("error", "profile");
    return NextResponse.redirect(redirectUrl);
  }

  if (technician.approval_status === "blocked") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("error", "blocked");
    return NextResponse.redirect(redirectUrl);
  }

  if (technician.approval_status !== "approved") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("error", "pending");
    return NextResponse.redirect(redirectUrl);
  }

  if (!technician.is_active) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("error", "inactive");
    return NextResponse.redirect(redirectUrl);
  }

  if (adminOnlyMatchers.some((path) => pathname.startsWith(path)) && technician.role !== "admin") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  if (
    leadAllowedMatchers.some((path) => pathname.startsWith(path)) &&
    !["admin", "team_lead"].includes(technician.role)
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/support/:path*",
    "/parts/:path*",
    "/crm/:path*",
    "/operations/:path*",
    "/spares/:path*",
    "/activity/:path*",
    "/admin/:path*",
    "/analytics/:path*",
  ],
};
