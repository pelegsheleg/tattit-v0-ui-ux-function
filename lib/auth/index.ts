"use server"

import { getSupabaseServerClient, getSupabaseActionClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { insertData } from "@/lib/data"

export type SignUpData = {
  email: string
  password: string
  fullName: string
  role: "client" | "artist"
}

export type SignInData = {
  email: string
  password: string
}

// Get the site URL from environment or use a fallback for v0
function getSiteUrl() {
  // For v0 environments, try to get the URL from the request
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  // Fallback to environment variable or default
  return process.env.NEXT_PUBLIC_SITE_URL || "https://v0.dev"
}

// Server-side function to get the current session
export async function getSession() {
  const supabase = getSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

// Server-side function to get the current user
export async function getCurrentUser() {
  const session = await getSession()
  if (!session?.user) {
    return null
  }

  const supabase = getSupabaseServerClient()
  const { data: user } = await supabase.from("users").select("*, user_roles(*)").eq("id", session.user.id).single()

  return user
}

// Server action for sign up
export async function signUp(data: SignUpData) {
  const supabase = getSupabaseActionClient()
  const siteUrl = getSiteUrl()

  console.log("Using site URL for redirects:", siteUrl)

  // Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      data: {
        full_name: data.fullName,
        role: data.role,
      },
    },
  })

  if (authError) {
    return { success: false, error: authError.message || "Failed to create user" }
  }

  if (!authData.user) {
    return { success: false, error: "Failed to create user" }
  }

  // Check if email confirmation is required
  if (authData.user.identities && authData.user.identities.length === 0) {
    return {
      success: false,
      error: "An account with this email already exists",
    }
  }

  // Check if email confirmation is required
  if (!authData.user.email_confirmed_at) {
    console.log("Email confirmation required for:", data.email)
    return {
      success: true,
      user: authData.user,
      emailConfirmationRequired: true,
    }
  }

  // Create the user profile in our database
  const { error: profileError } = await insertData("users", {
    id: authData.user.id,
    full_name: data.fullName,
    email: data.email,
  })

  if (profileError) {
    return { success: false, error: profileError.message || "Failed to create user profile" }
  }

  // Set the user role
  const { error: roleError } = await insertData("user_roles", {
    user_id: authData.user.id,
    role: data.role,
  })

  if (roleError) {
    return { success: false, error: roleError.message || "Failed to set user role" }
  }

  // If user is an artist, create artist profile
  if (data.role === "artist") {
    const { error: artistError } = await insertData("artist_profiles", {
      id: authData.user.id,
      years_experience: 0,
      is_mobile: false,
    })

    if (artistError) {
      return { success: false, error: artistError.message || "Failed to create artist profile" }
    }
  }

  // If user is a client, create client preferences
  if (data.role === "client") {
    const { error: clientError } = await insertData("client_preferences", {
      id: authData.user.id,
      search_radius: 10,
    })

    if (clientError) {
      return { success: false, error: clientError.message || "Failed to create client preferences" }
    }
  }

  return { success: true, user: authData.user }
}

// Server action for sign in
export async function signIn(data: SignInData) {
  console.log("Server signIn called with email:", data.email)

  const supabase = getSupabaseActionClient()

  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      console.error("Supabase auth error:", error)
      return { success: false, error: error.message || "Authentication failed" }
    }

    if (!authData.user) {
      console.error("No user returned from Supabase")
      return { success: false, error: "No user found" }
    }

    console.log("Authentication successful for user:", authData.user.id)
    return { success: true, user: authData.user }
  } catch (error) {
    console.error("Unexpected error in signIn:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

// Server action to resend confirmation email
export async function resendConfirmationEmail(email: string) {
  console.log("Resending confirmation email to:", email)
  const siteUrl = getSiteUrl()

  console.log("Using site URL for redirects:", siteUrl)

  const supabase = getSupabaseActionClient()

  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    })

    if (error) {
      console.error("Error resending confirmation email:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error in resendConfirmationEmail:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

// Server action for sign out
export async function signOut() {
  const supabase = getSupabaseActionClient()
  await supabase.auth.signOut()
  redirect("/auth")
}

// Add this function to verify user authentication
export async function verifyUserAuth(email: string) {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase.from("users").select("id, email, user_role").eq("email", email).maybeSingle()

    if (error) {
      console.error("Error verifying user auth:", error)
      return { error: error.message }
    }

    if (!data) {
      return { error: "User not found" }
    }

    return { data }
  } catch (error) {
    console.error("Unexpected error in verifyUserAuth:", error)
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
