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

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().optional(),
})

type SignInFormValues = z.infer<typeof signInSchema>

interface UserSignInProps {
  onSuccess: () => void
}

export default function UserSignIn({ onSuccess }: UserSignInProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    console.log("User sign in data:", data)
    onSuccess()
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    // Simulate API call for social login
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    console.log(`Social login with ${provider}`)
    onSuccess()
  }

  const socialProviders = [
    { name: "Google", icon: Google, color: "bg-red-600 hover:bg-red-700" },
    { name: "Facebook", icon: Facebook, color: "bg-blue-600 hover:bg-blue-700" },
    { name: "Apple", icon: Apple, color: "bg-gray-800 hover:bg-gray-900" },
  ]

  return (
    <div className="space-y-4 bg-blue-900/10 p-6 rounded-lg backdrop-blur-sm border border-blue-500/20">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/auth/recover" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            disabled={isLoading}
            className="bg-blue-950/30 border-blue-500/30"
            {...register("password")}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            {...register("rememberMe")}
            className="border-blue-500/50 data-[state=checked]:bg-blue-600"
          />
          <Label htmlFor="rememberMe" className="text-sm text-blue-300">
            Remember me for 30 days
          </Label>
        </div>
        <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-600" disabled={isLoading}>
          {isLoading ? (
            <motion.div
              className="h-5 w-5 border-t-2 border-white rounded-full animate-spin"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          ) : (
            <>
              Sign In <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-blue-500/30" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-950 px-2 text-blue-400">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {socialProviders.map((provider) => (
          <Button
            key={provider.name}
            variant="outline"
            className={`${provider.color} text-white border-none`}
            onClick={() => handleSocialLogin(provider.name)}
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
