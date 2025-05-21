"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

interface TableColumn {
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
}

interface TableInfo {
  exists: boolean
  columns?: TableColumn[]
  error?: string
}

interface SchemaCheckResult {
  success: boolean
  tables: Record<string, TableInfo>
  mismatches: string[]
  error?: string
}

// Expected table schemas based on your application code
const expectedTables = {
  users: ["id", "email", "full_name", "phone", "user_role", "created_at", "updated_at"],
  artist_profiles: [
    "id",
    "years_experience",
    "specialties",
    "is_mobile_artist",
    "style_tags",
    "created_at",
    "updated_at",
  ],
  artist_profile: [
    "id",
    "years_experience",
    "specialties",
    "is_mobile_artist",
    "style_tags",
    "created_at",
    "updated_at",
  ],
  client_preferences: ["id", "preferred_styles", "search_radius", "preferred_experience", "created_at", "updated_at"],
  artist_portfolio: ["id", "artist_id", "image_url", "title", "description", "style_tags", "created_at", "updated_at"],
  portfolio_images: ["id", "artist_id", "image_url", "title", "description", "style_tags", "created_at", "updated_at"],
}

export async function checkDatabaseSchema(): Promise<SchemaCheckResult> {
  const supabase = getSupabaseServerClient()
  const tables: Record<string, TableInfo> = {}
  const mismatches: string[] = []

  try {
    // Get all tables in the public schema
    const { data: allTables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")

    if (tablesError) {
      return {
        success: false,
        tables: {},
        mismatches: [],
        error: `Error fetching tables: ${tablesError.message}`,
      }
    }

    // Initialize all expected tables as not existing
    for (const tableName of Object.keys(expectedTables)) {
      tables[tableName] = { exists: false }
    }

    // Mark tables that do exist
    for (const table of allTables || []) {
      const tableName = table.table_name

      // If it's one of our expected tables, mark it as existing
      if (expectedTables[tableName]) {
        tables[tableName] = { exists: true, columns: [] }
      }
    }

    // For each existing table, get its columns
    for (const tableName of Object.keys(tables)) {
      if (tables[tableName].exists) {
        const { data: columns, error: columnsError } = await supabase
          .from("information_schema.columns")
          .select("column_name, data_type, is_nullable, column_default")
          .eq("table_schema", "public")
          .eq("table_name", tableName)

        if (columnsError) {
          tables[tableName].error = `Error fetching columns: ${columnsError.message}`
          continue
        }

        tables[tableName].columns = columns as TableColumn[]

        // Check if all expected columns exist
        const columnNames = columns.map((col) => col.column_name)
        const missingColumns = expectedTables[tableName].filter((col) => !columnNames.includes(col))

        if (missingColumns.length > 0) {
          mismatches.push(`Table '${tableName}' is missing columns: ${missingColumns.join(", ")}`)
        }
      } else if (tableName !== "artist_profile" && tableName !== "portfolio_images") {
        // Only report as a mismatch if it's not an alternative table name
        mismatches.push(`Table '${tableName}' does not exist in the database`)
      }
    }

    // Special check for artist_profiles vs artist_profile (singular)
    if (!tables.artist_profiles.exists && !tables.artist_profile.exists) {
      mismatches.push("Neither 'artist_profiles' nor 'artist_profile' table exists")
    }

    // Special check for artist_portfolio vs portfolio_images
    if (!tables.artist_portfolio.exists && !tables.portfolio_images.exists) {
      mismatches.push("Neither 'artist_portfolio' nor 'portfolio_images' table exists")
    }

    return {
      success: true,
      tables,
      mismatches,
    }
  } catch (error) {
    console.error("Error in checkDatabaseSchema:", error)
    return {
      success: false,
      tables: {},
      mismatches: [],
      error: error instanceof Error ? error.message : "Unknown error checking database schema",
    }
  }
}

// Function to check for users without corresponding profiles
export async function checkMissingProfiles() {
  const supabase = getSupabaseServerClient()

  try {
    // First determine which artist profile table exists
    const { data: schemaCheck } = await checkDatabaseSchema()
    const artistProfileTable = schemaCheck?.tables.artist_profiles.exists
      ? "artist_profiles"
      : schemaCheck?.tables.artist_profile.exists
        ? "artist_profile"
        : null

    if (!artistProfileTable) {
      return {
        success: false,
        error: "No artist profile table found in the database",
      }
    }

    // Get all users with artist role
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
        message: "No artist users found in the database",
        missingProfiles: [],
      }
    }

    // For each artist, check if they have a profile
    const missingProfiles = []

    for (const artist of artists) {
      const { data: profile, error: profileError } = await supabase
        .from(artistProfileTable)
        .select("id")
        .eq("id", artist.id)
        .single()

      if (profileError || !profile) {
        missingProfiles.push({
          id: artist.id,
          email: artist.email,
          name: artist.full_name,
        })
      }
    }

    return {
      success: true,
      message: `Found ${missingProfiles.length} artists without profiles`,
      missingProfiles,
      artistProfileTable,
    }
  } catch (error) {
    console.error("Error in checkMissingProfiles:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error checking missing profiles",
    }
  }
}

// Function to fix missing profiles
export async function fixMissingProfiles() {
  const supabase = getSupabaseServerClient()

  try {
    const { success, missingProfiles, artistProfileTable, error } = await checkMissingProfiles()

    if (!success || !artistProfileTable) {
      return {
        success: false,
        error: error || "Failed to check for missing profiles",
      }
    }

    if (!missingProfiles || missingProfiles.length === 0) {
      return {
        success: true,
        message: "No missing profiles found",
        results: [],
      }
    }

    const results = []

    for (const artist of missingProfiles) {
      try {
        const { error: insertError } = await supabase.from(artistProfileTable).insert({
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
            user_id: artist.id,
            email: artist.email,
            success: false,
            error: insertError.message,
          })
        } else {
          results.push({
            user_id: artist.id,
            email: artist.email,
            success: true,
          })
        }
      } catch (err) {
        results.push({
          user_id: artist.id,
          email: artist.email,
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        })
      }
    }

    const successCount = results.filter((r) => r.success).length

    return {
      success: true,
      message: `Fixed ${successCount} out of ${missingProfiles.length} missing profiles`,
      results,
      artistProfileTable,
    }
  } catch (error) {
    console.error("Error in fixMissingProfiles:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error fixing missing profiles",
    }
  }
}
