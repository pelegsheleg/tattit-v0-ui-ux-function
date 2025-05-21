"use server"

import { cookies } from "next/headers"

// Function to clear auth cookies in case of JWT validation errors
export async function clearAuthCookies() {
  const cookieStore = cookies()

  // Clear Supabase auth cookies
  cookieStore.delete("supabase-auth-token")
  cookieStore.delete("sb-refresh-token")
  cookieStore.delete("sb-access-token")
}

// Function to validate JWT token expiration
export async function isTokenExpired(token: string): Promise<boolean> {
  try {
    // Extract the payload from the JWT token
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join(""),
    )

    const { exp } = JSON.parse(jsonPayload)

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000)
    return exp < currentTime
  } catch (error) {
    console.error("Error validating token:", error)
    return true // Assume token is expired if there's an error
  }
}
