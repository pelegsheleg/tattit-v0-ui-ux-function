"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function updateAvailabilityAction(formData: FormData) {
  const supabase = createServerActionClient({ cookies })

  try {
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Error getting current user:", userError)
      return { error: "You must be logged in to update availability" }
    }

    // Extract data from the form
    const dayOfWeek = formData.get("day_of_week") as string
    const startTime = formData.get("start_time") as string
    const endTime = formData.get("end_time") as string
    const isAvailable = formData.get("is_available") === "true"

    if (!dayOfWeek || !startTime || !endTime) {
      return { error: "Missing required fields" }
    }

    // Check if this availability rule already exists
    const { data: existingRule, error: queryError } = await supabase
      .from("artist_availability")
      .select("id")
      .eq("artist_id", user.id)
      .eq("day_of_week", dayOfWeek)
      .single()

    if (queryError && queryError.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      console.error("Error checking existing availability:", queryError)
      return { error: queryError.message }
    }

    let result
    if (existingRule) {
      // Update existing rule
      result = await supabase
        .from("artist_availability")
        .update({
          start_time: startTime,
          end_time: endTime,
          is_available: isAvailable,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingRule.id)
    } else {
      // Insert new rule
      result = await supabase.from("artist_availability").insert({
        artist_id: user.id,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        is_available: isAvailable,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    if (result.error) {
      console.error("Error updating availability:", result.error)
      return { error: result.error.message }
    }

    // Revalidate paths
    revalidatePath("/artist/availability")

    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating availability:", error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

export async function deleteAvailabilityAction(formData: FormData) {
  const supabase = createServerActionClient({ cookies })

  try {
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Error getting current user:", userError)
      return { error: "You must be logged in to delete availability" }
    }

    // Extract data from the form
    const availabilityId = formData.get("availability_id") as string

    if (!availabilityId) {
      return { error: "No availability ID provided" }
    }

    // Delete the availability rule
    const { error: deleteError } = await supabase
      .from("artist_availability")
      .delete()
      .eq("id", availabilityId)
      .eq("artist_id", user.id) // Ensure the user owns this rule

    if (deleteError) {
      console.error("Error deleting availability:", deleteError)
      return { error: deleteError.message }
    }

    // Revalidate paths
    revalidatePath("/artist/availability")

    return { success: true }
  } catch (error) {
    console.error("Unexpected error deleting availability:", error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

export async function addExternalCalendarAction(formData: FormData) {
  const supabase = createServerActionClient({ cookies })

  try {
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Error getting current user:", userError)
      return { error: "You must be logged in to add an external calendar" }
    }

    // Extract data from the form
    const calendarType = formData.get("calendar_type") as string
    const calendarId = formData.get("calendar_id") as string
    const accessToken = formData.get("access_token") as string
    const refreshToken = formData.get("refresh_token") as string

    if (!calendarType || !calendarId) {
      return { error: "Missing required fields" }
    }

    // Insert the external calendar
    const { error: insertError } = await supabase.from("external_calendars").insert({
      artist_id: user.id,
      calendar_type: calendarType,
      calendar_id: calendarId,
      access_token: accessToken || null,
      refresh_token: refreshToken || null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error adding external calendar:", insertError)
      return { error: insertError.message }
    }

    // Revalidate paths
    revalidatePath("/artist/availability")

    return { success: true }
  } catch (error) {
    console.error("Unexpected error adding external calendar:", error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

export async function deleteExternalCalendarAction(formData: FormData) {
  const supabase = createServerActionClient({ cookies })

  try {
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Error getting current user:", userError)
      return { error: "You must be logged in to delete an external calendar" }
    }

    // Extract data from the form
    const calendarId = formData.get("calendar_id") as string

    if (!calendarId) {
      return { error: "No calendar ID provided" }
    }

    // Delete the external calendar
    const { error: deleteError } = await supabase
      .from("external_calendars")
      .delete()
      .eq("id", calendarId)
      .eq("artist_id", user.id) // Ensure the user owns this calendar

    if (deleteError) {
      console.error("Error deleting external calendar:", deleteError)
      return { error: deleteError.message }
    }

    // Revalidate paths
    revalidatePath("/artist/availability")

    return { success: true }
  } catch (error) {
    console.error("Unexpected error deleting external calendar:", error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

export async function getArtistAvailabilityAction(artistId: string) {
  try {
    const supabase = createServerActionClient({ cookies })

    const { data, error } = await supabase.from("artist_availability").select("*").eq("artist_id", artistId)

    if (error) {
      throw error
    }

    return { success: true, availability: data }
  } catch (error) {
    console.error("Error getting artist availability:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
