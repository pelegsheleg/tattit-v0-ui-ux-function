"use server"

import { sendMessage, markMessagesAsRead } from "@/lib/services/messaging"
import { uploadImage } from "@/lib/blob"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"

export async function sendMessageAction(formData: FormData) {
  const session = await getSession()
  if (!session?.user) {
    return { success: false, error: "Not authenticated" }
  }

  const senderId = session.user.id
  const recipientId = formData.get("recipient_id") as string
  const content = formData.get("content") as string
  const hasImage = formData.get("has_image") === "true"
  const file = formData.get("file") as File | null

  // Validate recipient ID - ensure it's a valid format
  if (!recipientId || typeof recipientId !== "string") {
    console.error("Missing or invalid recipient ID:", recipientId)
    return { success: false, error: "Missing or invalid recipient ID" }
  }

  // Log the recipient ID for debugging
  console.log("Processing message to recipient:", recipientId)

  if (!content && !hasImage) {
    return { success: false, error: "Message content is required" }
  }

  try {
    let imageUrl = null

    // If there's an image, upload it first
    if (hasImage && file) {
      const uploadResult = await uploadImage(file, `messages/${senderId}`)

      if (!uploadResult.success || !uploadResult.url) {
        return { success: false, error: uploadResult.error || "Failed to upload image" }
      }

      imageUrl = uploadResult.url
    }

    // Send the message with or without image
    const result = await sendMessage(senderId, recipientId, content, imageUrl)

    revalidatePath(`/messages/${recipientId}`)

    return {
      success: !result.error,
      error: result.error?.message,
    }
  } catch (error) {
    console.error("Error in sendMessageAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function markMessagesAsReadAction(formData: FormData) {
  const session = await getSession()
  if (!session?.user) {
    return { success: false, error: "Not authenticated" }
  }

  const userId = session.user.id
  const otherUserId = formData.get("other_user_id") as string

  if (!otherUserId) {
    return { success: false, error: "Missing required fields" }
  }

  const result = await markMessagesAsRead(userId, otherUserId)

  if (result.success && result.cacheKeys) {
    // Revalidate paths
    revalidatePath(`/messages/${otherUserId}`)
  }

  return {
    success: result.success,
    error: result.error?.message,
  }
}
