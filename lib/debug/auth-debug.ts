"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"

export async function debugAuthAndProfiles() {
  const supabase = getSupabaseServerClient()
  const results: Record<string, any> = {}

  try {
    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    results.current_session = {
      data: session
        ? {
            user_id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata,
            expires_at: new Date(session.expires_at * 1000).toISOString(),
          }
        : "No active session",
      error: sessionError?.message,
    }

    // Check which tables exist
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", ["users", "artist_profiles", "artist_profile"])

    const tableNames = tables?.map((t) => t.table_name) || []

    results.available_tables = {
      data: tableNames,
      error: tablesError?.message,
    }

    // Determine which artist profile table to use
    const artistProfileTable = tableNames.includes("artist_profiles")
      ? "artist_profiles"
      : tableNames.includes("artist_profile")
        ? "artist_profile"
        : null

    if (!artistProfileTable) {
      results.artist_profile_table = {
        note: "No artist profile table found in the database",
      }
    } else {
      results.artist_profile_table = {
        data: artistProfileTable,
      }
    }

    // Check users table
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, full_name, email, user_role, created_at")
      .order("created_at", { ascending: false })
      .limit(10)

    results.users = {
      data: users,
      error: usersError?.message,
    }

    // Check artist users
    const { data: artistUsers, error: artistUsersError } = await supabase
      .from("users")
      .select("id, full_name, email, created_at")
      .eq("user_role", "artist")
      .order("created_at", { ascending: false })

    results.artist_users = {
      data: artistUsers,
      error: artistUsersError?.message,
    }

    // If we have an artist profile table, check profiles
    if (artistProfileTable) {
      const { data: artistProfiles, error: artistProfilesError } = await supabase
        .from(artistProfileTable)
        .select("*")
        .limit(10)

      results.artist_profiles = {
        data: artistProfiles,
        error: artistProfilesError?.message,
      }

      // Check for missing profiles
      if (artistUsers && artistUsers.length > 0) {
        const artistIds = artistUsers.map((user) => user.id)

        const { data: existingProfiles, error: existingProfilesError } = await supabase
          .from(artistProfileTable)
          .select("id")
          .in("id", artistIds)

        const existingProfileIds = existingProfiles?.map((profile) => profile.id) || []
        const missingProfileIds = artistIds.filter((id) => !existingProfileIds.includes(id))

        const missingProfiles = artistUsers
          .filter((user) => missingProfileIds.includes(user.id))
          .map((user) => ({
            id: user.id,
            email: user.email,
            name: user.full_name,
          }))

        results.missing_profiles = {
          data: missingProfiles,
          note:
            missingProfiles.length > 0
              ? `Found ${missingProfiles.length} artists without profiles`
              : "All artists have profiles",
        }
      }
    }

    return { success: true, results }
  } catch (error) {
    console.error("Error in debugAuthAndProfiles:", error)
    return { success: false, error: "Failed to debug auth and profiles" }
  }
}

export async function createTestArtistProfile(userId: string) {
  const supabase = createServerActionClient({ cookies })

  try {
    // First check if the user exists and is an artist
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, user_role")
      .eq("id", userId)
      .single()

    if (userError) {
      return {
        success: false,
        error: `User not found: ${userError.message}`,
      }
    }

    if (user.user_role !== "artist") {
      return {
        success: false,
        error: `User ${user.email} is not an artist (role: ${user.user_role})`,
      }
    }

    // Check which table exists
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", ["artist_profiles", "artist_profile"])

    if (tablesError) {
      return {
        success: false,
        error: `Error checking tables: ${tablesError.message}`,
      }
    }

    const tableNames = tables?.map((t) => t.table_name) || []
    const artistProfileTable = tableNames.includes("artist_profiles")
      ? "artist_profiles"
      : tableNames.includes("artist_profile")
        ? "artist_profile"
        : null

    if (!artistProfileTable) {
      return {
        success: false,
        error: "No artist profile table found in the database",
      }
    }

    // Check if profile already exists
    const { data: existingProfile, error: existingProfileError } = await supabase
      .from(artistProfileTable)
      .select("id")
      .eq("id", userId)
      .single()

    if (existingProfile) {
      return {
        success: false,
        error: `Artist profile already exists for user ${user.email}`,
      }
    }

    // Create the artist profile
    const { error: insertError } = await supabase.from(artistProfileTable).insert({
      id: userId,
      years_experience: 0,
      specialties: [],
      is_mobile_artist: false,
      style_tags: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      return {
        success: false,
        error: `Error creating artist profile: ${insertError.message}`,
      }
    }

    return {
      success: true,
      message: `Created artist profile for user ${user.email}`,
      table: artistProfileTable,
    }
  } catch (error) {
    console.error("Error in createTestArtistProfile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error creating artist profile",
    }
  }
}

export async function fixMissingArtistProfiles() {
  const supabase = createServerActionClient({ cookies })

  try {
    // Check which table exists
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", ["artist_profiles", "artist_profile"])

    if (tablesError) {
      return {
        success: false,
        error: `Error checking tables: ${tablesError.message}`,
      }
    }

    const tableNames = tables?.map((t) => t.table_name) || []
    const artistProfileTable = tableNames.includes("artist_profiles")
      ? "artist_profiles"
      : tableNames.includes("artist_profile")
        ? "artist_profile"
        : null

    if (!artistProfileTable) {
      return {
        success: false,
        error: "No artist profile table found in the database",
      }
    }

    // Get all artist users
    const { data: artistUsers, error: artistUsersError } = await supabase
      .from("users")
      .select("id, email, full_name")
      .eq("user_role", "artist")

    if (artistUsersError) {
      return {
        success: false,
        error: `Error fetching artist users: ${artistUsersError.message}`,
      }
    }

    if (!artistUsers || artistUsers.length === 0) {
      return {
        success: true,
        message: "No artist users found in the database",
        results: [],
      }
    }

    // Get existing profiles
    const artistIds = artistUsers.map((user) => user.id)

    const { data: existingProfiles, error: existingProfilesError } = await supabase
      .from(artistProfileTable)
      .select("id")
      .in("id", artistIds)

    if (existingProfilesError) {
      return {
        success: false,
        error: `Error fetching existing profiles: ${existingProfilesError.message}`,
      }
    }

    const existingProfileIds = existingProfiles?.map((profile) => profile.id) || []
    const missingProfileUsers = artistUsers.filter((user) => !existingProfileIds.includes(user.id))

    if (missingProfileUsers.length === 0) {
      return {
        success: true,
        message: "All artists already have profiles",
        results: [],
      }
    }

    // Create missing profiles
    const results = []

    for (const user of missingProfileUsers) {
      try {
        const { error: insertError } = await supabase.from(artistProfileTable).insert({
          id: user.id,
          years_experience: 0,
          specialties: [],
          is_mobile_artist: false,
          style_tags: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (insertError) {
          results.push({
            user_id: user.id,
            email: user.email,
            success: false,
            error: insertError.message,
          })
        } else {
          results.push({
            user_id: user.id,
            email: user.email,
            success: true,
          })
        }
      } catch (err) {
        results.push({
          user_id: user.id,
          email: user.email,
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        })
      }
    }

    const successCount = results.filter((r) => r.success).length

    return {
      success: true,
      message: `Fixed ${successCount} out of ${missingProfileUsers.length} missing profiles`,
      results,
      table: artistProfileTable,
    }
  } catch (error) {
    console.error("Error in fixMissingArtistProfiles:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error fixing missing profiles",
    }
  }
}
