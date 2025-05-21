"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"

interface BookingAnimationProps {
  artistName: string
  onClose: () => void
}

export default function BookingAnimation({ artistName, onClose }: BookingAnimationProps) {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Trigger confetti when booking is confirmed
    if (step === 3) {
      const duration = 3 * 1000
      const end = Date.now() + duration

      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval)
        }

        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#9333ea", "#6366f1", "#8b5cf6"],
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#9333ea", "#6366f1", "#8b5cf6"],
        })
      }, 150)

      return () => clearInterval(interval)
    }
  }, [step])

  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setProgress(33)
        setStep(2)
      }, 2000)
      return () => clearTimeout(timer)
    } else if (step === 2) {
      const timer = setTimeout(() => {
        setProgress(100)
        setStep(3)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [step])

  return (
    <div className="text-center py-8 px-4">
      <div className="mb-8">
        <div className="h-2 w-full bg-gray-700 rounded-full mb-2">
          <motion.div
            className="h-full bg-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
        <p className="text-sm text-gray-400">Step {step} of 3</p>
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-900/50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-purple-400 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Contacting {artistName}</h3>
          <p className="text-gray-400 mb-4">Please wait while we reach out to the artist...</p>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-900/50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-purple-400 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Checking availability</h3>
          <p className="text-gray-400 mb-4">Checking {artistName}'s calendar for available slots...</p>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-900/50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Consultation Booked!</h3>
          <p className="text-gray-400 mb-6">
            Your consultation with {artistName} has been scheduled. You'll receive a confirmation email shortly.
          </p>
          <Button onClick={onClose} className="bg-purple-700 hover:bg-purple-600">
            View Details
          </Button>
        </motion.div>
      )}
    </div>
  )
}
