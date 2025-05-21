import { NextResponse } from "next/server"
import { getSupabaseServiceClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = getSupabaseServiceClient()

    // Execute the SQL to update RLS policies
    const { error } = await supabase.rpc("execute_rls_migration")

    if (error) {
      console.error("Error executing RLS migration:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "RLS policies updated successfully" })
  } catch (error) {
    console.error("Unexpected error in RLS migration:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
