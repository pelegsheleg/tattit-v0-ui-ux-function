"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import type { Database } from "@/types/supabase"
import { getSupabaseActionClient } from "@/lib/supabase/server"
import { put } from "@vercel/blob"

export type ArtistAccountData = {
  email: string
  password: string
  fullName: string
  phone: string
  bio: string
  yearsOfExperience: number
  specialties: string
  personalBrandStatement: string
  studioName: string
  location: string
  isMobileArtist: boolean
  locationPreferences: string
  certifications: string
  styleTags: string[]
  profileImage: string
}

// Create a Supabase client with the service role key for admin operations
const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL or service role key is missing")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}

// Check if an email already exists in the auth system
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    console.log("Checking if email exists:", email)
    const adminClient = getAdminClient()

    // First check if the email exists in the auth system
    const { data, error } = await adminClient.auth.admin.listUsers()

    if (error) {
      console.error("Error listing users:", error)
      throw error
    }

    // Log the number of users found for debugging
    console.log(`Found ${data.users.length} total users in auth system`)

    // Check if any user has the email we're looking for
    const userExists = data.users.some((user) => user.email && user.email.toLowerCase() === email.toLowerCase())

    console.log(`Email ${email} exists: ${userExists}`)
    return userExists
  } catch (error) {
    console.error("Error in checkEmailExists:", error)
    // Default to false if there's an error
    return false
  }
}

