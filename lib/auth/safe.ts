/**
 * Safe version of auth utilities that don't use next/headers
 * This file is safe to import in pages/ directory
 */

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/auth-helpers-nextjs"

// Get the current user without using next/headers
export async function getAuthUserSafe(): Promise<User | null> {
  try {
    // Use the client component client which doesn't rely on next/headers
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      return null
    }

    return data.user
  } catch (error) {
    console.error("Error getting auth user:", error)
    return null
  }
}

// Sign out without using next/headers
export async function signOutSafe(): Promise<boolean> {
  try {
    const supabase = createClientComponentClient()
    await supabase.auth.signOut()
    return true
  } catch (error) {
    console.error("Error signing out:", error)
    return false
  }
}
