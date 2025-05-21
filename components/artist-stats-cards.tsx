import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MessageCircle, Users } from "lucide-react"
import Link from "next/link"

export function ArtistStatsCards({ upcomingBookings, unreadMessages, portfolioViews }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Upcoming Bookings</CardTitle>
          <CardDescription className="text-2xl font-bold">{upcomingBookings}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/artist/bookings">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Unread Messages</CardTitle>
          <CardDescription className="text-2xl font-bold">{unreadMessages}</CardDescription>
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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Portfolio Views</CardTitle>
          <CardDescription className="text-2xl font-bold">{portfolioViews}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/artist/analytics">
              <Users className="mr-2 h-4 w-4" />
              View Analytics
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
