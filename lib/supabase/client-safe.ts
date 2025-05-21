import { createClient } from "@supabase/supabase-js"

// Create a singleton instance of the Supabase client for client-side use
let supabaseClientSingleton: ReturnType<typeof createClient> | null = null

export function getSupabaseClientSafe() {
  if (!supabaseClientSingleton) {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      throw new Error("getSupabaseClientSafe should only be used in client components")
    }

    // Get the environment variables from the window
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase URL and anon key must be defined")
    }

    supabaseClientSingleton = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }

  return supabaseClientSingleton
}
