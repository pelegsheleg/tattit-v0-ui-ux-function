"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { fetchFromApi } from "@/lib/compatibility/api-routes"

// Define the auth context types
type User = {
  id: string
  email: string
  role?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<User | null>
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => null,
})

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext)

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetchFromApi<{ user: User | null }>("auth/session")
        setUser(response.user)
      } catch (err) {
        console.error("Error checking auth status:", err)
        setError("Failed to authenticate")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchFromApi<{ user: User | null }>("auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      setUser(response.user)
    } catch (err) {
      console.error("Sign in error:", err)
      setError("Failed to sign in")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    setLoading(true)

    try {
      await fetchFromApi("auth/signout", { method: "POST" })
      setUser(null)
    } catch (err) {
      console.error("Sign out error:", err)
      setError("Failed to sign out")
    } finally {
      setLoading(false)
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string, fullName: string, role: string): Promise<User | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchFromApi<{ success: boolean; user: User | null }>("auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, role }),
      })

      if (!response.success) {
        throw new Error("Failed to sign up")
      }

      return response.user
    } catch (err) {
      console.error("Sign up error:", err)
      setError("Failed to sign up")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Provide the auth context to children
  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signOut, signUp }}>{children}</AuthContext.Provider>
  )
}
