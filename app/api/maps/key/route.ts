import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"

export async function GET() {
  // Check if user is authenticated
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Return the API key - only use the server-side environment variable
  return NextResponse.json({
    apiKey: process.env.GOOGLE_MAPS_API_KEY || "",
  })
}
