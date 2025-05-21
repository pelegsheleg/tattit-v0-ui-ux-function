import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// This endpoint is for development purposes only
// It allows bypassing email confirmation for testing
export async function POST(request: Request) {
  // Only allow in development environment
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // If the error is about email confirmation, we'll bypass it for development
      if (error.message.includes("Email not confirmed")) {
        // Get the user by email
        const { data: userData } = await supabase.auth.admin.getUserByEmail(email)

        if (userData?.user) {
          // Force confirm the email
          await supabase.auth.admin.updateUserById(userData.user.id, {
            email_confirm: true,
          })

          // Try signing in again
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (signInError) {
            return NextResponse.json({ error: signInError.message }, { status: 400 })
          }

          return NextResponse.json({ success: true, user: signInData.user })
        }
      }

      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error) {
    console.error("Dev login error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
