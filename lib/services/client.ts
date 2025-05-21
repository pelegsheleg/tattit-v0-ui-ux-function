import { fetchData, insertData, updateData, deleteData } from "@/lib/data"
import { uploadImage, deleteImage } from "@/lib/blob"
import type { Database } from "@/types/supabase"
import { getSupabaseServerClient } from "@/lib/supabase/server"

type ClientPreferences = Database["public"]["Tables"]["client_preferences"]["Row"]
type ReferenceImage = Database["public"]["Tables"]["client_reference_images"]["Row"]

// Get client preferences
export async function getClientPreferences(clientId: string) {
  return fetchData<ClientPreferences>(
    "client_preferences",
    (supabase) => supabase.from("client_preferences").select("*").eq("id", clientId).single(),
    `client:${clientId}:preferences`,
  )
}

// Update client preferences
export async function updateClientPreferences(clientId: string, data: Partial<ClientPreferences>) {
  return updateData<ClientPreferences>(
    "client_preferences",
    clientId,
    { ...data, updated_at: new Date().toISOString() },
    "id",
    [`client:${clientId}:preferences`],
  )
}

// Get client reference images
export async function getClientReferenceImages(clientId: string) {
  return fetchData<ReferenceImage[]>(
    "client_reference_images",
    (supabase) => supabase.from("client_reference_images").select("*").eq("client_id", clientId),
    `client:${clientId}:reference_images`,
  )
}

// Upload reference image
export async function uploadReferenceImage(clientId: string, file: File) {
  const uploadResult = await uploadImage(file, `references/${clientId}`)

  if (!uploadResult.success || !uploadResult.url) {
    return { success: false, error: uploadResult.error || "Upload failed" }
  }

  // Insert the new image
  const { data, error } = await insertData<ReferenceImage>(
    "client_reference_images",
    {
      client_id: clientId,
      image_url: uploadResult.url,
    },
    [`client:${clientId}:reference_images`],
  )

  if (error) {
    // Clean up the uploaded image if database insert fails
    await deleteImage(uploadResult.url)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

// Delete reference image
export async function deleteReferenceImage(imageId: number) {
  const supabase = getSupabaseServerClient()
  const { data: image } = await supabase
    .from("client_reference_images")
    .select("client_id, image_url")
    .eq("id", imageId)
    .single()

  if (!image) {
    return { success: false, error: new Error("Image not found") }
  }

  // Delete from database
  const { success, error } = await deleteData("client_reference_images", imageId, "id", [
    `client:${image.client_id}:reference_images`,
  ])

  if (!success) {
    return { success: false, error }
  }

  // Delete from blob storage
  await deleteImage(image.image_url)

  return { success: true }
}

// Like or unlike an artist
export async function toggleLikeArtist(clientId: string, artistId: string, liked: boolean) {
  const supabase = getSupabaseServerClient()

  // Check if a match record already exists
  const { data: existingMatch } = await supabase
    .from("matches")
    .select("id, artist_liked")
    .eq("client_id", clientId)
    .eq("artist_id", artistId)
    .single()

  if (existingMatch) {
    // Update existing match
    return updateData(
      "matches",
      existingMatch.id,
      {
        client_liked: liked,
        updated_at: new Date().toISOString(),
      },
      "id",
      [`client:${clientId}:liked_artists`],
    )
  } else {
    // Create new match
    return insertData(
      "matches",
      {
        client_id: clientId,
        artist_id: artistId,
        client_liked: liked,
        artist_liked: false,
        match_score: null,
      },
      [`client:${clientId}:liked_artists`],
    )
  }
}

// Get liked artists
export async function getLikedArtists(clientId: string) {
  return fetchData(
    "matches",
    (supabase) =>
      supabase
        .from("matches")
        .select(`
        *,
        artist:artist_id(
          id,
          users!inner(full_name, email),
          artist_profiles!inner(*),
          artist_portfolio(image_url, is_primary)
        )
      `)
        .eq("client_id", clientId)
        .eq("client_liked", true),
    `client:${clientId}:liked_artists`,
  )
}
