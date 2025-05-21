"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  User,
  ImageIcon,
  MapPin,
  Shield,
  CheckSquare,
  DollarSign,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { getArtistProfile, getArtistPortfolio } from "@/lib/services/artist"
import { PortfolioPreview } from "@/components/portfolio-preview"
import { ArtistStatsCards } from "@/components/artist-stats-cards"
import { UpcomingBookings } from "@/components/upcoming-bookings"
import { RecentMessages } from "@/components/recent-messages"
import { signOut } from "@/app/actions/auth-actions"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ArtistDashboardPage() {
  const { userId } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [portfolioImages, setPortfolioImages] = useState<any[]>([])
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!userId) return

      try {
        setLoading(true)

        // Load artist profile
        const { data: profileData, error: profileError } = await getArtistProfile(userId)

        if (profileError) {
          console.error("Error loading artist profile:", profileError)
          toast({
            title: "Error loading profile",
            description: typeof profileError === "string" ? profileError : "Failed to load profile data",
            variant: "destructive",
            duration: 5000,
          })

          // If there's an authentication error, redirect to login
          if (profileError.includes("Not authenticated") || profileError.includes("User not found")) {
            router.push("/auth")
            return
          }
        }

        if (profileData) {
          console.log("Profile data loaded successfully:", profileData)
          setProfile(profileData)
        } else {
          console.warn("No profile data returned")
        }

        // Load portfolio images
        const { data: images, error: portfolioError } = await getArtistPortfolio(userId)

        if (portfolioError) {
          console.error("Error loading portfolio:", portfolioError)
          toast({
            title: "Error loading portfolio",
            description: typeof portfolioError === "string" ? portfolioError : "Failed to load portfolio images",
            variant: "destructive",
            duration: 5000,
          })
        } else if (images) {
          console.log("Portfolio images loaded successfully:", images.length)
          setPortfolioImages(images)
        } else {
          console.warn("No portfolio images returned")
          setPortfolioImages([])
        }

        // Calculate profile completion
        calculateProfileCompletion(profileData, images || [])
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive",
          duration: 5000,
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userId, router])

  const calculateProfileCompletion = (profile: any, images: any[]) => {
    if (!profile) {
      setCompletionPercentage(0)
      return
    }

    const sections = [
      !!profile.bio,
      !!profile.personal_brand_statement,
      !!profile.users?.profile_image_url,
      !!profile.studio_name,
      !!profile.location,
      !!profile.hourly_rate,
      !!profile.years_experience,
      !!profile.specialties && profile.specialties.length > 0,
      !!profile.style_tags && profile.style_tags.length > 0,
      !!profile.certifications,
      !!profile.do_list && profile.do_list.length > 0,
      !!profile.dont_list && profile.dont_list.length > 0,
      images.length >= 3,
    ]

    const completedSections = sections.filter(Boolean).length
    setCompletionPercentage(Math.round((completedSections / sections.length) * 100))
  }

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true)
      const result = await signOut()

      if (result.success) {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account",
          duration: 3000,
        })
        router.push("/auth")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to log out",
          variant: "destructive",
          duration: 5000,
        })
        setIsLoggingOut(false)
      }
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred during logout",
        variant: "destructive",
        duration: 5000,
      })
      setIsLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Artist Dashboard</h1>
          <p className="text-gray-500">Welcome back, {profile?.users?.full_name || "Artist"}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">Profile Completion</span>
            <div className="w-32 mt-1">
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </div>
          <Button asChild>
            <Link href="/artist/profile">Complete Profile</Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/artist/profile">Account Settings (Profile, Bio, Experience)</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/artist/preferences">Preferences (Do/Don't List, Notifications)</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500 cursor-pointer"
                onClick={handleSignOut}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                    Logging out...
                  </div>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ArtistStatsCards />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>Your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingBookings />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest client communications</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentMessages />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Portfolio Preview</CardTitle>
              <CardDescription>Your latest work</CardDescription>
            </CardHeader>
            <CardContent>
              <PortfolioPreview images={portfolioImages.slice(0, 4)} />
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/artist/portfolio">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Manage Portfolio
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your artist profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/artist/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/artist/portfolio">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Portfolio
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/artist/location">
                    <MapPin className="mr-2 h-4 w-4" />
                    Location
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/artist/credentials">
                    <Shield className="mr-2 h-4 w-4" />
                    Credentials
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/artist/preferences">
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Do/Don't List
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/artist/availability">
                    <Calendar className="mr-2 h-4 w-4" />
                    Availability
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/artist/pricing">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Pricing
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/messages">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
