"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { useAuth } from "../contexts/AuthContext"

// Import our components
import UserSignIn from "./user/sign-in"
import UserSignUp from "./user/sign-up"
import ArtistSignIn from "./artist/sign-in"
import ArtistSignUp from "./artist/sign-up"
import ArtistProfileSetup from "./artist/profile-setup"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")
  const [userType, setUserType] = useState<"user" | "artist" | null>(null)
  const [showArtistProfileSetup, setShowArtistProfileSetup] = useState(false)
  const [artistData, setArtistData] = useState<any>(null)
  const { login, isAuthenticated, userRole } = useAuth()

  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated) {
      // Redirect based on role
      if (userRole === "artist") {
        console.log("Already authenticated as artist, redirecting to dashboard")
        router.push("/artist/dashboard")
      } else if (userRole === "client") {
        console.log("Already authenticated as client, redirecting to home")
        router.push("/")
      }
    }
  }, [isAuthenticated, userRole, router])

  const handleUserTypeSelect = (type: "user" | "artist") => {
    setUserType(type)
  }

  const handleUserSignInSuccess = () => {
    login("client")
    console.log("User signed in successfully")
    router.push("/")
  }

  const handleUserSignUpSuccess = () => {
    login("client")
    console.log("User signed up successfully")
    router.push("/")
  }

  const handleArtistSignInSuccess = () => {
    login("artist")
    console.log("Artist signed in successfully")
    router.push("/artist/dashboard")
  }

  const handleArtistSignUpSuccess = (data: any) => {
    setArtistData(data)
    setShowArtistProfileSetup(true)
  }

  const handleArtistProfileSetupComplete = () => {
    login("artist")
    console.log("Artist profile setup completed")
    router.push("/artist/dashboard")
  }

  const handleArtistProfileSetupSkip = () => {
    login("artist")
    console.log("Artist profile setup skipped")
    router.push("/artist/dashboard")
  }

  const resetFlow = () => {
    setUserType(null)
    setShowArtistProfileSetup(false)
    setArtistData(null)
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
          {showArtistProfileSetup ? (
            <motion.div
              key="artist-profile-setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ArtistProfileSetup
                onComplete={handleArtistProfileSetupComplete}
                onSkip={handleArtistProfileSetupSkip}
                onBack={resetFlow}
              />
            </motion.div>
          ) : userType === null ? (
            <motion.div
              key="user-type-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Choose Your Path</h2>
                <p className="text-purple-300 mb-6">Are you looking for a tattoo or are you a tattoo artist?</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-br from-blue-900 to-purple-900 p-6 rounded-lg text-center cursor-pointer border border-blue-500/30 hover:border-blue-500/60 transition-all"
                  onClick={() => handleUserTypeSelect("user")}
                >
                  <div className="bg-blue-500/20 p-4 rounded-lg w-24 h-24 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/images/mythological-tattoos.png"
                      alt="Tattoo Example"
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-blue-200 mb-2">I'm Looking for a Tattoo</h3>
                  <p className="text-blue-300 text-sm">Find artists, explore designs, and book appointments</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-br from-purple-900 to-pink-900 p-6 rounded-lg text-center cursor-pointer border border-pink-500/30 hover:border-pink-500/60 transition-all"
                  onClick={() => handleUserTypeSelect("artist")}
                >
                  <div className="bg-pink-500/20 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Image src="/tattoo-artist.png" alt="Artist" width={60} height={60} className="opacity-80" />
                  </div>
                  <h3 className="text-xl font-bold text-pink-200 mb-2">I'm a Tattoo Artist</h3>
                  <p className="text-pink-300 text-sm">Showcase your work, manage bookings, and grow your business</p>
                </motion.div>
              </div>
            </motion.div>
          ) : userType === "user" ? (
            <motion.div
              key="user-auth"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-blue-900/20 p-4 rounded-lg mb-4 flex items-center">
                <div className="bg-blue-500/20 p-2 rounded-full mr-3">
                  <Image src="/person-silhouette.png" alt="User" width={30} height={30} className="opacity-80" />
                </div>
                <div>
                  <h3 className="text-blue-200 font-semibold">Tattoo Enthusiast</h3>
                  <p className="text-blue-300 text-xs">Find your perfect tattoo and artist</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-blue-300 hover:text-blue-100 hover:bg-blue-800/50"
                  onClick={resetFlow}
                >
                  Change
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-blue-950/50">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-blue-800">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-blue-800">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                  <UserSignIn onSuccess={handleUserSignInSuccess} />
                </TabsContent>
                <TabsContent value="signup">
                  <UserSignUp onSuccess={handleUserSignUpSuccess} />
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            <motion.div
              key="artist-auth"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-pink-900/20 p-4 rounded-lg mb-4 flex items-center">
                <div className="bg-pink-500/20 p-2 rounded-full mr-3">
                  <Image src="/tattoo-artist.png" alt="Artist" width={30} height={30} className="opacity-80" />
                </div>
                <div>
                  <h3 className="text-pink-200 font-semibold">Tattoo Artist</h3>
                  <p className="text-pink-300 text-xs">Showcase your work and grow your business</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-pink-300 hover:text-pink-100 hover:bg-pink-800/50"
                  onClick={resetFlow}
                >
                  Change
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-pink-950/50">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-pink-800">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-pink-800">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                  <ArtistSignIn onSuccess={handleArtistSignInSuccess} />
                </TabsContent>
                <TabsContent value="signup">
                  <ArtistSignUp onSuccess={handleArtistSignUpSuccess} />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
