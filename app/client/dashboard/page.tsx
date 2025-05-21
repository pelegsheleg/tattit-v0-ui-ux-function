import { requireClient } from "@/lib/auth"
import { getClientBookings } from "@/app/actions/booking-actions"
import { getUserConversations } from "@/app/actions/message-actions"
import { findMatchingArtists } from "@/app/actions/client-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageCircle, Search, Settings } from "lucide-react"
import { ArtistCard } from "@/components/artist-card"
import Link from "next/link"

export default async function ClientDashboardPage() {
  const { user } = await requireClient()

  // Get client's bookings
  const { bookings, error: bookingsError } = await getClientBookings(user.id)

  // Get client's conversations
  const { conversations, error: conversationsError } = await getUserConversations(user.id)

  // Get matching artists
  const { artists, error: artistsError } = await findMatchingArtists(user.id)

  // Count upcoming bookings
  const upcomingBookings =
    bookings?.filter((booking) => new Date(booking.booking_date) >= new Date() && booking.status !== "cancelled") || []

  // Count unread messages
  const unreadCount = conversations?.reduce((count, conversation) => count + conversation.unreadCount, 0) || 0

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Client Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user.full_name}</p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/client/preferences">
              <Settings className="mr-2 h-4 w-4" />
              Edit Preferences
            </Link>
          </Button>

          <Button asChild>
            <Link href="/artists">
              <Search className="mr-2 h-4 w-4" />
              Find Artists
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Upcoming Bookings</CardTitle>
            <CardDescription className="text-2xl font-bold">{upcomingBookings.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/client/bookings">
                <Calendar className="mr-2 h-4 w-4" />
                View Bookings
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Unread Messages</CardTitle>
            <CardDescription className="text-2xl font-bold">{unreadCount}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/messages">
                <MessageCircle className="mr-2 h-4 w-4" />
                View Messages
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="matches">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matches">Artist Matches</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Artists Matching Your Preferences</h2>

          {artistsError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Error loading artist matches: {artistsError}</p>
            </div>
          ) : artists && artists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists.slice(0, 3).map((artist) => (
                <div key={artist.id} className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-green-100 text-green-800">{artist.matchPercentage}% Match</Badge>
                  </div>
                  <ArtistCard artist={artist} />
                </div>
              ))}

              <div className="col-span-full text-center mt-4">
                <Button asChild>
                  <Link href="/client/matches">View All Matches</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No artist matches found</p>
              <Button asChild>
                <Link href="/client/preferences">Update Your Preferences</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookings" className="mt-6">
          {bookingsError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Error loading bookings: {bookingsError}</p>
            </div>
          ) : upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.slice(0, 5).map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{booking.artist?.full_name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.booking_date).toLocaleDateString()} at {booking.start_time.substring(0, 5)}{" "}
                          - {booking.end_time.substring(0, 5)}
                        </p>
                      </div>
                      <Badge
                        className={
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="text-center">
                <Button asChild variant="outline">
                  <Link href="/client/bookings">View all bookings</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No upcoming bookings</p>
              <Button asChild>
                <Link href="/artists">Find Artists</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          {conversationsError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Error loading messages: {conversationsError}</p>
            </div>
          ) : conversations && conversations.length > 0 ? (
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
                          <p className="text-sm text-gray-500 truncate max-w-[200px]">
                            {conversation.lastMessage.content}
                          </p>
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
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No messages yet</p>
              <Button asChild>
                <Link href="/messages">Check Messages</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
