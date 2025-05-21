"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, ChevronRight } from "lucide-react"
import Link from "next/link"

interface ProfileItem {
  id: string
  title: string
  completed: boolean
  path: string
}

interface ProfileCompletionProps {
  userId: string
  userRole: "artist" | "client"
  className?: string
  compact?: boolean
}

export default function ProfileCompletion({ userId, userRole, className, compact = false }: ProfileCompletionProps) {
  const [loading, setLoading] = useState(true)
  const [completionItems, setCompletionItems] = useState<ProfileItem[]>([])
  const [completionPercentage, setCompletionPercentage] = useState(0)

  useEffect(() => {
    const loadProfileCompletion = async () => {
      if (!userId) return

      try {
        // For artists, check different profile items
        if (userRole === "artist") {
          // In a real app, you would fetch this data from the server
          // For now, we'll simulate it with mock data
          const items: ProfileItem[] = [
            {
              id: "basic_info",
              title: "Basic Information",
              completed: true,
              path: "/artist/profile",
            },
            {
              id: "portfolio",
              title: "Portfolio Images",
              completed: false,
              path: "/artist/portfolio",
            },
            {
              id: "style_tags",
              title: "Style Tags",
              completed: false,
              path: "/artist/portfolio?tab=styles",
            },
            {
              id: "availability",
              title: "Availability Settings",
              completed: false,
              path: "/artist/availability",
            },
            {
              id: "pricing",
              title: "Pricing Information",
              completed: false,
              path: "/artist/profile",
            },
          ]

          setCompletionItems(items)

          // Calculate percentage
          const completedCount = items.filter((item) => item.completed).length
          setCompletionPercentage(Math.round((completedCount / items.length) * 100))
        } else {
          // For clients, check different profile items
          const items: ProfileItem[] = [
            {
              id: "basic_info",
              title: "Basic Information",
              completed: true,
              path: "/client/profile",
            },
            {
              id: "preferences",
              title: "Style Preferences",
              completed: false,
              path: "/client/preferences",
            },
            {
              id: "location",
              title: "Location Settings",
              completed: false,
              path: "/client/preferences",
            },
          ]

          setCompletionItems(items)

          // Calculate percentage
          const completedCount = items.filter((item) => item.completed).length
          setCompletionPercentage(Math.round((completedCount / items.length) * 100))
        }
      } catch (error) {
        console.error("Error loading profile completion:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProfileCompletion()
  }, [userId, userRole])

  if (loading) {
    return (
      <div className={className}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  // Compact version just shows the progress bar
  if (compact) {
    return (
      <div className={className}>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Complete Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          <div className="space-y-2">
            {completionItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  )}
                  <span className={item.completed ? "text-gray-700" : "text-gray-500"}>{item.title}</span>
                </div>
                {!item.completed && (
                  <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Link href={item.path}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
