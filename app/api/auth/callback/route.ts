import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Whitelist of allowed redirect prefixes
const ALLOWED_REDIRECT_PREFIXES = ["/dashboard", "/editor", "/settings", "/billing"];

/**
 * Validates that a redirect path is safe to use
 * Prevents open redirect attacks
 */
function isValidRedirectPath(path: string): boolean {
  // Must be a relative path
  if (!path || !path.startsWith("/")) return false;

  // Block protocol-relative URLs (//evil.com)
  if (path.startsWith("//")) return false;

  // Block embedded protocols
  if (path.includes("://")) return false;

  // Decode and re-validate (prevent encoded attacks like %2F%2F)
  try {
    const decoded = decodeURIComponent(path);
    if (decoded !== path) {
      // Re-run checks on decoded version
      if (decoded.startsWith("//") || decoded.includes("://")) return false;
    }
  } catch {
    return false; // Invalid encoding
  }

  // Whitelist approach: only allow known prefixes
  return ALLOWED_REDIRECT_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const rawRedirectTo = requestUrl.searchParams.get("redirectTo");
  const redirectTo =
    rawRedirectTo && isValidRedirectPath(rawRedirectTo)
      ? rawRedirectTo
      : "/dashboard";
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate`);
}
