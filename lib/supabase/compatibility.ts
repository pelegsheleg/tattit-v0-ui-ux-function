/**
 * Compatibility layer for Supabase
 * This ensures it works in both app/ and pages/ directories
 */

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a client that works in both app/ and pages/ directories
export function createCompatibilityClient() {
  try {
    // Try to create a client component client first (for app/ directory)
    return createClientComponentClient<Database>()
  } catch (error) {
    // If that fails, create a regular client (for pages/ directory)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    return createClient<Database>(supabaseUrl, supabaseKey)
  }
}

// Export a singleton instance
export const supabaseCompatibility = createCompatibilityClient()
