"use server"

import { getSupabaseServerClient, getSupabaseActionClient, getSupabaseServiceClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

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

// Add this new function:
export async function getAuthUser() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Then update getUserDetails to use getAuthUser:
export async function getUserDetails() {
  const user = await getAuthUser()
  if (!user) {
    return null
  }

  const supabase = getSupabaseServerClient()
  const { data: userDetails } = await supabase.from("users").select("*").eq("id", user.id).limit(1)

  return userDetails?.[0] || null
}

// Update getCurrentUser similarly:
export async function getCurrentUser() {
  const user = await getAuthUser()
  if (!user) {
    return null
  }

  const supabase = getSupabaseServerClient()
  const { data: userDetails } = await supabase.from("users").select("*").eq("id", user.id).limit(1)

  return userDetails?.[0] || null
}

// Update the signUp function to use the service role client for creating user records
export async function signUp(data: SignUpData) {
  const supabase = getSupabaseActionClient()
  const siteUrl = getSiteUrl()

  console.log("Starting signup process for:", data.email, "with role:", data.role)
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
    console.error("Auth error during signup:", authError)
    return { success: false, error: authError.message || "Failed to create user" }
  }

  if (!authData.user) {
    console.error("No user returned from auth signup")
    return { success: false, error: "Failed to create user" }
  }

  console.log("Auth user created successfully:", authData.user.id)

  // Check if email confirmation is required
  if (authData.user.identities && authData.user.identities.length === 0) {
    console.error("Account with this email already exists")
    return {
      success: false,
      error: "An account with this email already exists",
    }
  }

  // Get the service role client to bypass RLS policies
  const serviceClient = getSupabaseServiceClient()

  // Create the user profile in our database using the service role client
  console.log("Creating user profile in database with role:", data.role)
  const { error: profileError } = await serviceClient.from("users").insert({
    id: authData.user.id,
    full_name: data.fullName,
    email: data.email,
    user_role: data.role,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (profileError) {
    console.error("Error creating user profile:", profileError)
    return { success: false, error: profileError.message || "Failed to create user profile" }
  }

  // If user is an artist, create artist profile
  if (data.role === "artist") {
    console.log("Creating artist profile for:", authData.user.id)
    const { error: artistError } = await serviceClient.from("artist_profile").insert({
      id: authData.user.id,
      bio: "",
      years_experience: 0,
      specialties: [],
      personal_brand_statement: "",
      studio_name: "",
      location: "",
      is_mobile_artist: false,
      style_tags: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (artistError) {
      console.error("Error creating artist profile:", artistError)
      return { success: false, error: artistError.message || "Failed to create artist profile" }
    }
  } else if (data.role === "client") {
    // If user is a client, create client preferences
    console.log("Creating client preferences for:", authData.user.id)
    const { error: clientError } = await serviceClient.from("client_preferences").insert({
      id: authData.user.id,
      preferred_styles: [],
      search_radius: 25,
      preferred_experience: "Any",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (clientError) {
      console.error("Error creating client preferences:", clientError)
      return { success: false, error: clientError.message || "Failed to create client preferences" }
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

  console.log("User signup completed successfully with role:", data.role)
  return { success: true, user: authData.user, role: data.role }
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

    // Get the user role
    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("user_role")
      .eq("id", authData.user.id)
      .limit(1)

    if (roleError) {
      console.error("Error fetching user role:", roleError)
    }

    const userRole = userData && userData.length > 0 ? userData[0].user_role : null

    console.log("Authentication successful for user:", authData.user.id, "with role:", userRole)
    return {
      success: true,
      user: authData.user,
      role: userRole as "artist" | "client" | null,
    }
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

// Add the requireAuth, requireArtist, and requireClient functions at the end of the file

// Require authenticated user
export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const user = await getUserDetails()
  if (!user) {
    redirect("/login")
  }

  return { session, user }
}

// Require authenticated artist
export async function requireArtist() {
  const { session, user } = await requireAuth()

  if (user.user_role !== "artist") {
    redirect("/dashboard")
  }

  return { session, user }
}

// Require authenticated client
export async function requireClient() {
  const { session, user } = await requireAuth()

  if (user.user_role !== "client") {
    redirect("/dashboard")
  }

  return { session, user }
}
