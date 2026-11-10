import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      Vary: "Cookie",
    },
  });
}

function unauthenticatedResponse() {
  return jsonResponse(
    {
      authenticated: false,
      profileFound: false,
      hasFullName: false,
      emailVerified: false,
      phoneVerified: false,
      onboardingCompleted: false,
    },
    401
  );
}

export async function GET() {
  let supabase;

  try {
    supabase = await createClient();
  } catch {
    return jsonResponse(
      { error: "Authentication is temporarily unavailable." },
      503
    );
  }

  let user;

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      if (error.name === "AuthSessionMissingError" || error.status === 401) {
        return unauthenticatedResponse();
      }

      return jsonResponse(
        { error: "Authentication could not be checked." },
        503
      );
    }

    user = data?.user;

    if (!user) {
      return unauthenticatedResponse();
    }
  } catch {
    return jsonResponse(
      { error: "Authentication could not be checked." },
      503
    );
  }

  const emailVerified = Boolean(user.email_confirmed_at);
  const phoneVerified = Boolean(user.phone_confirmed_at);

  try {
    const { data: profile, error } = await supabase
      .from("customer_profiles")
      .select("full_name, onboarding_completed_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      return jsonResponse(
        { authenticated: true, error: "Onboarding status could not be loaded." },
        503
      );
    }

    const hasFullName =
      typeof profile?.full_name === "string" &&
      profile.full_name.trim().length > 0;

    return jsonResponse({
      authenticated: true,
      profileFound: Boolean(profile),
      hasFullName,
      emailVerified,
      phoneVerified,
      onboardingCompleted:
  Boolean(profile?.onboarding_completed_at) &&
  emailVerified &&
  phoneVerified,
    });
  } catch {
    return jsonResponse(
      { authenticated: true, error: "Onboarding status could not be loaded." },
      503
    );
  }
}