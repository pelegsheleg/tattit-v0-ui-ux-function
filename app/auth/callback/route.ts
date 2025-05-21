import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")

  // If there's an error, redirect to auth page with error parameters
  if (error) {
    console.error("Auth callback error:", error, errorDescription)
    return NextResponse.redirect(
      `${requestUrl.origin}/auth?error=${error}&error_description=${encodeURIComponent(
        errorDescription || "Unknown error",
      )}`,
    )
  }

  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies })
      await supabase.auth.exchangeCodeForSession(code)

      // Redirect to auth page with success parameter
      return NextResponse.redirect(`${requestUrl.origin}/auth?confirmed=true`)
    } catch (err) {
      console.error("Error exchanging code for session:", err)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth?error=session_error&error_description=${encodeURIComponent(
          "Failed to complete authentication",
        )}`,
      )
    }
  }

  // If no code and no error, redirect to auth page
  return NextResponse.redirect(`${requestUrl.origin}/auth`)
}
