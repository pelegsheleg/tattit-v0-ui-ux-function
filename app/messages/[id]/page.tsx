import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient()
  const otherUserId = params.id

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fallback for demo/development
  const userId = user?.id || "demo-user"

  // Fetch the other user's details
  const { data: otherUser } = await supabase
    .from("users")
    .select("id, full_name, profile_image_url, user_role")
    .eq("id", otherUserId)
    .single()

  if (!otherUser) {
    return notFound()
  }

  // Fetch messages between the two users
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`,
    )
    .order("created_at", { ascending: true })

  // Mark unread messages as read
  if (messages && messages.length > 0) {
    const unreadMessageIds = messages.filter((msg) => msg.recipient_id === userId && !msg.is_read).map((msg) => msg.id)

    if (unreadMessageIds.length > 0) {
      await supabase.from("messages").update({ is_read: true }).in("id", unreadMessageIds)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/messages" className="text-sm text-muted-foreground hover:text-foreground mr-2">
                ← Back
              </Link>
              <Avatar>
                <AvatarImage
                  src={otherUser.profile_image_url || "/placeholder.svg?height=40&width=40&query=user"}
                  alt={otherUser.full_name}
                />
                <AvatarFallback>{otherUser.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{otherUser.full_name}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">{otherUser.user_role}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 h-[400px] overflow-y-auto flex flex-col gap-3">
          {messages && messages.length > 0 ? (
            messages.map((message) => {
              const isCurrentUser = message.sender_id === userId
              return (
                <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t p-4">
          <form className="flex w-full gap-2" action="/api/messages/send">
            <input type="hidden" name="recipientId" value={otherUserId} />
            <Input name="message" placeholder="Type your message..." className="flex-1" required />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
