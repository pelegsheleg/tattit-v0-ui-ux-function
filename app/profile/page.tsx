"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const { isAuthenticated, userRole, userId } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const supabase = useSupabase()

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated && !loading) {
      router.push("/auth")
      return
    }

    async function loadProfile() {
      try {
        setLoading(true)

        if (!userId) return

        // Get user data
        const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

        if (userError) {
          console.error("Error fetching user data:", userError)
          return
        }

        setProfile(userData)
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadProfile()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, userId, router, supabase])

  // Redirect to the appropriate dashboard based on user role
  const handleDashboardClick = () => {
    if (userRole === "artist") {
      router.push("/artist/dashboard")
    } else {
      router.push("/client/dashboard")
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ) : profile ? (
        <Card>
          <CardHeader>
            <CardTitle>{profile.full_name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p>{profile.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Role</p>
              <p className="capitalize">{userRole || "Unknown"}</p>
            </div>
            <div className="pt-4">
              <Button onClick={handleDashboardClick}>Go to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <p>No profile data found. Please sign in to view your profile.</p>
            <Button className="mt-4" onClick={() => router.push("/auth")}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
