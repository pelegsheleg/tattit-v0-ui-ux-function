/**
 * Client-side version of JWT utilities
 * This version doesn't use next/headers and is safe to import in pages/ directory
 */

// Function to clear auth cookies in case of JWT validation errors
export async function clearAuthCookiesClient(): Promise<void> {
  // In client-side code, we can't directly manipulate cookies via next/headers
  // Instead, we'll set them to expire immediately
  if (typeof document !== "undefined") {
    document.cookie = "supabase-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "sb-refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  }
}

// Function to validate JWT token expiration
export async function isTokenExpiredClient(token: string): Promise<boolean> {
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
