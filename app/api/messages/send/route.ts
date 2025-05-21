import { getSupabaseActionClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const recipientId = formData.get("recipientId") as string
    const message = formData.get("message") as string

    if (!recipientId || !message) {
      return NextResponse.json({ error: "Recipient ID and message are required" }, { status: 400 })
    }

    const supabase = getSupabaseActionClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Insert the message
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: user.id,
        recipient_id: recipientId,
        content: message,
        is_read: false,
      })
      .select()

    if (error) {
      console.error("Error sending message:", error)
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }

    return NextResponse.redirect(new URL(`/messages/${recipientId}`, request.url), 303)
  } catch (error) {
    console.error("Exception in message sending:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
