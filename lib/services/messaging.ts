import { fetchData, insertData } from "@/lib/data"
import type { Database } from "@/types/supabase"
import { getSupabaseServerClient } from "@/lib/supabase/server"

type Message = Database["public"]["Tables"]["messages"]["Row"]

// Get conversation between two users
export async function getConversation(userId: string, otherUserId: string) {
  return fetchData<Message[]>(
    "messages",
    (supabase) =>
      supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .or(`sender_id.eq.${otherUserId},recipient_id.eq.${otherUserId}`)
        .order("created_at", { ascending: true }),
    `conversation:${userId}:${otherUserId}`,
  )
}

// Get all conversations for a user
export async function getUserConversations(userId: string) {
  const supabase = getSupabaseServerClient()

  // This is a more complex query that would typically be done with a stored procedure
  // For simplicity, we'll just get the most recent message from each conversation
  const { data, error } = await supabase.rpc("get_user_conversations", {
    user_id: userId,
  })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

// Send a message
export async function sendMessage(
  senderId: string,
  recipientId: string,
  content: string,
  imageUrl: string | null = null,
) {
  try {
    // For development/demo purposes, we'll accept any ID format
    // In production, you would want to validate IDs more strictly
    console.log(`Sending message from ${senderId} to ${recipientId}`)

    return await insertData<Message>(
      "messages",
      {
        sender_id: senderId,
        recipient_id: recipientId,
        content,
        image_url: imageUrl,
        is_read: false,
      },
      [
        `conversation:${senderId}:${recipientId}`,
        `user:${senderId}:conversations`,
        `user:${recipientId}:conversations`,
      ],
    )
  } catch (error) {
    console.error("Error sending message:", error)
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) }
  }
}

// Mark messages as read
export async function markMessagesAsRead(userId: string, otherUserId: string) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("recipient_id", userId)
    .eq("sender_id", otherUserId)
    .eq("is_read", false)

  if (error) {
    return { success: false, error }
  }

  // Invalidate caches
  return {
    success: true,
    cacheKeys: [`conversation:${userId}:${otherUserId}`, `user:${userId}:conversations`],
  }
}
