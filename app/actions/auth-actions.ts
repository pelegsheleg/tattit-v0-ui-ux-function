"use server"

export async function signOut() {
  try {
    // In a real app, this would handle server-side logout logic
    // Such as invalidating sessions, clearing cookies, etc.

    // Simulate a small delay for the server-side logout process
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      success: true,
      redirectUrl: "/auth", // Provide the redirect URL from the server
    }
  } catch (error) {
    console.error("Error signing out:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
