"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Clock, Calendar } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface AvailabilitySectionProps {
  onChange?: () => void
}

export function AvailabilitySection({ onChange }: AvailabilitySectionProps) {
  const [schedule, setSchedule] = useState([
    { day: "Monday", isAvailable: true, timeSlots: [{ start: "10:00", end: "18:00" }] },
    { day: "Tuesday", isAvailable: true, timeSlots: [{ start: "10:00", end: "18:00" }] },
    { day: "Wednesday", isAvailable: true, timeSlots: [{ start: "10:00", end: "18:00" }] },
    { day: "Thursday", isAvailable: true, timeSlots: [{ start: "10:00", end: "18:00" }] },
    { day: "Friday", isAvailable: true, timeSlots: [{ start: "10:00", end: "18:00" }] },
    { day: "Saturday", isAvailable: true, timeSlots: [{ start: "12:00", end: "16:00" }] },
    { day: "Sunday", isAvailable: false, timeSlots: [] },
  ])

  const [availabilityNotes, setAvailabilityNotes] = useState(
    "I require a 48-hour notice for booking appointments. For large or complex projects, a consultation is required before booking. Cancellations must be made at least 24 hours in advance.",
  )

  const [bookingLeadTime, setBookingLeadTime] = useState("2 weeks")

  useEffect(() => {
    onChange?.()
  }, [schedule, availabilityNotes, bookingLeadTime, onChange])

  const handleDayToggle = (dayIndex: number, isAvailable: boolean) => {
    const updatedSchedule = [...schedule]
    updatedSchedule[dayIndex].isAvailable = isAvailable

    // If toggling to available and no time slots, add a default one
    if (isAvailable && updatedSchedule[dayIndex].timeSlots.length === 0) {
      updatedSchedule[dayIndex].timeSlots = [{ start: "10:00", end: "18:00" }]
    }

    setSchedule(updatedSchedule)
    onChange?.()
  }

  const handleTimeSlotChange = (dayIndex: number, slotIndex: number, field: "start" | "end", value: string) => {
    const updatedSchedule = [...schedule]
    updatedSchedule[dayIndex].timeSlots[slotIndex][field] = value
    setSchedule(updatedSchedule)
    onChange?.()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-purple-200">Weekly Schedule</CardTitle>
            <CardDescription className="text-purple-400">Set your regular working hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedule.map((day, dayIndex) => (
                <div key={day.day} className="border border-purple-500/20 rounded-lg p-4 bg-black/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <h4 className="font-medium text-white">{day.day}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`available-${day.day}`} className="text-purple-300">
                        Available
                      </Label>
                      <Switch
                        id={`available-${day.day}`}
                        checked={day.isAvailable}
                        onCheckedChange={(checked) => handleDayToggle(dayIndex, checked)}
                        className="data-[state=checked]:bg-purple-700"
                      />
                    </div>
                  </div>

                  {day.isAvailable && (
                    <div className="space-y-3">
                      {day.timeSlots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center space-x-2 bg-black/30 p-2 rounded-lg">
                          <Clock className="h-4 w-4 text-purple-400" />
                          <div className="flex items-center space-x-2">
                            <input
                              type="time"
                              value={slot.start}
                              onChange={(e) => handleTimeSlotChange(dayIndex, slotIndex, "start", e.target.value)}
                              className="bg-black/40 border-purple-500/30 rounded-md p-1 text-white"
                            />
                            <span className="text-purple-300">to</span>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={(e) => handleTimeSlotChange(dayIndex, slotIndex, "end", e.target.value)}
                              className="bg-black/40 border-purple-500/30 rounded-md p-1 text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!day.isAvailable && <p className="text-purple-400 italic">Not available</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-purple-200">Booking Preferences</CardTitle>
            <CardDescription className="text-purple-400">Set your booking policies and lead time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border border-purple-500/20 rounded-lg p-4 bg-black/30">
              <h4 className="font-medium text-white mb-3">Booking Lead Time</h4>
              <select
                value={bookingLeadTime}
                onChange={(e) => {
                  setBookingLeadTime(e.target.value)
                  onChange?.()
                }}
                className="w-full bg-black/40 border-purple-500/30 rounded-md p-2 text-white"
              >
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="3 weeks">3 weeks</option>
                <option value="1 month">1 month</option>
                <option value="2 months">2 months</option>
                <option value="3 months">3 months</option>
              </select>
            </div>

            <div className="border border-purple-500/20 rounded-lg p-4 bg-black/30">
              <h4 className="font-medium text-white mb-3">Booking Notes & Policies</h4>
              <Textarea
                value={availabilityNotes}
                onChange={(e) => {
                  setAvailabilityNotes(e.target.value)
                  onChange?.()
                }}
                rows={6}
                className="bg-black/40 border-purple-500/30 focus:border-purple-400"
                placeholder="Enter your booking policies, cancellation policy, etc."
              />
            </div>

            <div className="border border-purple-500/20 rounded-lg p-4 bg-black/30">
              <h4 className="font-medium text-white mb-3">Calendar Integration</h4>
              <p className="text-purple-300 mb-4">Connect your calendar to automatically sync your bookings.</p>
              <Button variant="outline" className="bg-black/40 border-purple-500/30 hover:bg-purple-900/20">
                <Calendar className="mr-2 h-4 w-4" />
                Connect Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
