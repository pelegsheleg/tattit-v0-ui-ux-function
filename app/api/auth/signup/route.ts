import { NextResponse } from "next/server"
import { signUp } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Call the signUp function from lib/auth.ts
    const result = await signUp({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      role: data.role,
    })

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    // Make sure to return the user ID so it can be used for profile creation
    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
      },
    })
  } catch (error) {
    console.error("Error in signup API route:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
