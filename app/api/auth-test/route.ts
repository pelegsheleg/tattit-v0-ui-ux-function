import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseServerClient()

    // Check if Supabase auth is working
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Auth error",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Auth is working",
      session: data.session ? "Active" : "None",
      sessionDetails: data.session
        ? {
            userId: data.session.user.id,
            email: data.session.user.email,
            expiresAt: data.session.expires_at,
          }
        : null,
    })
  } catch (error) {
    console.error("Auth test error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Unexpected error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