// Create artist account function
export async function createArtistAccount(formData: FormData) {
  const supabase = getSupabaseActionClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string

  try {
    // Check if email already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email.toLowerCase()).single()

    if (existingUser) {
      return {
        error: {
          message: "A user with this email address has already been registered.",
        },
      }
    }

    // Create the user account
    const { data: userData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: "artist",
        },
      },
    })

    if (signUpError) {
      console.error("Error creating artist account:", signUpError)
      return { error: signUpError }
    }

    // Create artist profile entry
    if (userData?.user) {
      const { error: profileError } = await supabase.from("artist_profile").insert({
        id: userData.user.id,
        bio: "",
        years_experience: 0,
        specialties: [],
        style_tags: [],
      })

      if (profileError) {
        console.error("Error creating artist profile:", profileError)
        return { error: profileError }
      }
    }

    return { success: true, user: userData?.user }
  } catch (error) {
    console.error("Unexpected error creating artist account:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

// Existing functions for updating artist profile
export async function updateArtistProfile(formData: FormData) {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    const bio = formData.get("bio") as string
    const yearsExperience = Number.parseInt(formData.get("yearsExperience") as string) || 0
    const specialties = (formData.get("specialties") as string).split(",").map((s) => s.trim())
    const personalBrandStatement = formData.get("personalBrandStatement") as string
    const studioName = formData.get("studioName") as string
    const location = formData.get("location") as string
    const locationDescription = formData.get("locationDescription") as string
    const isMobileArtist = formData.get("isMobileArtist") === "true"
    const styleTags = (formData.get("styleTags") as string).split(",").map((s) => s.trim())

    const { error } = await supabase.from("artist_profile").upsert({
      id: user.id,
      bio,
      years_experience: yearsExperience,
      specialties,
      personal_brand_statement: personalBrandStatement,
      studio_name: studioName,
      location,
      location_description: locationDescription,
      is_mobile_artist: isMobileArtist,
      style_tags: styleTags,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error updating artist profile:", error)
      return { error }
    }

    revalidatePath("/artist/profile")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating artist profile:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

export async function updateArtistPricing(formData: FormData) {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    const hourlyRate = Number.parseFloat(formData.get("hourlyRate") as string) || 0
    const minimumPrice = Number.parseFloat(formData.get("minimumPrice") as string) || 0
    const depositPercentage = Number.parseInt(formData.get("depositPercentage") as string) || 25
    const cancellationHours = Number.parseInt(formData.get("cancellationHours") as string) || 48
    const pricingFaq = formData.get("pricingFaq") as string

    // Parse price ranges from form data
    const priceRanges = {
      small: Number.parseFloat(formData.get("priceSmall") as string) || 0,
      medium: Number.parseFloat(formData.get("priceMedium") as string) || 0,
      large: Number.parseFloat(formData.get("priceLarge") as string) || 0,
      fullSleeve: Number.parseFloat(formData.get("priceFullSleeve") as string) || 0,
      halfSleeve: Number.parseFloat(formData.get("priceHalfSleeve") as string) || 0,
      backPiece: Number.parseFloat(formData.get("priceBackPiece") as string) || 0,
    }

    const { error } = await supabase
      .from("artist_profile")
      .update({
        hourly_rate: hourlyRate,
        minimum_price: minimumPrice,
        deposit_percentage: depositPercentage,
        cancellation_hours: cancellationHours,
        pricing_faq: pricingFaq,
        price_ranges: priceRanges,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      console.error("Error updating artist pricing:", error)
      return { error }
    }

    revalidatePath("/artist/pricing")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating artist pricing:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

export async function updateArtistPreferences(formData: FormData) {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    const doList = (formData.get("doList") as string).split("\n").filter((item) => item.trim() !== "")
    const dontList = (formData.get("dontList") as string).split("\n").filter((item) => item.trim() !== "")
    const emailNotifications = formData.get("emailNotifications") === "true"
    const pushNotifications = formData.get("pushNotifications") === "true"
    const smsNotifications = formData.get("smsNotifications") === "true"

    const { error } = await supabase
      .from("artist_profile")
      .update({
        do_list: doList,
        dont_list: dontList,
        email_notifications: emailNotifications,
        push_notifications: pushNotifications,
        sms_notifications: smsNotifications,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      console.error("Error updating artist preferences:", error)
      return { error }
    }

    revalidatePath("/artist/preferences")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating artist preferences:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

export async function updateArtistLocation(formData: FormData) {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    const studioName = formData.get("studioName") as string
    const location = formData.get("location") as string
    const locationDescription = formData.get("locationDescription") as string
    const isMobileArtist = formData.get("isMobileArtist") === "true"
    const locationPreferences = formData.get("locationPreferences") as string

    const { error } = await supabase
      .from("artist_profile")
      .update({
        studio_name: studioName,
        location,
        location_description: locationDescription,
        is_mobile_artist: isMobileArtist,
        location_preferences: locationPreferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      console.error("Error updating artist location:", error)
      return { error }
    }

    revalidatePath("/artist/location")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating artist location:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

export async function uploadCredential(formData: FormData) {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    const documentType = formData.get("documentType") as string
    const documentName = formData.get("documentName") as string
    const documentFile = formData.get("documentFile") as File
    const expirationDate = formData.get("expirationDate") as string

    // Upload the document file
    const fileName = `${user.id}/${Date.now()}-${documentFile.name}`
    const { data: fileData, error: uploadError } = await supabase.storage
      .from("credentials")
      .upload(fileName, documentFile)

    if (uploadError) {
      console.error("Error uploading credential document:", uploadError)
      return { error: uploadError }
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("credentials").getPublicUrl(fileName)

    // Save the credential record
    const { error } = await supabase.from("artist_credentials").insert({
      artist_id: user.id,
      document_type: documentType,
      document_name: documentName,
      document_url: publicUrl,
      expiration_date: expirationDate || null,
      is_verified: false,
    })

    if (error) {
      console.error("Error saving credential record:", error)
      return { error }
    }

    revalidatePath("/artist/credentials")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error uploading credential:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

export async function deleteCredential(id: string) {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    // Get the credential to find the file URL
    const { data: credential, error: fetchError } = await supabase
      .from("artist_credentials")
      .select("document_url")
      .eq("id", id)
      .eq("artist_id", user.id)
      .single()

    if (fetchError) {
      console.error("Error fetching credential:", fetchError)
      return { error: fetchError }
    }

    // Delete the credential record
    const { error } = await supabase.from("artist_credentials").delete().eq("id", id).eq("artist_id", user.id)

    if (error) {
      console.error("Error deleting credential:", error)
      return { error }
    }

    // Try to delete the file from storage if possible
    if (credential?.document_url) {
      try {
        const path = credential.document_url.split("/").pop()
        if (path) {
          await supabase.storage.from("credentials").remove([`${user.id}/${path}`])
        }
      } catch (storageError) {
        console.error("Error deleting credential file:", storageError)
        // Continue even if file deletion fails
      }
    }

    revalidatePath("/artist/credentials")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error deleting credential:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

export async function updatePortfolioImage(id: string, formData: FormData) {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    const styleTags = (formData.get("styleTags") as string).split(",").map((s) => s.trim())
    const allowsDesignReplication = formData.get("allowsDesignReplication") === "true"
    const description = formData.get("description") as string
    const isPrimary = formData.get("isPrimary") === "true"

    // If setting as primary, first unset any existing primary
    if (isPrimary) {
      await supabase
        .from("portfolio_images")
        .update({ is_primary: false })
        .eq("artist_id", user.id)
        .eq("is_primary", true)
    }

    // Update the portfolio image
    const { error } = await supabase
      .from("portfolio_images")
      .update({
        style_tags: styleTags,
        allows_design_replication: allowsDesignReplication,
        description,
        is_primary: isPrimary,
      })
      .eq("id", id)
      .eq("artist_id", user.id)

    if (error) {
      console.error("Error updating portfolio image:", error)
      return { error }
    }

    revalidatePath("/artist/portfolio")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating portfolio image:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

export async function deletePortfolioImage(id: string) {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    // Get the image to find the file URL
    const { data: image, error: fetchError } = await supabase
      .from("portfolio_images")
      .select("image_url")
      .eq("id", id)
      .eq("artist_id", user.id)
      .single()

    if (fetchError) {
      console.error("Error fetching portfolio image:", fetchError)
      return { error: fetchError }
    }

    // Delete the image record
    const { error } = await supabase.from("portfolio_images").delete().eq("id", id).eq("artist_id", user.id)

    if (error) {
      console.error("Error deleting portfolio image:", error)
      return { error }
    }

    // Try to delete the file from storage if possible
    if (image?.image_url) {
      try {
        const path = image.image_url.split("/").pop()
        if (path) {
          await supabase.storage.from("portfolio").remove([`${user.id}/${path}`])
        }
      } catch (storageError) {
        console.error("Error deleting portfolio image file:", storageError)
        // Continue even if file deletion fails
      }
    }

    revalidatePath("/artist/portfolio")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error deleting portfolio image:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

export async function updateNotificationSettings(formData: FormData) {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    const emailNotifications = formData.get("emailNotifications") === "true"
    const pushNotifications = formData.get("pushNotifications") === "true"
    const smsNotifications = formData.get("smsNotifications") === "true"

    // Update notification settings in artist profile
    const { error: profileError } = await supabase
      .from("artist_profile")
      .update({
        email_notifications: emailNotifications,
        push_notifications: pushNotifications,
        sms_notifications: smsNotifications,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (profileError) {
      console.error("Error updating notification settings in profile:", profileError)
      return { error: profileError }
    }

    // Get all event types
    const eventTypes = ["new_message", "new_booking", "booking_confirmed", "booking_cancelled", "new_review"]

    // Update or create notification settings for each event type
    for (const eventType of eventTypes) {
      const emailEnabled = formData.get(`email_${eventType}`) === "true"
      const pushEnabled = formData.get(`push_${eventType}`) === "true"
      const smsEnabled = formData.get(`sms_${eventType}`) === "true"

      const { error } = await supabase.from("notification_settings").upsert({
        user_id: user.id,
        event_type: eventType,
        email_enabled: emailEnabled,
        push_enabled: pushEnabled,
        sms_enabled: smsEnabled,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error(`Error updating notification settings for ${eventType}:`, error)
        return { error }
      }
    }

    revalidatePath("/artist/preferences")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating notification settings:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

export async function connectExternalCalendar(formData: FormData) {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    const calendarType = formData.get("calendarType") as string
    const calendarId = formData.get("calendarId") as string
    const accessToken = formData.get("accessToken") as string
    const refreshToken = formData.get("refreshToken") as string

    // Calculate token expiration (typically 1 hour for OAuth tokens)
    const tokenExpiresAt = new Date()
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 1)

    const { error } = await supabase.from("external_calendars").insert({
      artist_id: user.id,
      calendar_type: calendarType,
      calendar_id: calendarId,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expires_at: tokenExpiresAt.toISOString(),
      is_active: true,
    })

    if (error) {
      console.error("Error connecting external calendar:", error)
      return { error }
    }

    revalidatePath("/artist/availability")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error connecting external calendar:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

export async function disconnectExternalCalendar(id: string) {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    const { error } = await supabase.from("external_calendars").delete().eq("id", id).eq("artist_id", user.id)

    if (error) {
      console.error("Error disconnecting external calendar:", error)
      return { error }
    }

    revalidatePath("/artist/availability")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error disconnecting external calendar:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

export async function getArtistProfile() {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    const { data, error } = await supabase.from("artist_profile").select("*").eq("id", user.id).single()

    if (error) {
      console.error("Error fetching artist profile:", error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error("Unexpected error fetching artist profile:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

export async function getArtistCredentials() {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    const { data, error } = await supabase
      .from("artist_credentials")
      .select("*")
      .eq("artist_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching artist credentials:", error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error("Unexpected error fetching artist credentials:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

export async function getPortfolioImages() {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    const { data, error } = await supabase
      .from("portfolio_images")
      .select("*")
      .eq("artist_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching portfolio images:", error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error("Unexpected error fetching portfolio images:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

export async function getExternalCalendars() {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    const { data, error } = await supabase
      .from("external_calendars")
      .select("*")
      .eq("artist_id", user.id)
      .eq("is_active", true)

    if (error) {
      console.error("Error fetching external calendars:", error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error("Unexpected error fetching external calendars:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

export async function getNotificationSettings() {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" } }
    }

    // Get general notification settings from artist profile
    const { data: profileData, error: profileError } = await supabase
      .from("artist_profile")
      .select("email_notifications, push_notifications, sms_notifications")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching notification settings from profile:", profileError)
      return { error: profileError }
    }

    // Get specific notification settings
    const { data: settingsData, error: settingsError } = await supabase
      .from("notification_settings")
      .select("*")
      .eq("user_id", user.id)

    if (settingsError) {
      console.error("Error fetching notification settings:", settingsError)
      return { error: settingsError }
    }

    return {
      general: profileData,
      settings: settingsData,
    }
  } catch (error) {
    console.error("Unexpected error fetching notification settings:", error)
    return {
      error: {
        message: "An unexpected error occurred. Please try again.",
      },
    }
  }
}

// Get all artists
export async function getArtists() {
  const supabase = getSupabaseActionClient()

  try {
    // Modified query to avoid the relationship error
    const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        full_name,
        email,
        profile_image_url,
        user_role
      `)
      .eq("user_role", "artist")

    if (error) {
      console.error("Error fetching artists:", error)
      return { error: error.message }
    }

    // Get portfolio images in a separate query
    const portfolioPromises = data.map(async (artist) => {
      const { data: portfolioData } = await supabase.from("portfolio_images").select("*").eq("artist_id", artist.id)

      return {
        ...artist,
        portfolio_images: portfolioData || [],
      }
    })

    // Wait for all portfolio queries to complete
    const artistsWithPortfolio = await Promise.all(portfolioPromises)

    return { artists: artistsWithPortfolio }
  } catch (error) {
    console.error("Unexpected error fetching artists:", error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

// Get artist details
export async function getArtistDetails(id: string) {
  const supabase = getSupabaseActionClient()

  const { data, error } = await supabase
    .from("users")
    .select(
      `
      id,
      full_name,
      email,
      profile_image_url,
      artist_profile!inner (
        *
      ),
      portfolio_images (
        id,
        image_url,
        is_primary,
        style_tags
      ),
      style_analysis(*)
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching artist details:", error)
    return { error: error.message }
  }

  return { artist: data }
}

export async function getArtistsByLocation(location: string, limit = 10) {
  const supabase = getSupabaseActionClient()

  try {
    const { data, error } = await supabase
      .from("artist_profile") // FIXED TABLE NAME
      .select(`
        *,
        users:id(email, full_name)
      `)
      .ilike("location", `%${location}%`)
      .limit(limit)

    if (error) {
      console.error("Error fetching artists by location:", error)
      return { error: error.message }
    }

    return { artists: data }
  } catch (error) {
    console.error("Unexpected error fetching artists by location:", error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

export async function getAllArtists(limit = 20, offset = 0) {
  const supabase = getSupabaseActionClient()

  try {
    const { data, error } = await supabase
      .from("artist_profile") // FIXED TABLE NAME
      .select(`
        *,
        users:id(email, full_name)
      `)
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching all artists:", error)
      return { error: error.message }
    }

    return { artists: data }
  } catch (error) {
    console.error("Unexpected error fetching all artists:", error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

export async function getArtistById(id: string) {
  const supabase = getSupabaseActionClient()

  try {
    const { data, error } = await supabase
      .from("artist_profile") // FIXED TABLE NAME
      .select(`
        *,
        users:id(email, full_name)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching artist by ID:", error)
      return { error: error.message }
    }

    return { artist: data }
  } catch (error) {
    console.error("Unexpected error fetching artist by ID:", error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

// Add the missing updateArtistProfileAction function
export async function updateArtistProfileAction(formData: FormData) {
  const supabase = getSupabaseActionClient()

  try {
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Error getting current user:", userError)
      return { error: "You must be logged in to update your profile" }
    }

    // Extract data from the form
    const bio = formData.get("bio") as string
    const hourlyRate = Number.parseFloat(formData.get("hourly_rate") as string) || 0
    const location = formData.get("location") as string
    const studioName = formData.get("studio_name") as string
    const yearsOfExperience = Number.parseInt(formData.get("years_of_experience") as string) || 0

    // Update the artist profile
    const { error: updateError } = await supabase
      .from("artist_profile")
      .update({
        bio,
        hourly_rate: hourlyRate,
        location,
        studio_name: studioName,
        years_experience: yearsOfExperience,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("Error updating artist profile:", updateError.message)
      return { error: updateError.message }
    }

    // Revalidate the artist pages to reflect the changes
    revalidatePath("/artist/dashboard")
    revalidatePath("/artist/profile")
    revalidatePath(`/artists/${user.id}`)

    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating artist profile:", error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

// Add placeholder functions for the ones that were in the previous version
export async function uploadCredentialAction(formData: FormData) {
  console.log("uploadCredentialAction called")
  return { success: true }
}

export async function deleteCredentialAction(formData: FormData) {
  console.log("deleteCredentialAction called")
  return { success: true }
}

export async function uploadPortfolioImageAction(formData: FormData) {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" }, success: false }
    }

    // Extract data from the form
    const file = formData.get("file") as File
    const isPrimary = formData.get("is_primary") === "true"
    const allowsReplication = formData.get("allows_replication") === "true"
    const description = formData.get("description") as string
    const styleTags = formData.get("style_tags") ? JSON.parse(formData.get("style_tags") as string) : []

    if (!file) {
      return { error: { message: "No file provided" }, success: false }
    }

    // Generate a unique filename with original extension
    const fileExtension = file.name.split(".").pop() || "jpg"
    const uniqueFilename = `portfolio/${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`

    try {
      // Upload to Vercel Blob
      const { url } = await put(uniqueFilename, file, {
        access: "public",
        addRandomSuffix: false, // We're already adding our own unique suffix
      })

      // If setting as primary, first unset any existing primary
      if (isPrimary) {
        await supabase
          .from("portfolio_images")
          .update({ is_primary: false })
          .eq("artist_id", user.id)
          .eq("is_primary", true)
      }

      // Check if the allows_design_replication column exists
      const { data: columnExists } = await supabase
        .from("information_schema.columns")
        .select("column_name")
        .eq("table_name", "portfolio_images")
        .eq("column_name", "allows_design_replication")
        .single()

      // Prepare the base insert data
      const insertData: any = {
        artist_id: user.id,
        image_url: url,
        is_primary: isPrimary,
        style_tags: styleTags,
      }

      // Add optional columns if they exist in the schema
      if (columnExists) {
        insertData.allows_design_replication = allowsReplication
      }

      // Check if description column exists
      const { data: descColumnExists } = await supabase
        .from("information_schema.columns")
        .select("column_name")
        .eq("table_name", "portfolio_images")
        .eq("column_name", "description")
        .single()

      if (descColumnExists) {
        insertData.description = description
      }

      // Save to database with the columns that exist
      const { error: dbError } = await supabase.from("portfolio_images").insert(insertData)

      if (dbError) {
        console.error("Error saving to database:", dbError)
        return { error: { message: "Failed to save image details: " + dbError.message }, success: false }
      }

      revalidatePath("/artist/portfolio")
      return { success: true }
    } catch (uploadError) {
      console.error("Error uploading to Blob:", uploadError)
      return {
        error: { message: uploadError instanceof Error ? uploadError.message : "Failed to upload image" },
        success: false,
      }
    }
  } catch (error) {
    console.error("Unexpected error uploading portfolio image:", error)
    return {
      error: { message: "An unexpected error occurred. Please try again." },
      success: false,
    }
  }
}

export async function addStyleTagAction(formData: FormData) {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" }, success: false }
    }

    const tagName = formData.get("tag_name") as string

    if (!tagName || tagName.trim() === "") {
      return { error: { message: "Tag name is required" }, success: false }
    }

    // Get the current artist profile to access the style_tags array
    const { data: artistProfile, error: profileError } = await supabase
      .from("artist_profiles")
      .select("style_tags")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching artist profile:", profileError)
      return { error: { message: "Failed to fetch artist profile" }, success: false }
    }

    // Check if the tag already exists in the artist's style_tags
    const currentTags = artistProfile?.style_tags || []
    if (currentTags.includes(tagName.trim())) {
      return { error: { message: "This tag already exists" }, success: false }
    }

    // Add the new tag to the style_tags array
    const updatedTags = [...currentTags, tagName.trim()]

    // Update the artist_profiles table with the new style_tags array
    const { error: updateError } = await supabase
      .from("artist_profiles")
      .update({ style_tags: updatedTags })
      .eq("id", user.id)

    if (updateError) {
      console.error("Error updating style tags:", updateError)
      return { error: { message: "Failed to add style tag: " + updateError.message }, success: false }
    }

    revalidatePath("/artist/portfolio")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error adding style tag:", error)
    return {
      error: { message: "An unexpected error occurred. Please try again." },
      success: false,
    }
  }
}

export async function deletePortfolioImageAction(formData: FormData) {
  const supabase = getSupabaseActionClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: { message: "Not authenticated" }, success: false }
    }

    const imageId = formData.get("image_id") as string

    if (!imageId) {
      return { error: { message: "Image ID is required" }, success: false }
    }

    // Get the image to find the URL
    const { data: image, error: fetchError } = await supabase
      .from("portfolio_images")
      .select("image_url")
      .eq("id", imageId)
      .eq("artist_id", user.id)
      .single()

    if (fetchError) {
      console.error("Error fetching portfolio image:", fetchError)
      return { error: { message: "Failed to find image" }, success: false }
    }

    // Delete the image record from the database
    const { error: deleteError } = await supabase
      .from("portfolio_images")
      .delete()
      .eq("id", imageId)
      .eq("artist_id", user.id)

    if (deleteError) {
      console.error("Error deleting portfolio image from database:", deleteError)
      return { error: { message: "Failed to delete image" }, success: false }
    }

    revalidatePath("/artist/portfolio")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error deleting portfolio image:", error)
    return {
      error: { message: "An unexpected error occurred. Please try again." },
      success: false,
    }
  }
}
