import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make your app insecure.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes
  const protectedPaths = ["/dashboard", "/editor", "/settings", "/billing"];
  const authPaths = ["/login", "/signup"];
  const pathname = request.nextUrl.pathname;

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // Redirect to login if not authenticated and trying to access protected routes
  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if authenticated and trying to access auth pages
  if (user && isAuthPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Trial enforcement for protected paths (except billing)
  if (user && isProtectedPath && !pathname.startsWith("/billing")) {
    try {
      // Query user's subscription status directly from Supabase
      // Column names match Prisma schema (camelCase)
      const { data: dbUser, error: dbError } = await supabase
        .from("users")
        .select("subscriptionStatus, trialEndsAt, currentPeriodEnd")
        .eq("id", user.id)
        .single();

      if (!dbError && dbUser) {
        const now = new Date();
        let isExpired = false;

        // Check subscription status
        if (dbUser.subscriptionStatus === "TRIAL" && dbUser.trialEndsAt) {
          isExpired = now >= new Date(dbUser.trialEndsAt);
        } else if (dbUser.subscriptionStatus === "TRIAL_EXPIRED") {
          isExpired = true;
        } else if (dbUser.subscriptionStatus === "PAST_DUE" && dbUser.currentPeriodEnd) {
          // 7 day grace period
          const gracePeriodEnd = new Date(dbUser.currentPeriodEnd);
          gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7);
          isExpired = now >= gracePeriodEnd;
        } else if (dbUser.subscriptionStatus === "CANCELLED" && dbUser.currentPeriodEnd) {
          isExpired = now >= new Date(dbUser.currentPeriodEnd);
        }
        // ACTIVE status is never expired

        if (isExpired) {
          const url = request.nextUrl.clone();
          url.pathname = "/billing";
          url.searchParams.set("reason", "trial_expired");
          return NextResponse.redirect(url);
        }
      }
      // If query fails (table doesn't exist yet, etc.), allow access
    } catch {
      // Silently continue - don't block access if DB query fails
    }
  }

  return supabaseResponse;
}
