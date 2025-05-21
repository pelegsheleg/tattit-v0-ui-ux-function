"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { createBooking } from "@/app/actions/booking-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"

export function BookingForm({ artistId }) {
  const [date, setDate] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    // In a real app, you would get the client ID from auth context
    const clientId = "client1_id" // Placeholder

    const bookingData = {
      clientId,
      artistId,
      bookingDate: format(date, "yyyy-MM-dd"),
      startTime: data.startTime,
      endTime: data.endTime,
      status: "pending", // Assuming "pending" is an allowed status
      notes: data.notes,
    }

    try {
      const { success, error } = await createBooking(bookingData)

      if (error) {
        toast({
          title: "Error",
          description: `Failed to create booking: ${error}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Your booking request has been sent",
        })

        // Reset form
        setDate(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Book a Consultation</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date">Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <Input id="startTime" type="time" {...register("startTime", { required: true })} />
            </div>
            {errors.startTime && <p className="text-red-500 text-sm">Start time is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <Input id="endTime" type="time" {...register("endTime", { required: true })} />
            </div>
            {errors.endTime && <p className="text-red-500 text-sm">End time is required</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea id="notes" placeholder="Describe what you're looking for..." {...register("notes")} />
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Request Booking"}
        </Button>
      </form>
    </div>
  )
}
