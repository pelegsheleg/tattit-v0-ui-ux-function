"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function fixArtistProfiles() {
  const supabase = getSupabaseServerClient()
  const results = []

  try {
    // Get all artist users
    const { data: artists, error: artistsError } = await supabase
      .from("users")
      .select("id, email, full_name")
      .eq("user_role", "artist")

    if (artistsError) {
      return {
        success: false,
        error: `Error fetching artists: ${artistsError.message}`,
      }
    }

    if (!artists || artists.length === 0) {
      return {
        success: true,
        message: "No artist users found",
        results: [],
      }
    }

    console.log(`Found ${artists.length} artists in users table`)

    // For each artist, check if they have a profile
    for (const artist of artists) {
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from("artist_profile_singular")
        .select("id")
        .eq("id", artist.id)
        .maybeSingle()

      if (profileError) {
        results.push({
          id: artist.id,
          email: artist.email,
          name: artist.full_name,
          success: false,
          error: profileError.message,
        })
        continue
      }

      // If profile doesn't exist, create it
      if (!profile) {
        const { error: insertError } = await supabase.from("artist_profile_singular").insert({
          id: artist.id,
          years_experience: 0,
          specialties: [],
          is_mobile_artist: false,
          style_tags: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (insertError) {
          results.push({
            id: artist.id,
            email: artist.email,
            name: artist.full_name,
            success: false,
            error: insertError.message,
          })
        } else {
          results.push({
            id: artist.id,
            email: artist.email,
            name: artist.full_name,
            success: true,
            message: "Created missing profile",
          })
        }
      } else {
        results.push({
          id: artist.id,
          email: artist.email,
          name: artist.full_name,
          success: true,
          message: "Profile already exists",
        })
      }
    }

    const missingCount = results.filter((r) => r.message === "Created missing profile").length
    const existingCount = results.filter((r) => r.message === "Profile already exists").length
    const errorCount = results.filter((r) => !r.success).length

    return {
      success: true,
      message: `Found ${artists.length} artists: ${existingCount} with profiles, ${missingCount} fixed, ${errorCount} errors`,
      results,
    }
  } catch (error) {
    console.error("Error in fixArtistProfiles:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error fixing artist profiles",
    }
  }
}
