"use server"

import { getSupabaseActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Get client preferences
export async function getClientPreferences(clientId: string) {
  const supabase = getSupabaseActionClient()

  const { data, error } = await supabase.from("client_preferences").select("*").eq("id", clientId).single()

  if (error) {
    console.error("Error fetching client preferences:", error)
    return { error: error.message }
  }

  return { preferences: data }
}

// Update client preferences
export async function updateClientPreferences(clientId: string, preferencesData: any) {
  const supabase = getSupabaseActionClient()

  const { error } = await supabase
    .from("client_preferences")
    .update({
      ...preferencesData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", clientId)

  if (error) {
    console.error("Error updating client preferences:", error)
    return { error: error.message }
  }

  revalidatePath(`/client/preferences`)

  return { success: true }
}

// Find matching artists based on client preferences
export async function findMatchingArtists(clientId: string) {
  const supabase = getSupabaseActionClient()

  // First get the client preferences
  const { data: preferences, error: preferencesError } = await supabase
    .from("client_preferences")
    .select("*")
    .eq("id", clientId)
    .single()

  if (preferencesError) {
    console.error("Error fetching client preferences:", preferencesError)
    return { error: preferencesError.message }
  }

  // Now find artists that match these preferences
  let query = supabase
    .from("users")
    .select(`
      id,
      full_name,
      email,
      profile_image_url,
      artist_profiles!inner (
        *
      ),
      portfolio_images (
        id,
        image_url,
        is_primary,
        style_tags
      )
    `)
    .eq("user_role", "artist")

  // Filter by budget if provided
  if (preferences.budget_min !== null) {
    query = query.gte("artist_profiles.hourly_rate", preferences.budget_min)
  }

  if (preferences.budget_max !== null) {
    query = query.lte("artist_profiles.hourly_rate", preferences.budget_max)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error finding matching artists:", error)
    return { error: error.message }
  }

  // Further filter and score artists based on style preferences
  const matchedArtists = data.map((artist) => {
    // Calculate match score based on style preferences
    let matchScore = 0
    let maxScore = 1

    if (preferences.preferred_styles && preferences.preferred_styles.length > 0) {
      maxScore = preferences.preferred_styles.length
      const artistStyleTags = artist.artist_profiles?.style_tags || []

      // Count matching styles
      const matchingStyles = preferences.preferred_styles.filter((style) => artistStyleTags.includes(style))

      matchScore = matchingStyles.length
    }

    // Convert to percentage
    const matchPercentage = Math.round((matchScore / maxScore) * 100)

    return {
      ...artist,
      matchPercentage,
    }
  })

  // Sort by match percentage (highest first)
  matchedArtists.sort((a, b) => b.matchPercentage - a.matchPercentage)

  return { artists: matchedArtists }
}
