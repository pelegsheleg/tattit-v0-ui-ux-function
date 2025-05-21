import { NextResponse } from "next/server"
import { getSupabaseServerClient, getSupabaseServiceClient } from "@/lib/supabase/server"
import { getAuthUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { userId, isInitialSetup } = data

    // If this is the initial setup during registration, use the service client and the provided userId
    if (isInitialSetup && userId) {
      const serviceClient = getSupabaseServiceClient()

      // Remove these fields from the data object before inserting
      delete data.userId
      delete data.isInitialSetup

      // Update the artist profile using the service client
      const { error } = await serviceClient.from("artist_profile").upsert({
        id: userId,
        ...data,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error updating artist profile:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
      }

      return NextResponse.json({ success: true })
    }

    // For authenticated updates, use the normal flow
    const supabase = getSupabaseServerClient()
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    // Remove these fields if they exist
    delete data.userId
    delete data.isInitialSetup

    // Update the artist profile
    const { error } = await supabase.from("artist_profile").upsert({
      id: user.id,
      ...data,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error updating artist profile:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in artist profile API route:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
