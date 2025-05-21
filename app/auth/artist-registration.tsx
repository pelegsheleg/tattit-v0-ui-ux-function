"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowRight, ArrowLeft, Camera, Upload, Sparkles, Palette, Zap, Tag, Smile, Frown } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import confetti from "canvas-confetti"

const artistRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  yearsOfExperience: z.number().min(0, "Experience must be a positive number"),
  specialties: z.string().min(2, "Specialties must be at least 2 characters"),
  personalBrandStatement: z.string().min(10, "Personal brand statement must be at least 10 characters"),
  studioName: z.string().optional(),
  location: z.string().min(2, "Location must be at least 2 characters"),
  isMobileArtist: z.boolean(),
  certifications: z.string().optional(),
  styleTags: z.array(z.string()),
  locationPreferences: z.string().optional(),
  profileImage: z.string().optional(),
})

type ArtistRegistrationFormValues = z.infer<typeof artistRegistrationSchema>

const styleTags = [
  "Realism",
  "Black and Gray",
  "Minimalist",
  "Traditional",
  "New School",
  "Watercolor",
  "Geometric",
  "Tribal",
  "Japanese",
  "Blackwork",
]

export default function ArtistRegistration() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedStyleTags, setSelectedStyleTags] = useState<string[]>([])
  const [mood, setMood] = useState<"happy" | "sad">("happy")
  const router = useRouter()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ArtistRegistrationFormValues>({
    resolver: zodResolver(artistRegistrationSchema),
    defaultValues: {
      isMobileArtist: false,
      styleTags: [],
      yearsOfExperience: 0,
    },
  })

  const watchYearsOfExperience = watch("yearsOfExperience")

  const onSubmit = async (data: ArtistRegistrationFormValues) => {
    setIsLoading(true)
    const submissionData = { ...data, styleTags: selectedStyleTags }
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    login("artist")
    setShowConfirmation(true)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const goToDashboard = () => {
    router.push("/artist/dashboard")
  }

  const goToPortfolio = () => {
    router.push("/artist/portfolio")
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setMood((prev) => (prev === "happy" ? "sad" : "happy"))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Let's Get Started!</h2>
            <div className="space-y-2">
              <Label htmlFor="name">What's your artist name?</Label>
              <Input
                id="name"
                placeholder="Enter your name or studio name"
                {...register("name")}
                className="bg-purple-950/30 border-purple-500/30"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email")}
                className="bg-purple-950/30 border-purple-500/30"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                {...register("phone")}
                className="bg-purple-950/30 border-purple-500/30"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} className="bg-purple-700 hover:bg-purple-600 text-white">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Tell Us About Your Art</h2>
            <div className="space-y-2">
              <Label htmlFor="bio">Your Artist Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself, your journey, and your passion for tattoo art"
                {...register("bio")}
                className="bg-purple-950/30 border-purple-500/30 min-h-[100px]"
              />
              {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  id="yearsOfExperience"
                  min={0}
                  max={30}
                  step={1}
                  value={[watchYearsOfExperience]}
                  onValueChange={(value) => {
                    register("yearsOfExperience").onChange({
                      target: { value: value[0], name: "yearsOfExperience" },
                    })
                  }}
                  className="flex-grow"
                />
                <span className="font-bold text-lg">{watchYearsOfExperience}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialties">Your Specialties</Label>
              <Input
                id="specialties"
                placeholder="E.g., Portrait, Watercolor, Blackwork"
                {...register("specialties")}
                className="bg-purple-950/30 border-purple-500/30"
              />
              {errors.specialties && <p className="text-red-500 text-sm">{errors.specialties.message}</p>}
            </div>
            <div className="flex justify-between">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="border-purple-500/30 hover:bg-purple-800/50 text-purple-300 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="bg-purple-700 hover:bg-purple-600 text-white">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Your Unique Style</h2>
            <div className="space-y-2">
              <Label htmlFor="personalBrandStatement">Your Personal Brand Statement</Label>
              <Textarea
                id="personalBrandStatement"
                placeholder="What makes your art unique? What's your tattoo philosophy?"
                {...register("personalBrandStatement")}
                className="bg-purple-950/30 border-purple-500/30 min-h-[100px]"
              />
              {errors.personalBrandStatement && (
                <p className="text-red-500 text-sm">{errors.personalBrandStatement.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Your Style Tags</Label>
              <div className="grid grid-cols-2 gap-2">
                {styleTags.map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    className={`justify-start ${
                      selectedStyleTags.includes(tag) ? "bg-purple-700 text-white" : "bg-purple-950/30 text-purple-300"
                    }`}
                    onClick={() => {
                      setSelectedStyleTags((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
                      )
                    }}
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="border-purple-500/30 hover:bg-purple-800/50 text-purple-300 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={() => setStep(4)} className="bg-purple-700 hover:bg-purple-600 text-white">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Where You Work</h2>
            <div className="space-y-2">
              <Label htmlFor="studioName">Studio Name (if applicable)</Label>
              <Input
                id="studioName"
                placeholder="Enter your studio name"
                {...register("studioName")}
                className="bg-purple-950/30 border-purple-500/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Your Primary Location</Label>
              <Input
                id="location"
                placeholder="Enter your location"
                {...register("location")}
                className="bg-purple-950/30 border-purple-500/30"
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="isMobileArtist" {...register("isMobileArtist")} />
              <Label htmlFor="isMobileArtist">I am a mobile artist</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="locationPreferences">Location Preferences (Optional)</Label>
              <Input
                id="locationPreferences"
                placeholder="Enter preferred work locations"
                {...register("locationPreferences")}
                className="bg-purple-950/30 border-purple-500/30"
              />
            </div>
            <div className="flex justify-between">
              <Button
                onClick={() => setStep(3)}
                variant="outline"
                className="border-purple-500/30 hover:bg-purple-800/50 text-purple-300 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={() => setStep(5)} className="bg-purple-700 hover:bg-purple-600 text-white">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )
      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Final Touches</h2>
            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications (Optional)</Label>
              <Input
                id="certifications"
                placeholder="Enter any certifications or awards"
                {...register("certifications")}
                className="bg-purple-950/30 border-purple-500/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Image</Label>
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-purple-900/50">
                  {profileImage ? (
                    <Image src={profileImage || "/placeholder.svg"} alt="Profile" layout="fill" objectFit="cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-purple-300">
                      <Camera className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <Input id="profileImage" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <Button
                  type="button"
                  onClick={() => document.getElementById("profileImage")?.click()}
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-800/50 text-purple-300 hover:text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                onClick={() => setStep(4)}
                variant="outline"
                className="border-purple-500/30 hover:bg-purple-800/50 text-purple-300 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="bg-purple-700 hover:bg-purple-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    className="h-5 w-5 border-t-2 border-white rounded-full animate-spin"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                ) : (
                  <>
                    Complete Registration <Sparkles className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <motion.div
          className="inline-block"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          <Palette className="w-12 h-12 text-purple-400 mx-auto" />
        </motion.div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Artist Registration
        </h1>
        <p className="text-purple-300">Join our community of talented tattoo artists</p>
      </div>

      <div className="bg-gray-900/50 p-6 rounded-lg backdrop-blur-sm border border-purple-500/20">
        <div className="mb-6 flex justify-between">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <motion.div
              key={stepNumber}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= stepNumber ? "bg-purple-600" : "bg-gray-700"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {step > stepNumber ? (
                <Zap className="w-6 h-6 text-white" />
              ) : (
                <span className="text-white font-bold">{stepNumber}</span>
              )}
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>

      <div className="text-center text-purple-300 text-sm">
        <p>By registering, you agree to our Terms of Service and Privacy Policy</p>
      </div>

      <motion.div
        className="fixed bottom-4 right-4"
        animate={mood === "happy" ? { y: [0, -10, 0] } : { rotate: [-5, 5, -5] }}
        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      >
        {mood === "happy" ? (
          <Smile className="w-12 h-12 text-yellow-400" />
        ) : (
          <Frown className="w-12 h-12 text-blue-400" />
        )}
      </motion.div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-gray-900 text-white border border-purple-500">
          <DialogHeader>
            <DialogTitle>Registration Successful!</DialogTitle>
            <DialogDescription className="text-purple-300">
              Welcome to Tattit! You're all set to start managing your tattoo business.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={goToDashboard} className="w-full bg-purple-700 hover:bg-purple-600 text-white">
              Go to Artist Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
