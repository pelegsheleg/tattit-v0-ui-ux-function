"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function debugDatabaseTables() {
  const supabase = getSupabaseServerClient()
  const results: Record<string, any> = {}

  try {
    // Get database schema first to see what tables actually exist
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")

    results.database_schema = {
      data: tables?.map((t) => t.table_name),
      error: tablesError?.message,
    }

    // Check users table
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, full_name, email, user_role, created_at")
      .order("created_at", { ascending: false })
      .limit(10)

    results.users = { data: users, error: usersError?.message }

    // Check artist_profiles table
    const { data: artistProfiles, error: artistProfilesError } = await supabase
      .from("artist_profiles")
      .select("*")
      .limit(10)

    results.artist_profiles = { data: artistProfiles, error: artistProfilesError?.message }

    // Try alternative table name artist_profile (singular)
    const { data: artistProfile, error: artistProfileError } = await supabase
      .from("artist_profile")
      .select("*")
      .limit(10)

    results.artist_profile_singular = { data: artistProfile, error: artistProfileError?.message }

    // Check portfolio_images table
    const { data: portfolioImages, error: portfolioError } = await supabase
      .from("portfolio_images")
      .select("*")
      .limit(10)

    results.portfolio_images = { data: portfolioImages, error: portfolioError?.message }

    // Try alternative table name artist_portfolio
    const { data: artistPortfolio, error: artistPortfolioError } = await supabase
      .from("artist_portfolio")
      .select("*")
      .limit(10)

    results.artist_portfolio = { data: artistPortfolio, error: artistPortfolioError?.message }

    // Check client_preferences table
    const { data: clientPreferences, error: clientPreferencesError } = await supabase
      .from("client_preferences")
      .select("*")
      .limit(10)

    results.client_preferences = { data: clientPreferences, error: clientPreferencesError?.message }

    return { success: true, results }
  } catch (error) {
    console.error("Error in debugDatabaseTables:", error)
    return { success: false, error: "Failed to debug database tables" }
  }
}
