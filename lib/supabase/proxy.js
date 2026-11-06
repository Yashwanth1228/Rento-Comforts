import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request){
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabasePublishableKey =process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if(!supabaseUrl || !supabasePublishableKey){
        throw new Error("Supabase URL and publishable key must be set in .env.local.");
    }

    let supabaseResponse = NextResponse.next({request});

    const supabase = createServerClient(supabaseUrl,supabasePublishableKey,{
        cookies:{
            getAll(){
                return request.cookies.getAll();
            },

            setAll(cookiesToSet){
                cookiesToSet.forEach(({ name, value}) =>{
                    request.cookies.set(name,value)
                });

                const previousResponse = supabaseResponse;
                const nextResponse = NextResponse.next({
                request,
                });

                for (const header of ["cache-control", "expires", "pragma"]) {
            const value = previousResponse.headers.get(header);

            if (value) {
              nextResponse.headers.set(header, value);
            }
          }

          supabaseResponse = nextResponse;

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });

            }
        }
    })

    await supabase.auth.getClaims();

    return supabaseResponse;


}