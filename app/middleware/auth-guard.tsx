"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"

interface AuthGuardProps {
  children: ReactNode
  requiredRole?: "artist" | "client"
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isAuthenticated, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }

    // Check role if required
    if (requiredRole && userRole !== requiredRole) {
      if (requiredRole === "artist") {
        router.push("/")
      } else {
        router.push("/artist/dashboard")
      }
    }
  }, [isAuthenticated, userRole, requiredRole, router])

  // If not authenticated or wrong role, don't render children
  if (!isAuthenticated || (requiredRole && userRole !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
