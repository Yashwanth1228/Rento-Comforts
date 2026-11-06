import { createBrowserClient} from "@supabase/ssr";

export function createClient(){
    const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if(!supabaseURL || !supabasePublishableKey){
        throw new Error("Supabase URL and publishable key must be set in .env.local.");
    }

    return createBrowserClient(supabaseURL, supabasePublishableKey)
}