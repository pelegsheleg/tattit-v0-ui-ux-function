"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const phone = formData.get("phone") as string
  const userRole = formData.get("userRole") as string

  if (!email || !password || !fullName || !userRole) {
    return {
      error: "Missing required fields",
    }
  }

  const supabase = createServerActionClient({ cookies })

  // First, create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        user_role: userRole,
      },
    },
  })

  if (authError) {
    console.error("Error signing up:", authError)
    return {
      error: authError.message,
    }
  }

  // Then, create the user record in our users table
  if (authData.user) {
    console.log("Creating user record for:", authData.user.id, email, fullName, userRole)

    const { error: userError } = await supabase.from("users").insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      phone: phone || null,
      user_role: userRole,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (userError) {
      console.error("Error creating user record:", userError)
      return {
        error: userError.message,
      }
    }

    // If user is an artist, create empty artist profile
    if (userRole === "artist") {
      // Log the attempt to create an artist profile
      console.log("Creating artist profile for user:", authData.user.id)

      // Use the correct table name - artist_profile_singular
      const tableName = "artist_profile_singular"

      console.log(`Using table name: ${tableName} for artist profile`)

      const { error: artistError } = await supabase.from(tableName).insert({
        id: authData.user.id,
        years_experience: 0,
        specialties: [],
        is_mobile_artist: false,
        style_tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (artistError) {
        console.error("Error creating artist profile:", artistError)
        return {
          error: artistError.message,
        }
      }
    }

    // If user is a client, create empty client preferences
    if (userRole === "client") {
      const { error: clientError } = await supabase.from("client_preferences").insert({
        id: authData.user.id,
        preferred_styles: [],
        search_radius: 25,
        preferred_experience: "Any",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (clientError) {
        console.error("Error creating client preferences:", clientError)
        return {
          error: clientError.message,
        }
      }
    }
  }

  return {
    success: true,
    message: "Check your email for the confirmation link",
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return {
      error: "Email and password are required",
    }
  }

  const supabase = createServerActionClient({ cookies })

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Error signing in:", error)
    return {
      error: error.message,
    }
  }

  revalidatePath("/")

  return {
    success: true,
  }
}

export async function signOut() {
  const supabase = createServerActionClient({ cookies })

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error signing out:", error)
    return {
      error: error.message,
    }
  }

  revalidatePath("/")

  return {
    success: true,
  }
}

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return {
      error: "Email is required",
    }
  }

  const supabase = createServerActionClient({ cookies })

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  })

  if (error) {
    console.error("Error resetting password:", error)
    return {
      error: error.message,
    }
  }

  return {
    success: true,
    message: "Check your email for the password reset link",
  }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string

  if (!password) {
    return {
      error: "Password is required",
    }
  }

  const supabase = createServerActionClient({ cookies })

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    console.error("Error updating password:", error)
    return {
      error: error.message,
    }
  }

  return {
    success: true,
    message: "Password updated successfully",
  }
}
