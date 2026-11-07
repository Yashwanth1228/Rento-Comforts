import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      Vary: "Cookie",
    },
  });
}

function emptyResult(authenticated, accessCheckPassed, status) {
  return jsonResponse(
    {
      authenticated,
      profileFound: false,
      onboardingCompleted: false,
      accessCheckPassed,
    },
    status
  );
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  let supabase;

  try {
    supabase = await createClient();
  } catch {
    return emptyResult(false, false, 503);
  }

  let claims;

  try {
    const result = await supabase.auth.getClaims();

    if (result.error || !result.data?.claims?.sub) {
      return emptyResult(false, false, 401);
    }

    claims = result.data.claims;
  } catch {
    return emptyResult(false, false, 503);
  }

  try {
    // Intentionally no user_id filter: RLS must restrict these rows.
    const { data: profiles, error } = await supabase
      .from("customer_profiles")
      .select("user_id, onboarding_completed_at");

    if (error) {
      return emptyResult(true, false, 503);
    }

    const rows = profiles ?? [];
    const accessCheckPassed = rows.every(
      (profile) => profile.user_id === claims.sub
    );

    if (!accessCheckPassed) {
      return emptyResult(true, false, 500);
    }

    const ownProfile = rows.find(
      (profile) => profile.user_id === claims.sub
    );

    return jsonResponse({
      authenticated: true,
      profileFound: Boolean(ownProfile),
      onboardingCompleted: Boolean(
        ownProfile?.onboarding_completed_at
      ),
      accessCheckPassed: true,
    });
  } catch {
    return emptyResult(true, false, 503);
  }
}