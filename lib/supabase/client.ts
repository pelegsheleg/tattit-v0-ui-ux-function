// This file is deprecated - use the provider pattern instead
// Keeping for backward compatibility
import { useSupabase } from "./provider"

export function getSupabaseClient() {
  console.warn("getSupabaseClient is deprecated. Use useSupabase hook instead.")
  // This is a fallback for any code still using this function
  // It will throw an error in client components since hooks can't be called outside of components
  // But it will prevent creating multiple instances
  // The hook is being called conditionally, but all hooks must be called in the exact same order in every component render.
  const client = useSupabase()
  return client
}
