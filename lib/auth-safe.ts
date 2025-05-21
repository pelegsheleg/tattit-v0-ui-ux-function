/**
 * Safe version of auth utilities that don't use next/headers
 * This file is safe to import in pages/ directory
 */

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"

// Get the current user without using next/headers
export async function getAuthUser(): Promise<User | null> {
  try {
    // Use the client component client which doesn't rely on next/headers
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      return null
    }

    return data.user
  } catch (error) {
    console.error("Error getting auth user:", error)
    return null
  }
}

// Sign up without using next/headers
export async function signUp({
  email,
  password,
  fullName,
  role,
}: {
  email: string
  password: string
  fullName: string
  role: string
}): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    // Use environment variables directly instead of cookies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return { success: false, error: "Missing Supabase credentials" }
    }

    // Create a service client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create the user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role,
      },
    })

    if (userError || !userData.user) {
      return { success: false, error: userError?.message || "Failed to create user" }
    }

    // Insert into the users table
    const { error: profileError } = await supabase.from("users").insert({
      id: userData.user.id,
      email,
      full_name: fullName,
      role,
    })

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    return { success: true, user: userData.user }
  } catch (error) {
    console.error("Error in signUp:", error)
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

// Sign out without using next/headers
export async function signOut(): Promise<boolean> {
  try {
    const supabase = createClientComponentClient()
    await supabase.auth.signOut()
    return true
  } catch (error) {
    console.error("Error signing out:", error)
    return false
  }
}
