"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/contexts/AuthContext"
import { useSupabase } from "@/lib/supabase/provider"
import { useRouter } from "next/navigation"

export default function TestLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const supabase = useSupabase()
  const router = useRouter()

  const handleTestLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (email && password) {
        // Try to sign in with provided credentials
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          console.error("Auth error:", error)
          // Fall back to demo login
          login("client")
        } else if (data.user) {
          // Real login succeeded
          toast({
            title: "Login Successful",
            description: "You've been logged in successfully.",
          })
        }
      } else {
        // No credentials provided, use demo login
        login("client")
      }

      toast({
        title: "Test Login Successful",
        description: "You've been logged in with test credentials.",
      })

      router.push("/matches")
    } catch (error) {
      console.error("Test login error:", error)
      toast({
        title: "Error",
        description: "Failed to log in with test credentials.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return null
}
