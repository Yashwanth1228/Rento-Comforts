import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4096;

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      Vary: "Cookie",
    },
  });
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

async function authenticateRequest() {
  let supabase;

  try {
    supabase = await createClient();
  } catch {
    return {
      response: jsonResponse(
        { ok: false, message: "Authentication is temporarily unavailable." },
        503
      ),
    };
  }

  try {
    const { data, error } = await supabase.auth.getClaims();

    if (error) {
      if (error.name === "AuthSessionMissingError") {
        return {
          response: jsonResponse(
            { ok: false, message: "Sign in is required." },
            401
          ),
        };
      }

      return {
        response: jsonResponse(
          { ok: false, message: "Authentication could not be checked." },
          503
        ),
      };
    }

    const userId = data?.claims?.sub;

    if (typeof userId !== "string" || userId.length === 0) {
      return {
        response: jsonResponse(
          { ok: false, message: "Sign in is required." },
          401
        ),
      };
    }

    return { supabase, userId };
  } catch {
    return {
      response: jsonResponse(
        { ok: false, message: "Authentication could not be checked." },
        503
      ),
    };
  }
}

async function readLimitedJson(request) {
  const contentLength = request.headers.get("content-length");

  if (contentLength !== null) {
    const declaredLength = Number(contentLength);

    if (!Number.isSafeInteger(declaredLength) || declaredLength < 0) {
      return { errorStatus: 400 };
    }

    if (declaredLength > MAX_BODY_BYTES) {
      return { errorStatus: 413 };
    }
  }

  if (!request.body) {
    return { errorStatus: 400 };
  }

  const reader = request.body.getReader();
  const chunks = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      totalBytes += value.byteLength;

      if (totalBytes > MAX_BODY_BYTES) {
        try {
          await reader.cancel();
        } catch {
          // The request is already being rejected.
        }

        return { errorStatus: 413 };
      }

      chunks.push(value);
    }
  } catch {
    return { errorStatus: 400 };
  }

  const bodyBytes = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const bodyText = new TextDecoder("utf-8", { fatal: true }).decode(bodyBytes);
    return { body: JSON.parse(bodyText) };
  } catch {
    return { errorStatus: 400 };
  }
}

function isOnlyFullNameField(body) {
  return (
    body !== null &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    Object.keys(body).length === 1 &&
    Object.prototype.hasOwnProperty.call(body, "full_name") &&
    typeof body.full_name === "string"
  );
}

export async function GET() {
  const auth = await authenticateRequest();

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
        { ok: false, message: "The profile could not be loaded." },
        503
      );
    }

    if (!profile) {
      return jsonResponse(
        { ok: false, message: "Customer profile was not found." },
        404
      );
    }

    return jsonResponse({
      ok: true,
      profile: {
        full_name: profile.full_name,
        onboardingCompleted: Boolean(profile.onboarding_completed_at),
        updated_at: profile.updated_at,
      },
    });
  } catch {
    return jsonResponse(
      { ok: false, message: "The profile could not be loaded." },
      503
    );
  }
}

export async function PATCH(request) {
  if (!isSameOrigin(request)) {
    return jsonResponse(
      { ok: false, message: "This request is not allowed." },
      403
    );
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.split(";")[0].trim().toLowerCase() !== "application/json") {
    return jsonResponse(
      { ok: false, message: "Send the profile name as JSON." },
      415
    );
  }

  const parsedBody = await readLimitedJson(request);

  if (parsedBody.errorStatus === 413) {
    return jsonResponse(
      { ok: false, message: "The request is too large." },
      413
    );
  }

  if (parsedBody.errorStatus || !isOnlyFullNameField(parsedBody.body)) {
    return jsonResponse(
      { ok: false, message: "Provide only a full_name string." },
      400
    );
  }

  const fullName = parsedBody.body.full_name.trim();
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

  const auth = await authenticateRequest();

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
            "An incomplete profile was not found or could not be updated.",
        },
        409
      );
    }

    return jsonResponse({
      ok: true,
      message: "Profile name updated.",
      profile: {
        full_name: profile.full_name,
        updated_at: profile.updated_at,
      },
    });
  } catch {
    return jsonResponse(
      { ok: false, message: "The profile could not be updated." },
      503
    );
  }
}