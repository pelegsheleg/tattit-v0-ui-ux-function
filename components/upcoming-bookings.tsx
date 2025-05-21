import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function UpcomingBookings({ bookings, error }) {
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error loading bookings: {error}</p>
      </div>
    )
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 mb-4">No upcoming bookings</p>
        <Button asChild>
          <Link href="/artist/availability">Set Your Availability</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.slice(0, 5).map((booking) => (
        <Card key={booking.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{booking.client?.full_name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(booking.booking_date).toLocaleDateString()} at {booking.start_time.substring(0, 5)} -{" "}
                  {booking.end_time.substring(0, 5)}
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
          <Link href="/artist/bookings">View all bookings</Link>
        </Button>
      </div>
    </div>
  )
}
