"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/contexts/AuthContext"
import { getArtistBookings } from "@/app/actions/booking-actions"
import { updateAvailabilityAction } from "@/app/actions/availability-actions"
import { Plus, Clock, Users, Check } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Set up the localizer for react-big-calendar
const locales = {
  "en-US": require("date-fns/locale/en-US"),
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Time slot options
const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0")
  return { value: `${hour}:00`, label: `${hour}:00` }
})

export default function ArtistAvailabilityPage() {
  const { userId } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<any[]>([])
  const [availabilityRules, setAvailabilityRules] = useState<any[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string>("monday")
  const [startTime, setStartTime] = useState<string>("09:00")
  const [endTime, setEndTime] = useState<string>("17:00")
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!userId) return

      try {
        // Load bookings
        const { bookings: bookingsData, error: bookingsError } = await getArtistBookings(userId)

        if (bookingsError) throw bookingsError

        // Format bookings for the calendar
        const formattedBookings = (bookingsData || []).map((booking) => ({
          id: booking.id,
          title: `Booking: ${booking.client?.full_name || "Client"}`,
          start: new Date(`${booking.booking_date}T${booking.start_time}`),
          end: new Date(`${booking.booking_date}T${booking.end_time}`),
          status: booking.status,
        }))

        setBookings(formattedBookings)

        // Load availability rules
        const { data: availabilityData, error: availabilityError } = await supabase
          .from("artist_availability")
          .select("*")
          .eq("artist_id", userId)

        if (availabilityError) throw availabilityError
        setAvailabilityRules(availabilityData || [])
      } catch (error) {
        console.error("Error loading availability data:", error)
        toast({
          title: "Error",
          description: "Failed to load availability data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userId, toast])

  const handleAddAvailability = async () => {
    if (!userId) return

    try {
      const formData = new FormData()
      formData.append("day_of_week", selectedDay)
      formData.append("start_time", startTime)
      formData.append("end_time", endTime)
      formData.append("is_available", isAvailable.toString())

      const result = await updateAvailabilityAction(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Availability updated successfully",
        })

        // Refresh the availability rules
        const { data: availabilityData } = await supabase
          .from("artist_availability")
          .select("*")
          .eq("artist_id", userId)

        setAvailabilityRules(availabilityData || [])
        setShowAddDialog(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update availability",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating availability:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  // Get events for the calendar (bookings + availability)
  const calendarEvents = [
    ...bookings,
    // Add recurring availability slots
    ...availabilityRules
      .filter((rule) => rule.is_available)
      .flatMap((rule) => {
        // Generate events for the next 4 weeks
        const events = []
        const dayIndex = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(
          rule.day_of_week.toLowerCase(),
        )

        if (dayIndex === -1) return []

        const today = new Date()
        const startOfDay = new Date(today)
        startOfDay.setHours(0, 0, 0, 0)

        // Find the next occurrence of this day
        const nextDay = new Date(startOfDay)
        nextDay.setDate(nextDay.getDate() + ((dayIndex + 7 - nextDay.getDay()) % 7))

        // Generate 4 weeks of availability
        for (let i = 0; i < 4; i++) {
          const startDateTime = new Date(nextDay)
          const [startHour, startMinute] = rule.start_time.split(":").map(Number)
          startDateTime.setHours(startHour, startMinute, 0, 0)

          const endDateTime = new Date(nextDay)
          const [endHour, endMinute] = rule.end_time.split(":").map(Number)
          endDateTime.setHours(endHour, endMinute, 0, 0)

          events.push({
            id: `availability-${rule.id}-${i}`,
            title: "Available",
            start: startDateTime,
            end: endDateTime,
            isAvailability: true,
          })

          // Move to next week
          nextDay.setDate(nextDay.getDate() + 7)
        }

        return events
      }),
  ]

  // Custom event styling
  const eventStyleGetter = (event: any) => {
    if (event.isAvailability) {
      return {
        style: {
          backgroundColor: "#10b981",
          borderColor: "#059669",
        },
      }
    }

    if (event.status === "confirmed") {
      return {
        style: {
          backgroundColor: "#3b82f6",
          borderColor: "#2563eb",
        },
      }
    }

    if (event.status === "pending") {
      return {
        style: {
          backgroundColor: "#f59e0b",
          borderColor: "#d97706",
        },
      }
    }

    return {}
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Availability Management</h1>
          <p className="text-gray-500">Set your working hours and manage bookings</p>
        </div>

        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Availability
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Upcoming Bookings</CardTitle>
            <div className="text-2xl font-bold">{bookings.filter((b) => new Date(b.start) > new Date()).length}</div>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/artist/bookings")}>
              <Users className="mr-2 h-4 w-4" />
              View All Bookings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available Hours/Week</CardTitle>
            <div className="text-2xl font-bold">
              {availabilityRules
                .filter((rule) => rule.is_available)
                .reduce((total, rule) => {
                  const [startHour, startMinute] = rule.start_time.split(":").map(Number)
                  const [endHour, endMinute] = rule.end_time.split(":").map(Number)
                  const hours = endHour - startHour + (endMinute - startMinute) / 60
                  return total + hours
                }, 0)
                .toFixed(1)}
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setShowAddDialog(true)}>
              <Clock className="mr-2 h-4 w-4" />
              Manage Hours
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Booking Rate</CardTitle>
            <div className="text-2xl font-bold">
              {bookings.length > 0
                ? `${Math.round((bookings.filter((b) => b.status === "confirmed").length / bookings.length) * 100)}%`
                : "N/A"}
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/artist/analytics")}>
              <Check className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              eventPropGetter={eventStyleGetter}
              views={["month", "week", "day"]}
              defaultView="week"
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Availability</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day of Week</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isAvailable" checked={isAvailable} onCheckedChange={setIsAvailable} />
              <Label htmlFor="isAvailable">
                {isAvailable ? "Available during this time" : "Unavailable during this time"}
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAvailability}>Save Availability</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
