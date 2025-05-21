"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Facebook, ChromeIcon as Google, Apple } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"

const signUpSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    studioName: z.string().optional(),
    experience: z.string().min(1, { message: "Please select your experience level" }),
    specialization: z.string().min(2, { message: "Please enter your specialization" }),
    bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SignUpFormValues = z.infer<typeof signUpSchema>

interface ArtistSignUpProps {
  onSuccess?: (data: SignUpFormValues) => void
}

export default function ArtistSignUp({ onSuccess }: ArtistSignUpProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      termsAccepted: false,
      experience: "",
    },
  })

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Artist sign up data:", data)

      // Authenticate the artist
      login("artist")

      // Log and redirect to the dashboard
      console.log("Artist signed up successfully, redirecting to dashboard")

      if (onSuccess) {
        onSuccess(data)
      } else {
        router.push("/artist/dashboard")
      }
    } catch (error) {
      console.error("Sign up error:", error)
      // Add error handling here
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignUp = async (provider: string) => {
    setIsLoading(true)
    // Simulate API call for social sign up
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    console.log(`Social sign up with ${provider}`)
    // Create mock data for social sign up
    const mockData = {
      name: "Artist Name",
      email: "artist@example.com",
      password: "password123",
      confirmPassword: "password123",
      studioName: "Studio Name",
      experience: "3-5 years",
      specialization: "Watercolor",
      bio: "Professional tattoo artist specializing in watercolor designs.",
      termsAccepted: true,
    }
    // onSuccess(mockData as SignUpFormValues)
    login("artist")
    router.push("/artist/dashboard")
  }

  const socialProviders = [
    { name: "Google", icon: Google, color: "bg-red-600 hover:bg-red-700" },
    { name: "Facebook", icon: Facebook, color: "bg-blue-600 hover:bg-blue-700" },
    { name: "Apple", icon: Apple, color: "bg-gray-800 hover:bg-gray-900" },
  ]

  return (
    <div className="space-y-4 bg-pink-900/10 p-6 rounded-lg backdrop-blur-sm border border-pink-500/20">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Artist Name</Label>
          <Input
            id="name"
            placeholder="Your professional name"
            type="text"
            disabled={isLoading}
            className="bg-pink-950/30 border-pink-500/30"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="artist@studio.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            className="bg-pink-950/30 border-pink-500/30"
            {...register("email")}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              disabled={isLoading}
              className="bg-pink-950/30 border-pink-500/30"
              {...register("password")}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              disabled={isLoading}
              className="bg-pink-950/30 border-pink-500/30"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="studioName">Studio Name (Optional)</Label>
          <Input
            id="studioName"
            placeholder="Your studio or shop name"
            type="text"
            disabled={isLoading}
            className="bg-pink-950/30 border-pink-500/30"
            {...register("studioName")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="experience">Experience Level</Label>
            <Select onValueChange={(value) => setValue("experience", value)} disabled={isLoading}>
              <SelectTrigger className="bg-pink-950/30 border-pink-500/30">
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-2 years">0-2 years</SelectItem>
                <SelectItem value="3-5 years">3-5 years</SelectItem>
                <SelectItem value="5-10 years">5-10 years</SelectItem>
                <SelectItem value="10+ years">10+ years</SelectItem>
              </SelectContent>
            </Select>
            {errors.experience && <p className="text-red-500 text-sm">{errors.experience.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              placeholder="e.g., Watercolor, Traditional, etc."
              type="text"
              disabled={isLoading}
              className="bg-pink-950/30 border-pink-500/30"
              {...register("specialization")}
            />
            {errors.specialization && <p className="text-red-500 text-sm">{errors.specialization.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Short Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell clients a bit about yourself and your work"
            disabled={isLoading}
            className="bg-pink-950/30 border-pink-500/30 min-h-[100px]"
            {...register("bio")}
          />
          {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="termsAccepted"
            {...register("termsAccepted")}
            className="border-pink-500/50 data-[state=checked]:bg-pink-600"
          />
          <Label htmlFor="termsAccepted" className="text-sm text-pink-300">
            I accept the{" "}
            <Link href="/terms" className="text-pink-400 hover:text-pink-300 underline">
              Terms of Service
            </Link>
            ,{" "}
            <Link href="/privacy" className="text-pink-400 hover:text-pink-300 underline">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/artist-terms" className="text-pink-400 hover:text-pink-300 underline">
              Artist Agreement
            </Link>
          </Label>
        </div>
        {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted.message}</p>}

        <Button type="submit" className="w-full bg-pink-700 hover:bg-pink-600" disabled={isLoading}>
          {isLoading ? (
            <motion.div
              className="h-5 w-5 border-t-2 border-white rounded-full animate-spin"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          ) : (
            <>
              Create Artist Account <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-pink-500/30" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-950 px-2 text-pink-400">Or sign up with</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {socialProviders.map((provider) => (
          <Button
            key={provider.name}
            variant="outline"
            className={`${provider.color} text-white border-none`}
            onClick={() => handleSocialSignUp(provider.name)}
            disabled={isLoading}
          >
            <provider.icon className="mr-2 h-4 w-4" />
            {provider.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
