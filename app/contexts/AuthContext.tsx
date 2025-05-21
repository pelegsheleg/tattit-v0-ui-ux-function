"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"

interface AuthContextType {
  isAuthenticated: boolean
  userRole: "artist" | "client" | null
  userId: string | null
  loading: boolean
  login: (role?: "artist" | "client") => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<"artist" | "client" | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [networkAvailable, setNetworkAvailable] = useState(true)
  const router = useRouter()
  const { supabase } = useSupabase()

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setNetworkAvailable(true)
    const handleOffline = () => setNetworkAvailable(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Set initial network status
    setNetworkAvailable(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Fetch user role safely
  const fetchUserRole = async (userId: string) => {
    if (!supabase || !networkAvailable) return null

    try {
      // First try to get the role from the users table
      const { data, error } = await supabase.from("users").select("user_role").eq("id", userId).single()

      if (error) {
        console.error("Error fetching user role from users table:", error)
        return null
      }

      if (data && data.user_role) {
        console.log("Found user role in users table:", data.user_role)
        return data.user_role
      }

      // If not found, check if user has an artist profile
      const { data: artistProfile, error: artistError } = await supabase
        .from("artist_profile")
        .select("id")
        .eq("id", userId)
        .single()

      if (!artistError && artistProfile) {
        console.log("Found artist profile, setting role to artist")
        return "artist"
      }

      // If not found, check if user has client preferences
      const { data: clientPrefs, error: clientError } = await supabase
        .from("client_preferences")
        .select("id")
        .eq("id", userId)
        .single()

      if (!clientError && clientPrefs) {
        console.log("Found client preferences, setting role to client")
        return "client"
      }

      console.log("Could not determine user role from database")
      return null
    } catch (error) {
      console.error("Exception fetching user role:", error)
      return null
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) {
        console.log("Supabase client not initialized yet")
        setLoading(false)
        return
      }

      if (!networkAvailable) {
        console.log("Network unavailable, using cached auth state")
        setLoading(false)
        return
      }

      try {
        // Use getSession first as a more reliable method
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          setIsAuthenticated(false)
          setUserRole(null)
          setUserId(null)
          setLoading(false)
          return
        }

        // If no session, user is not authenticated
        if (!sessionData.session) {
          console.log("No active session found")
          setIsAuthenticated(false)
          setUserRole(null)
          setUserId(null)
          setLoading(false)
          return
        }

        // If we have a session, get the user
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
          console.error("User error:", userError)
          setIsAuthenticated(false)
          setUserRole(null)
          setUserId(null)
          setLoading(false)
          return
        }

        if (userData.user) {
          console.log("User authenticated:", userData.user.id)
          setIsAuthenticated(true)
          setUserId(userData.user.id)

          // Fetch user role
          const role = await fetchUserRole(userData.user.id)
          if (role) {
            console.log("Setting user role to:", role)
            setUserRole(role as "artist" | "client")
          } else {
            console.log("Could not determine user role, redirecting to role selection")
            // If we can't determine the role, redirect to role selection
            router.push("/auth?select_role=true")
          }
        } else {
          setIsAuthenticated(false)
          setUserRole(null)
          setUserId(null)
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        setIsAuthenticated(false)
        setUserRole(null)
        setUserId(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Set up auth state change listener
    let subscription: { unsubscribe: () => void } | null = null

    if (supabase) {
      const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event)

        if (event === "SIGNED_IN" && session) {
          console.log("User signed in:", session.user.id)
          setIsAuthenticated(true)
          setUserId(session.user.id)

          // Only fetch user role if network is available
          if (networkAvailable) {
            try {
              const role = await fetchUserRole(session.user.id)
              if (role) {
                console.log("Setting user role to:", role)
                setUserRole(role as "artist" | "client")

                // Redirect based on role
                if (role === "artist") {
                  router.push("/artist/dashboard")
                } else if (role === "client") {
                  router.push("/matches")
                }
              } else {
                console.log("Could not determine user role, redirecting to role selection")
                // If we can't determine the role, redirect to role selection
                router.push("/auth?select_role=true")
              }
            } catch (error) {
              console.error("Error in auth state change handler:", error)
            }
          }
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out")
          setIsAuthenticated(false)
          setUserRole(null)
          setUserId(null)
          router.push("/auth")
        }
      })

      subscription = authListener.data.subscription
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [supabase, networkAvailable, router])

  // Update the login function to be more robust
  const login = async (role?: "artist" | "client") => {
    console.log("Login called with role:", role)

    setIsAuthenticated(true)

    // If we have a userId but no role was provided, try to fetch the role
    if (userId && !role) {
      try {
        const fetchedRole = await fetchUserRole(userId)
        if (fetchedRole) {
          console.log("Fetched user role:", fetchedRole)
          setUserRole(fetchedRole as "artist" | "client")

          // Redirect based on role
          if (fetchedRole === "artist") {
            router.push("/artist/dashboard")
          } else if (fetchedRole === "client") {
            router.push("/matches")
          }
          return
        }
      } catch (error) {
        console.error("Error fetching role during login:", error)
      }
    }

    // If role was provided or we couldn't fetch it
    if (role) {
      console.log("Setting user role:", role)
      setUserRole(role)

      // Redirect based on role
      if (role === "artist") {
        router.push("/artist/dashboard")
      } else if (role === "client") {
        router.push("/matches")
      }
    } else {
      // If no role was provided or fetched, redirect to role selection
      console.log("No role provided, redirecting to role selection")
      router.push("/auth?select_role=true")
    }
  }

  const logout = async () => {
    if (!supabase) {
      console.error("Cannot logout: Supabase client not initialized")
      return
    }

    if (!networkAvailable) {
      console.error("Cannot logout: Network unavailable")
      // Still clear local state
      setIsAuthenticated(false)
      setUserRole(null)
      setUserId(null)
      router.push("/auth")
      return
    }

    try {
      await supabase.auth.signOut()
      setIsAuthenticated(false)
      setUserRole(null)
      setUserId(null)
      router.push("/auth")
    } catch (error) {
      console.error("Logout error:", error)
      // Still clear local state on error
      setIsAuthenticated(false)
      setUserRole(null)
      setUserId(null)
      router.push("/auth")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userId,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
