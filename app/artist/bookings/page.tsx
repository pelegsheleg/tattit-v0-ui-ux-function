"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/contexts/AuthContext"
import { getArtistBookings, updateBookingStatusAction } from "@/app/actions/booking-actions"
import { Calendar, Clock, MapPin, Check, X, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function ArtistBookingsPage() {
  const { userId } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<any[]>([])
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    const loadBookings = async () => {
      if (!userId) return

      try {
        const { bookings: bookingsData, error } = await getArtistBookings(userId)

        if (error) throw error
        setBookings(bookingsData || [])
      } catch (error) {
        console.error("Error loading bookings:", error)
        toast({
          title: "Error",
          description: "Failed to load bookings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [userId, toast])

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    if (!userId) return

    setUpdatingStatus(bookingId)

    try {
      const formData = new FormData()
      formData.append("booking_id", bookingId)
      formData.append("status", status)

      const result = await updateBookingStatusAction(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: `Booking ${status === "confirmed" ? "confirmed" : "cancelled"}`,
        })

        // Update the booking in the state
        setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)))
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to ${status === "confirmed" ? "confirm" : "cancel"} booking`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating booking status:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  // Group bookings by status
  const pendingBookings = bookings.filter((booking) => booking.status === "pending")
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed")
  const pastBookings = bookings.filter((booking) => {
    const bookingDate = new Date(`${booking.booking_date}T${booking.end_time}`)
    return bookingDate < new Date()
  })
  const cancelledBookings = bookings.filter((booking) => booking.status === "cancelled")

  const renderBookingCard = (booking: any) => {
    const bookingDate = new Date(booking.booking_date)
    const isPast = new Date(`${booking.booking_date}T${booking.end_time}`) < new Date()

    return (
      <Card key={booking.id} className="mb-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={booking.client?.profile_image_url || ""} />
                <AvatarFallback>{booking.client?.full_name?.charAt(0) || "C"}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{booking.client?.full_name || "Client"}</h3>
                <p className="text-sm text-gray-500">
                  {bookingDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
            <Badge
              className={
                booking.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : booking.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <span>
                {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
              </span>
            </div>

            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <span>Your Studio</span>
            </div>
          </div>

          {booking.notes && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm">{booking.notes}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/messages/${booking.client_id}`}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Client
              </Link>
            </Button>

            {booking.status === "pending" && !isPast && (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                  disabled={updatingStatus === booking.id}
                >
                  <X className="h-4 w-4 mr-2" />
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                  disabled={updatingStatus === booking.id}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
              </div>
            )}

            {booking.status === "confirmed" && !isPast && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                disabled={updatingStatus === booking.id}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-gray-500">Manage your client consultations and appointments</p>
        </div>

        <Button onClick={() => router.push("/artist/availability")}>
          <Calendar className="mr-2 h-4 w-4" />
          Manage Availability
        </Button>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed (
            {
              confirmedBookings.filter((b) => {
                const bookingDate = new Date(`${b.booking_date}T${b.end_time}`)
                return bookingDate >= new Date()
              }).length
            }
            )
          </TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : pendingBookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No pending bookings</p>
            </div>
          ) : (
            pendingBookings.map(renderBookingCard)
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="mt-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : confirmedBookings.filter((b) => {
              const bookingDate = new Date(`${b.booking_date}T${b.end_time}`)
              return bookingDate >= new Date()
            }).length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No upcoming confirmed bookings</p>
            </div>
          ) : (
            confirmedBookings
              .filter((b) => {
                const bookingDate = new Date(`${b.booking_date}T${b.end_time}`)
                return bookingDate >= new Date()
              })
              .map(renderBookingCard)
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : pastBookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No past bookings</p>
            </div>
          ) : (
            pastBookings.map(renderBookingCard)
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : cancelledBookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No cancelled bookings</p>
            </div>
          ) : (
            cancelledBookings.map(renderBookingCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
