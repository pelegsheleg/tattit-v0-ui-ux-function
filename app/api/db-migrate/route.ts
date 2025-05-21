import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Get admin client for database migrations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, error: "Supabase URL or service role key is missing" },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if artist_profile table exists
    const { data: artistProfileExists, error: checkError } = await supabase.from("artist_profile").select("id").limit(1)

    // If artist_profile doesn't exist, create it
    if (checkError && checkError.message.includes("does not exist")) {
      const { error: createError } = await supabase.rpc("create_artist_profile_table")

      if (createError) {
        console.error("Error creating artist_profile table:", createError)
        return NextResponse.json({ success: false, error: createError.message }, { status: 500 })
      }

      console.log("Created artist_profile table")
    }

    // Check if artist_profiles table exists (plural form)
    const { data: artistProfilesExists, error: checkPluralError } = await supabase
      .from("artist_profiles")
      .select("id")
      .limit(1)

    // If both tables exist, migrate data from artist_profiles to artist_profile
    if (artistProfileExists && artistProfilesExists) {
      const { error: migrateError } = await supabase.rpc("migrate_artist_profiles_data")

      if (migrateError) {
        console.error("Error migrating data:", migrateError)
        return NextResponse.json({ success: false, error: migrateError.message }, { status: 500 })
      }

      console.log("Migrated data from artist_profiles to artist_profile")
    }

    // Add missing columns to portfolio_images table
    const { error: alterError } = await supabase.rpc("add_missing_columns_to_portfolio_images")

    if (alterError) {
      console.error("Error adding missing columns:", alterError)
      return NextResponse.json({ success: false, error: alterError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Database migration completed successfully" })
  } catch (error) {
    console.error("Error in database migration:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
