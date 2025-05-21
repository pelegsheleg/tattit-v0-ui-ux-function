"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Mail, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import RoleSelection from "./role-selection"
import ArtistRegistration from "./artist-registration"
import ArtistProfileSetup from "./artist-profile-setup"
import TestLogin from "./test-login"

// Import the server actions
import { signIn, signUp, resendConfirmationEmail } from "@/lib/auth"
import { useAuth } from "@/app/contexts/AuthContext"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

const signUpSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SignInFormValues = z.infer<typeof signInSchema>
type SignUpFormValues = z.infer<typeof signUpSchema>

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [showArtistRegistration, setShowArtistRegistration] = useState(false)
  const [showArtistProfileSetup, setShowArtistProfileSetup] = useState(false)
  const [artistData, setArtistData] = useState<any>(null)
  const [signUpData, setSignUpData] = useState<SignUpFormValues | null>(null)
  const [emailConfirmationNeeded, setEmailConfirmationNeeded] = useState(false)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState("")
  const [resendingEmail, setResendingEmail] = useState(false)
  const [isArtistSignIn, setIsArtistSignIn] = useState(false)

  // Add this near the top of the file, inside the AuthPage component
  const router = useRouter()
  const searchParams = useSearchParams()
  const confirmed = searchParams?.get("confirmed")
  const error = searchParams?.get("error")
  const errorDescription = searchParams?.get("error_description")

  const { login } = useAuth()

  // Initialize Supabase client
  const supabase = createClientComponentClient()

  // Add this after the useState declarations
  useEffect(() => {
    if (confirmed === "true") {
      toast({
        title: "Email Confirmed",
        description: "Your email has been confirmed. You can now sign in.",
      })
    }

    if (error) {
      toast({
        title: "Authentication Error",
        description: errorDescription || "An error occurred during authentication.",
        variant: "destructive",
      })

      // If the error is about an expired link, show the email confirmation UI
      if (error === "access_denied" && errorDescription?.includes("expired")) {
        setEmailConfirmationNeeded(true)
        // Try to extract the email from the URL if available
        const emailMatch = errorDescription.match(/for\s+([^\s]+@[^\s]+)/)
        if (emailMatch && emailMatch[1]) {
          setUnconfirmedEmail(emailMatch[1])
        }
      }
    }
  }, [confirmed, error, errorDescription])

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  })

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  })

  const handleResendConfirmation = async () => {
    if (!unconfirmedEmail) return

    setResendingEmail(true)
    try {
      const result = await resendConfirmationEmail(unconfirmedEmail)

      if (result.success) {
        toast({
          title: "Confirmation Email Sent",
          description: "Please check your inbox and follow the link to confirm your email address.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to resend confirmation email",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error resending confirmation:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setResendingEmail(false)
    }
  }

  const onSignInSubmit = async (data: SignInFormValues) => {
    setIsLoading(true)
    setEmailConfirmationNeeded(false)
    console.log("Sign-in attempt with email:", data.email)

    try {
      // Call the signIn server action
      const result = await signIn({
        email: data.email,
        password: data.password,
      })

      console.log("Sign-in result:", result)

      if (!result.success) {
        // Check if the error is about email confirmation
        if (result.error?.includes("Email not confirmed")) {
          setEmailConfirmationNeeded(true)
          setUnconfirmedEmail(data.email)
          toast({
            title: "Email Not Confirmed",
            description: "Please check your inbox and confirm your email address before signing in.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to sign in",
            variant: "destructive",
          })
        }
        setIsLoading(false)
        return
      }

      // Successful sign-in
      toast({
        title: "Success",
        description: "You have been signed in",
      })

      // If artist sign-in mode is active, force redirect to artist dashboard
      if (isArtistSignIn) {
        console.log("Artist sign-in mode active, redirecting to artist dashboard...")
        login("artist")
        router.push("/artist/dashboard")
        return
      }

      try {
        // Get user role from database to ensure proper redirection
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("user_role")
          .eq("id", result.user.id)
          .single()

        if (userError) {
          console.error("Error fetching user role:", userError)
          // Default to client if we can't determine role
          login("client")
          router.push("/matches")
          return
        }

        const userRole = userData?.user_role as "artist" | "client"
        console.log("User role from database:", userRole)

        // Manually update auth context for immediate effect
        login(userRole)

        // Redirect based on role
        if (userRole === "artist") {
          console.log("Redirecting to artist dashboard...")
          router.push("/artist/dashboard")
        } else {
          console.log("Redirecting to matches page...")
          router.push("/matches")
        }
      } catch (error) {
        console.error("Error determining user role:", error)
        // Default to client if we can't determine role
        login("client")
        router.push("/matches")
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUpSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true)

    // Store sign up data for later use
    setSignUpData(data)
    setIsLoading(false)
    setShowRoleSelection(true)
  }

  const handleRoleSelect = async (role: "artist" | "client") => {
    if (!signUpData) return

    if (role === "artist") {
      setShowArtistRegistration(true)
    } else {
      // Register as client
      setIsLoading(true)

      try {
        const result = await signUp({
          email: signUpData.email,
          password: signUpData.password,
          fullName: signUpData.name,
          role: "client",
        })

        if (!result.success) {
          toast({
            title: "Error",
            description: result.error || "Failed to sign up",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        // Check if email confirmation is required
        if (result.emailConfirmationRequired) {
          setEmailConfirmationNeeded(true)
          setUnconfirmedEmail(signUpData.email)
          toast({
            title: "Email Confirmation Required",
            description: "Please check your inbox and confirm your email address before signing in.",
          })
          setIsLoading(false)
          // Return to sign-in tab
          setShowRoleSelection(false)
          setActiveTab("signin")
          return
        }

        toast({
          title: "Success",
          description: "Your account has been created",
        })

        // Explicitly update the user role in the database
        const supabase = createClientComponentClient()
        await supabase.from("users").update({ user_role: "client" }).eq("id", result.user.id)

        // Manually update auth context for immediate effect
        login("client")

        // Redirect to matches page
        router.push("/matches")
      } catch (error) {
        console.error("Sign up error:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleArtistRegistrationComplete = async (data: any) => {
    if (!signUpData) return

    setArtistData(data)

    // Register the artist
    setIsLoading(true)

    try {
      const result = await signUp({
        email: signUpData.email,
        password: signUpData.password,
        fullName: signUpData.name,
        role: "artist",
      })

      if (!result.success) {
        toast({
          title: "Error",
          description: result.error || "Failed to sign up",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Check if email confirmation is required
      if (result.emailConfirmationRequired) {
        setEmailConfirmationNeeded(true)
        setUnconfirmedEmail(signUpData.email)
        toast({
          title: "Email Confirmation Required",
          description: "Please check your inbox and confirm your email address before signing in.",
        })
        setIsLoading(false)
        // Return to sign-in tab
        setShowArtistRegistration(false)
        setActiveTab("signin")
        return
      }

      // Manually update auth context for immediate effect
      login("artist")

      setShowArtistRegistration(false)
      setShowArtistProfileSetup(true)
    } catch (error) {
      console.error("Artist registration error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleArtistProfileSetupComplete = () => {
    toast({
      title: "Success",
      description: "Your artist profile has been set up",
    })

    // Redirect to artist dashboard
    router.push("/artist/style-analysis")
  }

  const handleArtistProfileSetupSkip = () => {
    toast({
      title: "Success",
      description: "Your account has been created. You can complete your profile later.",
    })

    // Redirect to artist dashboard
    router.push("/artist/style-analysis")
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
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dog%20face%20image%20background-80tC7pNknHSwIU4KYQODUQRYlZl8t1.png"
              alt="Tattit Logo"
              fill
              className="object-contain"
            />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
            Welcome to Tattit
          </h1>
          <p className="text-sm text-purple-300">Your AI-Powered Tattoo Journey Begins Here</p>
        </div>

        <AnimatePresence mode="wait">
          {showArtistRegistration ? (
            <motion.div
              key="artist-registration"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ArtistRegistration onComplete={handleArtistRegistrationComplete} />
            </motion.div>
          ) : showArtistProfileSetup ? (
            <motion.div
              key="artist-profile-setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ArtistProfileSetup onComplete={handleArtistProfileSetupComplete} onSkip={handleArtistProfileSetupSkip} />
            </motion.div>
          ) : showRoleSelection ? (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RoleSelection onRoleSelect={handleRoleSelect} />
            </motion.div>
          ) : (
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {emailConfirmationNeeded && (
                <Alert className="mb-4 bg-amber-900/50 border-amber-500">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Email Confirmation Required</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">Please check your inbox and confirm your email address before signing in.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResendConfirmation}
                      disabled={resendingEmail}
                      className="border-amber-500 hover:bg-amber-900/50"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      {resendingEmail ? "Sending..." : "Resend Confirmation Email"}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-purple-950/50">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-purple-800">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-purple-800">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                  <div className="space-y-4 bg-black/40 p-6 rounded-lg backdrop-blur-sm border border-purple-500/20">
                    {isArtistSignIn && (
                      <Alert className="mb-4 bg-pink-900/50 border-pink-500">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Artist Sign In Mode</AlertTitle>
                        <AlertDescription>
                          You are signing in as an artist. You will be redirected to the artist dashboard.
                        </AlertDescription>
                      </Alert>
                    )}
                    <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
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
                          {...signInForm.register("email")}
                        />
                        {signInForm.formState.errors.email && (
                          <p className="text-red-500 text-sm">{signInForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          disabled={isLoading}
                          className="bg-purple-950/30 border-purple-500/30"
                          {...signInForm.register("password")}
                        />
                        {signInForm.formState.errors.password && (
                          <p className="text-red-500 text-sm">{signInForm.formState.errors.password.message}</p>
                        )}
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
                            Sign In <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-purple-500/30" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gray-950 px-2 text-purple-400">Or</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowArtistRegistration(true)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Register as an Artist
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-purple-500/30" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gray-950 px-2 text-purple-400">Artist Sign In</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        onClick={() => {
                          setIsArtistSignIn(!isArtistSignIn)
                          toast({
                            title: isArtistSignIn ? "Artist Mode Deactivated" : "Artist Mode Activated",
                            description: isArtistSignIn
                              ? "You will be redirected based on your account type"
                              : "You will be redirected to the artist dashboard after sign in",
                          })
                        }}
                        className={`w-full ${
                          isArtistSignIn
                            ? "bg-pink-700 hover:bg-pink-600"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        }`}
                      >
                        {isArtistSignIn ? "Deactivate Artist Mode" : "Sign In as Artist"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="signup">
                  <div className="space-y-4 bg-black/40 p-6 rounded-lg backdrop-blur-sm border border-purple-500/20">
                    <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          type="text"
                          disabled={isLoading}
                          className="bg-purple-950/30 border-purple-500/30"
                          {...signUpForm.register("name")}
                        />
                        {signUpForm.formState.errors.name && (
                          <p className="text-red-500 text-sm">{signUpForm.formState.errors.name.message}</p>
                        )}
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
                          className="bg-purple-950/30 border-purple-500/30"
                          {...signUpForm.register("email")}
                        />
                        {signUpForm.formState.errors.email && (
                          <p className="text-red-500 text-sm">{signUpForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          disabled={isLoading}
                          className="bg-purple-950/30 border-purple-500/30"
                          {...signUpForm.register("password")}
                        />
                        {signUpForm.formState.errors.password && (
                          <p className="text-red-500 text-sm">{signUpForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          disabled={isLoading}
                          className="bg-purple-950/30 border-purple-500/30"
                          {...signUpForm.register("confirmPassword")}
                        />
                        {signUpForm.formState.errors.confirmPassword && (
                          <p className="text-red-500 text-sm">{signUpForm.formState.errors.confirmPassword.message}</p>
                        )}
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
                            Create Account <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center">
          <Link href="/auth/recover" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            Forgot your password?
          </Link>
        </div>
      </motion.div>
      {process.env.NODE_ENV !== "production" && (
        <div className="mt-8 w-full max-w-md">
          <TestLogin />
        </div>
      )}
    </div>
  )
}
