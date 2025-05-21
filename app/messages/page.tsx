import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function MessagesPage() {
  const supabase = getSupabaseServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fallback for demo/development
  const userId = user?.id || "demo-user"

  // Fetch all messages where the current user is either sender or recipient
  let messages = []
  try {
    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .select(`
        id,
        sender_id,
        recipient_id,
        content,
        is_read,
        created_at,
        sender:sender_id(full_name, profile_image_url),
        recipient:recipient_id(full_name, profile_image_url)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order("created_at", { ascending: false })

    if (messagesError) {
      console.error("Error fetching messages:", messagesError)
      return (
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Messages</h1>
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <h3 className="text-xl font-medium mb-2">Error loading messages</h3>
                <p className="text-gray-500 mb-4">There was a problem loading your messages. Please try again later.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    messages = messagesData || []
  } catch (error) {
    console.error("Exception fetching messages:", error)
  }

  // Group messages by conversation partner
  const conversations = {}
  messages.forEach((message) => {
    // Determine the other user in the conversation (not the current user)
    const isUserSender = message.sender_id === userId
    const otherUserId = isUserSender ? message.recipient_id : message.sender_id
    const otherUser = isUserSender ? message.recipient : message.sender

    if (!conversations[otherUserId]) {
      conversations[otherUserId] = {
        userId: otherUserId,
        userName: otherUser?.full_name || "Unknown User",
        userImage: otherUser?.profile_image_url,
        lastMessage: message.content,
        lastMessageTime: message.created_at,
        unreadCount: isUserSender ? 0 : message.is_read ? 0 : 1,
      }
    } else {
      // Only update if this message is more recent
      const existingTime = new Date(conversations[otherUserId].lastMessageTime).getTime()
      const currentTime = new Date(message.created_at).getTime()

      if (currentTime > existingTime) {
        conversations[otherUserId].lastMessage = message.content
        conversations[otherUserId].lastMessageTime = message.created_at
      }

      // Count unread messages
      if (!isUserSender && !message.is_read) {
        conversations[otherUserId].unreadCount += 1
      }
    }
  })

  // Convert to array and sort by most recent message
  const conversationsList = Object.values(conversations).sort((a, b) => {
    return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      {conversationsList.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h3 className="text-xl font-medium mb-2">No messages yet</h3>
              <p className="text-gray-500 mb-4">You don't have any conversations yet. Start by contacting an artist.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {conversationsList.map((conversation) => (
            <Link href={`/messages/${conversation.userId}`} key={conversation.userId}>
              <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={conversation.userImage || "/placeholder.svg?height=40&width=40&query=user"}
                          alt={conversation.userName}
                        />
                        <AvatarFallback>{conversation.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{conversation.userName}</CardTitle>
                        <CardDescription>{new Date(conversation.lastMessageTime).toLocaleString()}</CardDescription>
                      </div>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 truncate">{conversation.lastMessage}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
