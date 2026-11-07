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

function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

function isSameOrigin(request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return false;
  }

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

async function getAuthenticatedClient() {
  let supabase;

  try {
    supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims?.sub) {
      return {
        response: jsonResponse(
          { ok: false, message: "Sign in is required." },
          401
        ),
      };
    }

    return {
      supabase,
      userId: data.claims.sub,
    };
  } catch {
    return {
      response: jsonResponse(
        { ok: false, message: "Authentication could not be checked." },
        503
      ),
    };
  }
}

export async function GET() {
  if (!isDevelopment()) {
    return new Response(null, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const auth = await getAuthenticatedClient();

  if (auth.response) {
    return auth.response;
  }

  try {
    const { data: profile, error } = await auth.supabase
      .from("customer_profiles")
      .select("full_name, onboarding_completed_at, updated_at")
      .eq("user_id", auth.userId)
      .maybeSingle();

    if (error) {
      return jsonResponse(
        { ok: false, message: "The profile could not be read." },
        503
      );
    }

    return jsonResponse({
      ok: true,
      authenticated: true,
      profileFound: Boolean(profile),
      fullName: profile?.full_name ?? null,
      onboardingCompleted: Boolean(profile?.onboarding_completed_at),
      updatedAt: profile?.updated_at ?? null,
    });
  } catch {
    return jsonResponse(
      { ok: false, message: "The profile could not be read." },
      503
    );
  }
}

export async function POST(request) {
  if (!isDevelopment()) {
    return new Response(null, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (!isSameOrigin(request)) {
    return jsonResponse(
      { ok: false, message: "This request is not allowed." },
      403
    );
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse(
      { ok: false, message: "Send the name as JSON." },
      415
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { ok: false, message: "The request body must be valid JSON." },
      400
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    Object.keys(body).length !== 1 ||
    !Object.hasOwn(body, "full_name") ||
    typeof body.full_name !== "string"
  ) {
    return jsonResponse(
      { ok: false, message: "Provide only a full_name string." },
      400
    );
  }

  const fullName = body.full_name.trim();
  const nameLength = Array.from(fullName).length;

  if (nameLength < 1 || nameLength > 100) {
    return jsonResponse(
      {
        ok: false,
        message: "Name must contain between 1 and 100 characters.",
      },
      400
    );
  }

  const auth = await getAuthenticatedClient();

  if (auth.response) {
    return auth.response;
  }

  try {
    const { data: profile, error } = await auth.supabase
      .from("customer_profiles")
      .update({ full_name: fullName })
      .eq("user_id", auth.userId)
      .is("onboarding_completed_at", null)
      .select("full_name, updated_at")
      .maybeSingle();

    if (error) {
      return jsonResponse(
        { ok: false, message: "The profile could not be updated." },
        503
      );
    }

    if (!profile) {
      return jsonResponse(
        {
          ok: false,
          message:
            "No incomplete profile was updated. It may be missing or already complete.",
        },
        409
      );
    }

    return jsonResponse({
      ok: true,
      message: "The profile name was updated.",
      fullName: profile.full_name,
      updatedAt: profile.updated_at,
    });
  } catch {
    return jsonResponse(
      { ok: false, message: "The profile could not be updated." },
      503
    );
  }
}