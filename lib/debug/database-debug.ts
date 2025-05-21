"use server"

import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"
import type { Database } from "@/types/supabase"

// Create a Supabase client with the service role key for admin operations
const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL or service role key is missing")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}

// Check if the database connection is working
export async function checkDatabaseConnection() {
  try {
    const supabase = getAdminClient()

    // Try a simple query to check connection
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      console.error("Database connection error:", error)
      return {
        success: false,
        message: `Failed to connect to database: ${error.message}`,
      }
    }

    return {
      success: true,
      message: "Successfully connected to the database",
    }
  } catch (error) {
    console.error("Unexpected error checking database connection:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error checking database connection",
    }
  }
}

// List all tables in the database
export async function listTables() {
  try {
    const supabase = getAdminClient()

    // Query the information_schema to get all tables
    const { data, error } = await supabase.rpc("get_tables")

    if (error) {
      console.error("Error listing tables:", error)
      throw new Error(`Failed to list tables: ${error.message}`)
    }

    return data as string[]
  } catch (error) {
    console.error("Unexpected error listing tables:", error)
    throw error
  }
}

// Get data from a specific table
export async function getTableData(tableName: string) {
  try {
    const supabase = getAdminClient()

    // Get all rows from the table
    const { data, error } = await supabase.from(tableName).select("*").limit(100)

    if (error) {
      console.error(`Error getting data from table ${tableName}:`, error)
      throw new Error(`Failed to get data from table ${tableName}: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error(`Unexpected error getting data from table ${tableName}:`, error)
    throw error
  }
}

// Get schema information for a table
export async function getTableSchema(tableName: string) {
  try {
    const supabase = getAdminClient()

    // Query the information_schema to get column information
    const { data, error } = await supabase.rpc("get_table_schema", { table_name: tableName })

    if (error) {
      console.error(`Error getting schema for table ${tableName}:`, error)
      throw new Error(`Failed to get schema for table ${tableName}: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error(`Unexpected error getting schema for table ${tableName}:`, error)
    throw error
  }
}

// Create a test artist directly in the database
export async function createTestArtist() {
  try {
    const supabase = getAdminClient()
    const details: Record<string, any> = {}

    // Generate a unique ID and email
    const userId = uuidv4()
    const timestamp = new Date().getTime()
    const email = `test-artist-${timestamp}@example.com`

    console.log(`Creating test artist with ID ${userId} and email ${email}`)
    details.userId = userId
    details.email = email

    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: "password123",
      email_confirm: true,
      user_metadata: {
        full_name: `Test Artist ${timestamp}`,
        user_role: "artist",
      },
    })

    if (authError) {
      console.error("Error creating auth user:", authError)
      return { success: false, error: `Failed to create auth user: ${authError.message}` }
    }

    if (!authData.user) {
      console.error("No user returned from auth signup")
      return { success: false, error: "Failed to create auth user: No user returned" }
    }

    const actualUserId = authData.user.id
    details.actualUserId = actualUserId
    console.log(`Auth user created with ID ${actualUserId}`)

    // Step 2: Create user record
    const { error: userError } = await supabase.from("users").insert({
      id: actualUserId,
      email,
      full_name: `Test Artist ${timestamp}`,
      phone: "1234567890",
      user_role: "artist",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (userError) {
      console.error("Error creating user record:", userError)
      // Clean up auth user
      await supabase.auth.admin.deleteUser(actualUserId)
      return { success: false, error: `Failed to create user record: ${userError.message}` }
    }

    console.log("User record created in users table")
    details.userCreated = true

    // Step 3: Create user role
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: actualUserId,
      role: "artist",
      created_at: new Date().toISOString(),
    })

    if (roleError) {
      console.error("Error creating user role:", roleError)
      details.roleError = roleError.message
      // Continue anyway, this is not critical
    } else {
      console.log("User role created")
      details.roleCreated = true
    }

    // Step 4: Create artist profile - FIXED TABLE NAME
    const { error: profileError } = await supabase.from("artist_profile").insert({
      id: actualUserId,
      bio: "This is a test artist bio created for debugging purposes.",
      years_experience: 5,
      specialties: ["Realism", "Black and Gray"],
      personal_brand_statement: "Creating unique art for unique people",
      studio_name: "Test Studio",
      location: "New York, NY",
      is_mobile_artist: false,
      style_tags: ["Realism", "Black and Gray"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("Error creating artist profile:", profileError)
      // Clean up what we've created
      await supabase.from("user_roles").delete().eq("user_id", actualUserId)
      await supabase.from("users").delete().eq("id", actualUserId)
      await supabase.auth.admin.deleteUser(actualUserId)
      return { success: false, error: `Failed to create artist profile: ${profileError.message}` }
    }

    console.log("Artist profile created")
    details.profileCreated = true

    // Verify everything was created correctly
    const verifyUser = await supabase.from("users").select("*").eq("id", actualUserId).single()
    details.userVerified = !verifyUser.error

    const verifyProfile = await supabase.from("artist_profile").select("*").eq("id", actualUserId).single()
    details.profileVerified = !verifyProfile.error

    return {
      success: true,
      userId: actualUserId,
      details,
    }
  } catch (error) {
    console.error("Unexpected error creating test artist:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error creating test artist",
    }
  }
}
