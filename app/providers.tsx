"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/app/contexts/AuthContext"
import { SupabaseProvider } from "@/lib/supabase/provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </SupabaseProvider>
  )
}
