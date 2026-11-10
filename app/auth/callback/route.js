import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function redirectToApp(request, path) {
  // All paths passed here are fixed application paths.
  // No browser-supplied redirect destination is accepted.
  return NextResponse.redirect(new URL(path, request.url));
}

export async function GET(request) {
  const callbackUrl = new URL(request.url);
  const code = callbackUrl.searchParams.get("code");
  const providerError = callbackUrl.searchParams.get("error");

  if (providerError || !code) {
    const result =
      providerError === "access_denied" ? "cancelled" : "error";

    return redirectToApp(request, `/?google=${result}`);
  }

  try {
    const supabase = await createClient();

    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return redirectToApp(request, "/?google=error");
    }

    // Fetch the user from Supabase Auth after exchanging the OAuth code.
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return redirectToApp(request, "/?google=error");
    }

    // This mirrors the authoritative completion check in the existing
    // onboarding-status endpoint, using this request's authenticated client.
    const { data: profile, error: profileError } = await supabase
      .from("customer_profiles")
      .select("onboarding_completed_at")
      .eq("user_id", user.id)
      .maybeSingle();

    // Keep the customer on the account page if profile status cannot be read.
    // The account page can then show its existing loading/error state.
    if (profileError) {
      return redirectToApp(request, "/account");
    }

    const onboardingCompleted = Boolean(profile?.onboarding_completed_at);

    return redirectToApp(
      request,
      onboardingCompleted ? "/" : "/account"
    );
  } catch {
    // Do not log or reveal provider errors, codes, or session details.
    return redirectToApp(request, "/?google=error");
  }
}