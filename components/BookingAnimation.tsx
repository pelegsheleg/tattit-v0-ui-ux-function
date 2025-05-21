"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Check, Clock } from "lucide-react"
import confetti from "canvas-confetti"

interface BookingAnimationProps {
  artistName: string
  onClose: () => void
}

export default function BookingAnimation({ artistName, onClose }: BookingAnimationProps) {
  const [step, setStep] = useState(1)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsComplete(true)

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  return (
    <div className="p-4">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-center">Book a Consultation with {artistName}</h3>
            <p className="text-center text-purple-300">Select a date for your consultation</p>

            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border border-purple-500/30 bg-purple-900/20"
                disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              />
            </div>

            <Button onClick={() => setStep(2)} disabled={!date} className="w-full bg-purple-700 hover:bg-purple-600">
              Continue
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="p-0 h-8 w-8">
                ←
              </Button>
              <h3 className="text-xl font-bold">Select a Time</h3>
            </div>

            <div className="flex items-center gap-2 bg-purple-900/20 p-2 rounded-md border border-purple-500/30">
              <CalendarIcon className="h-5 w-5 text-purple-400" />
              <span>{date?.toLocaleDateString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {["10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map((timeSlot) => (
                <Button
                  key={timeSlot}
                  variant="outline"
                  className={`
                    border-purple-500/30 
                    ${time === timeSlot ? "bg-purple-700 text-white" : "bg-purple-900/20 text-purple-300"}
                  `}
                  onClick={() => setTime(timeSlot)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {timeSlot}
                </Button>
              ))}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!time || isSubmitting}
              className="w-full bg-purple-700 hover:bg-purple-600"
            >
              {isSubmitting ? (
                <motion.div
                  className="h-5 w-5 border-t-2 border-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              ) : (
                "Book Consultation"
              )}
            </Button>
          </motion.div>
        )}

        {isComplete && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="space-y-4 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
              className="mx-auto bg-green-500 rounded-full p-4 w-20 h-20 flex items-center justify-center"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>

            <h3 className="text-xl font-bold">Consultation Booked!</h3>
            <p className="text-purple-300">
              Your consultation with {artistName} is scheduled for {date?.toLocaleDateString()} at {time}
            </p>

            <Button onClick={onClose} className="bg-purple-700 hover:bg-purple-600">
              Done
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
