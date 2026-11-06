export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(
      { ok: false, message: "Not found." },
      { status: 404 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!supabaseUrl || !publishableKey) {
    return Response.json(
      {
        ok: false,
        message: "Supabase connection settings are missing.",
      },
      { status: 500 }
    );
  }

  let healthEndpoint;

  try {
    const projectUrl = new URL(supabaseUrl);
    const isSecure = projectUrl.protocol === "https:";
    const isLocalDevelopment =
      projectUrl.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(projectUrl.hostname);

    if (
      (!isSecure && !isLocalDevelopment) ||
      projectUrl.username ||
      projectUrl.password
    ) {
      return Response.json(
        {
          ok: false,
          message: "The Supabase project URL is invalid.",
        },
        { status: 500 }
      );
    }

    healthEndpoint = new URL("/auth/v1/health", projectUrl.origin);
  } catch {
    return Response.json(
      {
        ok: false,
        message: "The Supabase project URL is invalid.",
      },
      { status: 500 }
    );
  }

  try {
    const upstreamResponse = await fetch(healthEndpoint, {
      method: "GET",
      headers: {
        apikey: publishableKey,
        accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!upstreamResponse.ok) {
      return Response.json(
        {
          ok: false,
          message: "Supabase Auth returned an unsuccessful response.",
          upstreamStatus: upstreamResponse.status,
        },
        { status: 502 }
      );
    }

    return Response.json(
      {
        ok: true,
        message: "Supabase Auth health endpoint responded successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    const timedOut =
      error?.name === "TimeoutError" || error?.name === "AbortError";

    return Response.json(
      {
        ok: false,
        message: timedOut
          ? "Supabase Auth did not respond before the timeout."
          : "The Next.js server could not reach Supabase Auth.",
      },
      { status: timedOut ? 503 : 502 }
    );
  }
}