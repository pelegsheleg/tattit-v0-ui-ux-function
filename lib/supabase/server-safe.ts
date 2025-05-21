/**
 * Safe version of Supabase server utilities that don't use next/headers
 * This file is safe to import in pages/ directory
 */

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a Supabase client using environment variables
export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Create a service client for admin operations
export function getSupabaseServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}

// Create an action client for server actions
export function getSupabaseActionClient() {
  return getSupabaseServerClient()
}
