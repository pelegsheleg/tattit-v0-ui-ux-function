"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { SupabaseClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

type SupabaseContext = {
  supabase: SupabaseClient<Database> | null
}

const Context = createContext<SupabaseContext>({ supabase: null })

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const supabaseClient = createClientComponentClient<Database>()
      setSupabase(supabaseClient)
    } catch (error) {
      console.error("Error initializing Supabase client:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <Context.Provider value={{ supabase }}>
      {isLoading ? <div>Loading Supabase client...</div> : children}
    </Context.Provider>
  )
}

export const useSupabase = () => useContext(Context)
