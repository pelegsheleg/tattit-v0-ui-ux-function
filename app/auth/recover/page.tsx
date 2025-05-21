"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

const recoverSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

type RecoverFormValues = z.infer<typeof recoverSchema>

export default function RecoverPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverFormValues>({
    resolver: zodResolver(recoverSchema),
  })

  const onSubmit = async (data: RecoverFormValues) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setIsSubmitted(true)
    toast({
      title: "Recovery Email Sent",
      description: "Check your inbox for further instructions.",
    })
    console.log(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="flex flex-col items-center space-y-2">
          <motion.div className="relative w-24 h-24" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Image
              src="/DALL·E 2024-01-10 12.14.34 - Create an innovative and darker version of the 'TATTIT' logo, featuring a Doberman dog in a design that strongly relates to AI, tattoos, and Convoluti 2.jpg"
              alt="Tattit Logo"
              fill
              className="object-contain"
            />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
            Password Recovery
          </h1>
          <p className="text-sm text-purple-300">Enter your email to reset your password</p>
        </div>

        <div className="space-y-4 bg-black/40 p-6 rounded-lg backdrop-blur-sm border border-purple-500/20">
          {!isSubmitted ? (
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
                  className="bg-purple-950/30 border-purple-500/30"
                  {...register("email")}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-600" disabled={isLoading}>
                {isLoading ? (
                  <motion.div
                    className="h-5 w-5 border-t-2 border-white rounded-full animate-spin"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                ) : (
                  <>
                    Reset Password <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4"
            >
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
                  className="bg-green-500 rounded-full p-2"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              <h2 className="text-xl font-semibold">Recovery Email Sent</h2>
              <p className="text-purple-300">Check your inbox for instructions on how to reset your password.</p>
            </motion.div>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/auth"
            className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
