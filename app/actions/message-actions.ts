"use server"

import { getSupabaseActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Send a message
export async function sendMessage(senderId: string, recipientId: string, content: string) {
  const supabase = getSupabaseActionClient()

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: senderId,
      recipient_id: recipientId,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    console.error("Error sending message:", error)
    return { error: error.message }
  }

  revalidatePath(`/messages/${recipientId}`)

  return { success: true, message: data[0] }
}

// Get conversation between two users
export async function getConversation(userId: string, otherUserId: string) {
  const supabase = getSupabaseActionClient()

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`,
    )
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching conversation:", error)
    return { error: error.message }
  }

  return { messages: data }
}

// Mark messages as read
export async function markMessagesAsRead(userId: string, senderId: string) {
  const supabase = getSupabaseActionClient()

  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("recipient_id", userId)
    .eq("sender_id", senderId)
    .eq("is_read", false)

  if (error) {
    console.error("Error marking messages as read:", error)
    return { error: error.message }
  }

  revalidatePath(`/messages/${senderId}`)

  return { success: true }
}

// Get user's conversations
export async function getUserConversations(userId: string) {
  const supabase = getSupabaseActionClient()

  // Get all messages where the user is either sender or recipient
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user conversations:", error)
    return { error: error.message }
  }

  // Group messages by conversation partner
  const conversations = new Map()

  for (const message of data) {
    const partnerId = message.sender_id === userId ? message.recipient_id : message.sender_id

    if (!conversations.has(partnerId)) {
      conversations.set(partnerId, {
        partnerId,
        lastMessage: message,
        unreadCount: message.recipient_id === userId && !message.is_read ? 1 : 0,
      })
    } else {
      const conversation = conversations.get(partnerId)

      // Only update last message if this message is newer
      if (new Date(message.created_at) > new Date(conversation.lastMessage.created_at)) {
        conversation.lastMessage = message
      }

      // Count unread messages
      if (message.recipient_id === userId && !message.is_read) {
        conversation.unreadCount++
      }
    }
  }

  // Get user details for conversation partners
  const partnerIds = Array.from(conversations.keys())

  if (partnerIds.length > 0) {
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, full_name, profile_image_url")
      .in("id", partnerIds)

    if (usersError) {
      console.error("Error fetching conversation partners:", usersError)
      return { error: usersError.message }
    }

    // Add user details to conversations
    for (const user of users) {
      const conversation = conversations.get(user.id)
      if (conversation) {
        conversation.partner = user
      }
    }
  }

  return { conversations: Array.from(conversations.values()) }
}
