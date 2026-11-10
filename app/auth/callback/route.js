import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function getTrustedAppOrigin() {
  const configuredBaseUrl = process.env.APP_BASE_URL;

  if (!configuredBaseUrl) {
    return null;
  }

  try {
    const configuredUrl = new URL(configuredBaseUrl);

    const isOriginOnly =
      configuredUrl.pathname === "/" &&
      !configuredUrl.search &&
      !configuredUrl.hash &&
      !configuredUrl.username &&
      !configuredUrl.password;

    const isHttpProtocol =
      configuredUrl.protocol === "http:" ||
      configuredUrl.protocol === "https:";

    const isLocalHost =
      configuredUrl.hostname === "localhost" ||
      configuredUrl.hostname.endsWith(".localhost") ||
      configuredUrl.hostname === "127.0.0.1" ||
      configuredUrl.hostname === "[::1]";

    if (!isOriginOnly || !isHttpProtocol) {
      return null;
    }

    if (
      process.env.NODE_ENV === "production" &&
      (configuredUrl.protocol !== "https:" || isLocalHost)
    ) {
      return null;
    }

    return configuredUrl.origin;
  } catch {
    return null;
  }
}

function redirectToTrustedApp(appOrigin, path) {
  const response = NextResponse.redirect(new URL(path, `${appOrigin}/`));

  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Referrer-Policy", "no-referrer");

  return response;
}

function configurationError() {
  return new Response("Authentication callback is not configured.", {
    status: 500,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Referrer-Policy": "no-referrer",
    },
  });
}

function originError() {
  return new Response("Authentication callback origin is not allowed.", {
    status: 400,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export async function GET(request) {
  const appOrigin = getTrustedAppOrigin();

  if (!appOrigin) {
    return configurationError();
  }

  let requestOrigin;

  try {
    requestOrigin = new URL(request.url).origin;
  } catch {
    return originError();
  }

  // The request origin is checked, but never used as the redirect destination.
  if (requestOrigin !== appOrigin) {
    return originError();
  }

  const callbackUrl = new URL(request.url);
  const code = callbackUrl.searchParams.get("code");
  const providerError = callbackUrl.searchParams.get("error");

  if (providerError || !code) {
    const result =
      providerError === "access_denied" ? "cancelled" : "error";

    return redirectToTrustedApp(appOrigin, `/?google=${result}`);
  }

  try {
    const supabase = await createClient();

    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return redirectToTrustedApp(appOrigin, "/?google=error");
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return redirectToTrustedApp(appOrigin, "/?google=error");
    }

    const { data: profile, error: profileError } = await supabase
      .from("customer_profiles")
      .select("onboarding_completed_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      return redirectToTrustedApp(appOrigin, "/account");
    }

    const emailVerified = Boolean(user.email_confirmed_at);
    const phoneVerified = Boolean(user.phone_confirmed_at);

    const onboardingCompleted =
      Boolean(profile?.onboarding_completed_at) &&
      emailVerified &&
      phoneVerified;

    return redirectToTrustedApp(
      appOrigin,
      onboardingCompleted ? "/" : "/account"
    );
  } catch {
    // Do not log or expose OAuth codes, tokens, cookies, or provider errors.
    return redirectToTrustedApp(appOrigin, "/?google=error");
  }
}