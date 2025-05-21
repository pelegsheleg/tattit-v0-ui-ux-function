"use client"

import type React from "react"
import { useAuth } from "./contexts/AuthContext"
import AuthPage from "./auth/auth-page"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userRole } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Short timeout to ensure auth state is loaded
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      // Allow access to auth routes even when not authenticated
      if (!pathname?.startsWith("/auth")) {
        router.push("/auth")
      }
    } else if (userRole === "artist") {
      // If artist is trying to access client-only routes, redirect to artist dashboard
      if (pathname?.startsWith("/client-only")) {
        router.push("/artist/dashboard")
      }
    } else if (userRole === "client") {
      // If client is trying to access artist-only routes, redirect to home
      if (pathname?.startsWith("/artist")) {
        router.push("/")
      }
    }
  }, [isAuthenticated, userRole, pathname, router, isLoading])

  if (isLoading) {
    // Show a minimal loading state
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    // Allow access to auth routes when not authenticated
    if (pathname?.startsWith("/auth")) {
      return <>{children}</>
    }
    return <AuthPage />
  }

  return <>{children}</>
}
