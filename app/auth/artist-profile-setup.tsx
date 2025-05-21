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
          <div className="grid grid-cols-2 gap-4">
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
                    <span className="text-purple-300">Main portfolio piece</span>
                  </>
                )}
              </Label>
            </div>

            {/* Additional portfolio pieces */}
            {[1, 2, 3].map((index) => (
              <div key={index} className="border-2 border-dashed border-purple-500/30 rounded-lg p-4 text-center">
                <Input id={`portfolio-${index}`} type="file" accept="image/*" className="hidden" />
                <Label htmlFor={`portfolio-${index}`} className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-8 h-8 text-purple-400 mb-2" />
                  <span className="text-purple-300 text-sm">Additional work</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold">Style Analysis</Label>
          <p className="text-sm text-purple-300 mb-4">
            Our AI will analyze your work to better match you with clients. Upload clear images that showcase your
            style.
          </p>

          <div className="bg-purple-900/20 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Style Tags (AI Generated)</h3>
            <div className="flex flex-wrap gap-2">
              {["Realism", "Fine Line", "Black & Grey", "Minimalist"].map((tag) => (
                <span key={tag} className="px-2 py-1 bg-purple-800/50 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
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
