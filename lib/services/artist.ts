"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Get admin client for operations that require bypassing RLS
const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL or service role key is missing")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// Update the getArtistProfile function to handle database schema inconsistencies

export async function getArtistProfile(artistId: string) {
  try {
    const supabase = getSupabaseServerClient()

    // First, check if the user exists
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, full_name, profile_image_url, user_role")
      .eq("id", artistId)
      .maybeSingle() // Use maybeSingle instead of single to handle no rows gracefully

    if (userError) {
      console.error("Error fetching user data:", userError)
      return { error: userError.message }
    }

    if (!userData) {
      console.error("No user found with ID:", artistId)
      return { error: "User not found", data: null }
    }

    // Verify the user is an artist
    if (userData.user_role !== "artist") {
      console.error("User is not an artist:", artistId)
      return { error: "User is not an artist", data: null }
    }

    // Try to get the artist profile from artist_profile table first
    let profileData = null
    let profileError = null

    const { data: profile, error } = await supabase.from("artist_profile").select("*").eq("id", artistId).maybeSingle()

    if (error) {
      console.error("Error fetching from artist_profile:", error)
      profileError = error
    } else if (profile) {
      profileData = profile
    } else {
      // If not found, try the artist_profiles table (plural)
      const { data: profilesData, error: profilesError } = await supabase
        .from("artist_profiles")
        .select("*")
        .eq("id", artistId)
        .maybeSingle()

      if (profilesError) {
        console.error("Error fetching from artist_profiles:", profilesError)
        profileError = profilesError
      } else {
        profileData = profilesData
      }
    }

    // If no profile exists, return the user data with empty profile
    if (!profileData) {
      console.log("No artist profile found, returning user data only")
      return {
        data: {
          users: userData,
          // Default empty values for artist profile
          bio: "",
          personal_brand_statement: "",
          studio_name: "",
          location: "",
          hourly_rate: null,
          years_experience: null,
          specialties: [],
          style_tags: [],
          certifications: "",
          do_list: [],
          dont_list: [],
        },
      }
    }

    // Combine the data
    const combinedData = {
      ...profileData,
      users: userData,
    }

    return { data: combinedData }
  } catch (error) {
    console.error("Unexpected error in getArtistProfile:", error)
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function getArtistPortfolio(artistId: string) {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("portfolio_images")
      .select("*")
      .eq("artist_id", artistId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching artist portfolio:", error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error("Unexpected error in getArtistPortfolio:", error)
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function getArtistStyleTags(artistId: string) {
  const supabase = getSupabaseServerClient()

  try {
    // Get the artist profile to access the style_tags array
    const { data: artistProfile, error } = await supabase
      .from("artist_profile")
      .select("style_tags")
      .eq("id", artistId)
      .single()

    if (error) {
      console.error("Error fetching artist style tags:", error)
      return { error: error.message }
    }

    // Transform the style_tags array into the format expected by the UI
    const formattedTags = (artistProfile?.style_tags || []).map((tag: string, index: number) => ({
      id: index + 1, // Generate a synthetic ID
      tag_name: tag,
      artist_id: artistId,
    }))

    return { data: formattedTags }
  } catch (error) {
    console.error("Unexpected error fetching artist style tags:", error)
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function getArtistCredentials(artistId: string) {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("artist_credentials")
      .select("*")
      .eq("artist_id", artistId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching artist credentials:", error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error("Unexpected error in getArtistCredentials:", error)
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function getArtistAvailability(artistId: string) {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("artist_availability")
      .select("*")
      .eq("artist_id", artistId)
      .order("day_of_week", { ascending: true })

    if (error) {
      console.error("Error fetching artist availability:", error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error("Unexpected error in getArtistAvailability:", error)
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function getExternalCalendars(artistId: string) {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("external_calendars")
      .select("*")
      .eq("artist_id", artistId)
      .eq("is_active", true)

    if (error) {
      console.error("Error fetching external calendars:", error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error("Unexpected error in getExternalCalendars:", error)
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function getNotificationSettings(userId: string) {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("notification_settings").select("*").eq("user_id", userId)

    if (error) {
      console.error("Error fetching notification settings:", error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error("Unexpected error in getNotificationSettings:", error)
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function getAllArtists() {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        id,
        full_name,
        email,
        profile_image_url,
        artist_profile ( 
          bio,
          years_experience,
          specialties,
          style_tags,
          hourly_rate,
          minimum_price,
          is_mobile_artist,
          location,
          studio_name,
          rating,
          cover_image_url
        )
      `,
      )
      .eq("user_role", "artist")

    if (error) {
      console.error("Error fetching all artists:", error)
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error("Unexpected error in getAllArtists:", error)
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function updateArtistProfile(artistId: string, profileData: any) {
  try {
    const supabase = getSupabaseServerClient()

    // Update the artist profile
    const { error } = await supabase
      .from("artist_profile")
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", artistId)

    if (error) {
      console.error("Error updating artist profile:", error)
      return { error: error.message }
    }

    // Revalidate relevant paths
    revalidatePath("/artist/dashboard")
    revalidatePath("/artist/profile")
    revalidatePath(`/artists/${artistId}`)

    return { success: true }
  } catch (error) {
    console.error("Unexpected error in updateArtistProfile:", error)
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function updateUserProfile(userId: string, userData: any) {
  try {
    const supabase = getSupabaseServerClient()

    // Update the user record
    const { error } = await supabase
      .from("users")
      .update({
        ...userData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Error updating user profile:", error)
      return { error: error.message }
    }

    // Revalidate relevant paths
    revalidatePath("/artist/dashboard")
    revalidatePath("/artist/profile")
    revalidatePath(`/artists/${userId}`)

    return { success: true }
  } catch (error) {
    console.error("Unexpected error in updateUserProfile:", error)
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
