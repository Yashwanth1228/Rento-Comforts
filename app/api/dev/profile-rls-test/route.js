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
    return jsonResponse(
      { authenticated: false, error: "Authentication is unavailable." },
      503
    );
  }

  let userId;

  try {
    const { data, error } = await supabase.auth.getClaims();

    if (error) {
      if (error.name === "AuthSessionMissingError") {
        return jsonResponse(
          { authenticated: false, error: "Sign in is required." },
          401
        );
      }

      return jsonResponse(
        { authenticated: false, error: "Authentication could not be checked." },
        503
      );
    }

    userId = data?.claims?.sub;

    if (typeof userId !== "string" || userId.length === 0) {
      return jsonResponse(
        { authenticated: false, error: "Sign in is required." },
        401
      );
    }
  } catch {
    return jsonResponse(
      { authenticated: false, error: "Authentication could not be checked." },
      503
    );
  }

  try {
    // No user_id filter: the database RLS policy must restrict visible rows.
    const { data: profiles, error } = await supabase
      .from("customer_profiles")
      .select("user_id");

    if (error) {
      return jsonResponse(
        {
          authenticated: true,
          visibleProfileCount: 0,
          onlyOwnProfileVisible: false,
          rlsReadCheckPassed: false,
          error: "The profile access check could not be completed.",
        },
        503
      );
    }

    const rows = profiles ?? [];
    const onlyOwnProfileVisible =
      rows.length === 1 && rows.every((profile) => profile.user_id === userId);

    return jsonResponse({
      authenticated: true,
      visibleProfileCount: rows.length,
      onlyOwnProfileVisible,
      rlsReadCheckPassed: onlyOwnProfileVisible,
    });
  } catch {
    return jsonResponse(
      {
        authenticated: true,
        visibleProfileCount: 0,
        onlyOwnProfileVisible: false,
        rlsReadCheckPassed: false,
        error: "The profile access check could not be completed.",
      },
      503
    );
  }
}