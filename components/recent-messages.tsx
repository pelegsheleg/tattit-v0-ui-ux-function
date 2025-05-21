import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function RecentMessages({ conversations, error }) {
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error loading messages: {error}</p>
      </div>
    )
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 mb-4">No messages yet</p>
        <Button asChild>
          <Link href="/messages">Check Messages</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {conversations.slice(0, 5).map((conversation) => (
        <Card key={conversation.partnerId}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {conversation.partner?.profile_image_url ? (
                      <img
                        src={conversation.partner.profile_image_url || "/placeholder.svg"}
                        alt={conversation.partner.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      conversation.partner?.full_name?.charAt(0) || "?"
                    )}
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{conversation.partner?.full_name}</p>
                  <p className="text-sm text-gray-500 truncate max-w-[200px]">{conversation.lastMessage.content}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(conversation.lastMessage.created_at).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="text-center">
        <Button asChild variant="outline">
          <Link href="/messages">View all messages</Link>
        </Button>
      </div>
    </div>
  )
}
