"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "./contexts/AuthContext"

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const pathname = usePathname()

  // Don't require authentication for auth pages
  const isAuthPage = pathname === "/auth" || pathname?.startsWith("/auth/") || pathname === "/"

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    )
  }

  // If not authenticated and not on an auth page, the user will be redirected by the page component
  // This allows the page to handle the redirection logic
  return <>{children}</>
}
