import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not found." },
      { status: 404, headers: noStoreHeaders }
    );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();

    if (error) {
      // No session is an expected result for a signed-out visitor.
      if (error.name === "AuthSessionMissingError") {
        return NextResponse.json(
          { authenticated: false },
          { status: 200, headers: noStoreHeaders }
        );
      }

      return NextResponse.json(
        {
          authenticated: false,
          error: "Unable to verify authentication status.",
        },
        { status: 503, headers: noStoreHeaders }
      );
    }

    return NextResponse.json(
      { authenticated: Boolean(data?.claims?.sub) },
      { status: 200, headers: noStoreHeaders }
    );
  } catch {
    return NextResponse.json(
      {
        authenticated: false,
        error: "Unable to check authentication status.",
      },
      { status: 500, headers: noStoreHeaders }
    );
  }
}