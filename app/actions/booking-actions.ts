"use server"

import { getSupabaseActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"
import { sendBookingConfirmationEmail } from "@/lib/email"

// Create a new booking
export async function createBooking(bookingData: {
  clientId: string
  artistId: string
  bookingDate: string
  startTime: string
  endTime: string
  status: string
  notes?: string
}) {
  const supabase = getSupabaseActionClient()

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      client_id: bookingData.clientId,
      artist_id: bookingData.artistId,
      booking_date: bookingData.bookingDate,
      start_time: bookingData.startTime,
      end_time: bookingData.endTime,
      status: bookingData.status,
      notes: bookingData.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    console.error("Error creating booking:", error)
    return { error: error.message }
  }

  revalidatePath(`/client/bookings`)
  revalidatePath(`/artists/${bookingData.artistId}/bookings`)

  return { success: true, booking: data[0] }
}

// Get client bookings
export async function getClientBookings(clientId: string) {
  const supabase = getSupabaseActionClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      artist:artist_id (
        id,
        full_name,
        profile_image_url,
        artist_profiles (*)
      )
    `)
    .eq("client_id", clientId)
    .order("booking_date", { ascending: true })

  if (error) {
    console.error("Error fetching client bookings:", error)
    return { error: error.message }
  }

  return { bookings: data }
}

// Get artist bookings
export async function getArtistBookings(artistId: string) {
  const supabase = getSupabaseActionClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      client:client_id (
        id,
        full_name,
        profile_image_url
      )
    `)
    .eq("artist_id", artistId)
    .order("booking_date", { ascending: true })

  if (error) {
    console.error("Error fetching artist bookings:", error)
    return { error: error.message }
  }

  return { bookings: data }
}

// Update booking status
export async function updateBookingStatusAction(formData: FormData) {
  const session = await getSession()
  if (!session?.user) {
    return { success: false, error: "Not authenticated" }
  }

  const bookingId = formData.get("booking_id") as string
  const status = formData.get("status") as string

  if (!bookingId || !status) {
    return { success: false, error: "Missing required fields" }
  }

  try {
    const supabase = getSupabaseActionClient()

    // Get the booking to check permissions
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single()

    if (bookingError) {
      throw bookingError
    }

    // Check if user is the artist for this booking
    if (booking.artist_id !== session.user.id) {
      return { success: false, error: "You are not authorized to update this booking" }
    }

    // Update the booking status
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)

    if (updateError) {
      throw updateError
    }

    // If the booking is confirmed, send a confirmation email
    if (status === "confirmed") {
      // Get client and artist details for the email
      const { data: clientData } = await supabase
        .from("users")
        .select("email, full_name")
        .eq("id", booking.client_id)
        .single()

      const { data: artistData } = await supabase.from("users").select("full_name").eq("id", booking.artist_id).single()

      if (clientData && artistData) {
        await sendBookingConfirmationEmail({
          clientEmail: clientData.email,
          clientName: clientData.full_name,
          artistName: artistData.full_name,
          bookingDate: booking.booking_date,
          startTime: booking.start_time,
          endTime: booking.end_time,
        })
      }
    }

    revalidatePath(`/client/bookings`)
    revalidatePath(`/artist/bookings`)

    return { success: true }
  } catch (error) {
    console.error("Error updating booking status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
