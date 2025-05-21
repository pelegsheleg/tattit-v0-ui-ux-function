/**
 * Safe version of the auth context that doesn't use next/headers
 * This file is safe to import in pages/ directory
 */

"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/auth-helpers-nextjs"

// Define the auth context type
interface AuthContextType {
  user: User | null
  loading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a provider component
export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClientComponentClient()

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true)

        // Get the current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // Set the user if we have a session
        if (session?.user) {
          setUser(session.user)
        }

        // Subscribe to auth changes
        const {
          data: { subscription },
        } = await supabase.auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            setUser(session.user)
          } else {
            setUser(null)
          }
        })

        // Cleanup subscription
        return () => {
          subscription.unsubscribe()
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [supabase])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      if (data.user) setUser(data.user)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Create the context value
  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider")
  }
  return context
}
