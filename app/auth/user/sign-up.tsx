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
import { ArrowRight, Facebook, ChromeIcon as Google, Apple } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const signUpSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SignUpFormValues = z.infer<typeof signUpSchema>

interface UserSignUpProps {
  onSuccess: () => void
}

export default function UserSignUp({ onSuccess }: UserSignUpProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      termsAccepted: false,
    },
  })

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    console.log("User sign up data:", data)
    onSuccess()
  }

  const handleSocialSignUp = async (provider: string) => {
    setIsLoading(true)
    // Simulate API call for social sign up
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    console.log(`Social sign up with ${provider}`)
    onSuccess()
  }

  const socialProviders = [
    { name: "Google", icon: Google, color: "bg-red-600 hover:bg-red-700" },
    { name: "Facebook", icon: Facebook, color: "bg-blue-600 hover:bg-blue-700" },
    { name: "Apple", icon: Apple, color: "bg-gray-800 hover:bg-gray-900" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
      <div className="hidden lg:block lg:w-1/2">
        <div className="relative w-full h-full">
          <Image
            src="/images/mythological-tattoos.png"
            alt="Person with mythological tattoos"
            fill
            className="object-cover rounded-l-lg"
          />
        </div>
      </div>
      <div className="space-y-4 bg-blue-900/10 p-6 rounded-lg backdrop-blur-sm border border-blue-500/20">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              type="text"
              disabled={isLoading}
              className="bg-blue-950/30 border-blue-500/30"
              {...register("name")}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              className="bg-blue-950/30 border-blue-500/30"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              disabled={isLoading}
              className="bg-blue-950/30 border-blue-500/30"
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
              className="bg-blue-950/30 border-blue-500/30"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="termsAccepted"
              {...register("termsAccepted")}
              className="border-blue-500/50 data-[state=checked]:bg-blue-600"
            />
            <Label htmlFor="termsAccepted" className="text-sm text-blue-300">
              I accept the{" "}
              <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted.message}</p>}
          <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-600" disabled={isLoading}>
            {isLoading ? (
              <motion.div
                className="h-5 w-5 border-t-2 border-white rounded-full animate-spin"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            ) : (
              <>
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-blue-500/30" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-950 px-2 text-blue-400">Or sign up with</span>
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
    </div>
  )
}
