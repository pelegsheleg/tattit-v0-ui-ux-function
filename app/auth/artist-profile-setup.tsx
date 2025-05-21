"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Upload } from "lucide-react"
import Image from "next/image"

interface ArtistProfileSetupProps {
  onComplete: () => void
  onSkip: () => void
}

export default function ArtistProfileSetup({ onComplete, onSkip }: ArtistProfileSetupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [portfolioImage, setPortfolioImage] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPortfolioImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    onComplete()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Set Up Your Artist Profile</h2>
      <p className="text-center text-purple-300">Add at least one piece of portfolio work to get started</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="portfolio">Upload Portfolio Work</Label>
          <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center">
            <Input id="portfolio" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <Label htmlFor="portfolio" className="cursor-pointer flex flex-col items-center">
              {portfolioImage ? (
                <Image
                  src={portfolioImage || "/placeholder.svg"}
                  alt="Portfolio work"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-purple-400 mb-2" />
                  <span className="text-purple-300">Click to upload or drag and drop</span>
                </>
              )}
            </Label>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1 bg-purple-700 hover:bg-purple-600 text-white"
            disabled={isLoading || !portfolioImage}
          >
            {isLoading ? (
              <motion.div
                className="h-5 w-5 border-t-2 border-white rounded-full animate-spin"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            ) : (
              <>
                Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-purple-500/30 hover:bg-purple-800/50 text-purple-300 hover:text-white"
            onClick={onSkip}
          >
            Skip for Now
          </Button>
        </div>
      </form>
    </div>
  )
}
