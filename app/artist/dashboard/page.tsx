"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarIcon,
  MessageSquare,
  Upload,
  Settings,
  LogOut,
  Bell,
  Users,
  BarChart3,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle, CardHeader, CardFooter } from "@/components/ui/card"
import { ArtistStatsCards } from "@/components/artist-stats-cards"
import { UpcomingBookings } from "@/components/upcoming-bookings"
import { RecentMessages } from "@/components/recent-messages"
import { PortfolioPreview } from "@/components/portfolio-preview"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/app/contexts/AuthContext"
import { signOut } from "@/app/actions/auth-actions"

export default function ArtistDashboard() {
  const router = useRouter()
  const { logout } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [hasNotifications, setHasNotifications] = useState(true)

  // Mock data for calendar
  const calendarEvents = [
    { date: new Date(2025, 4, 20), count: 3, type: "booking" },
    { date: new Date(2025, 4, 22), count: 1, type: "booking" },
    { date: new Date(2025, 4, 25), count: 2, type: "booking" },
    { date: new Date(2025, 4, 21), count: 1, type: "consultation" },
    { date: new Date(2025, 4, 28), count: 1, type: "consultation" },
  ]

  // Mock data for analytics
  const analyticsData = {
    profileViews: 243,
    profileViewsChange: 12,
    bookingRequests: 18,
    bookingRequestsChange: 5,
    conversionRate: 42,
    averageResponseTime: "2.5 hours",
  }

  // Mock data for clients
  const recentClients = [
    {
      id: "c1",
      name: "Alex Chen",
      email: "alex@example.com",
      lastVisit: "May 15, 2025",
      status: "active",
      avatar: "/placeholder.svg?text=AC",
      completedSessions: 3,
      upcomingSessions: 1,
    },
    {
      id: "c2",
      name: "Jordan Smith",
      email: "jordan@example.com",
      lastVisit: "May 10, 2025",
      status: "active",
      avatar: "/placeholder.svg?text=JS",
      completedSessions: 1,
      upcomingSessions: 2,
    },
    {
      id: "c3",
      name: "Taylor Kim",
      email: "taylor@example.com",
      lastVisit: "April 28, 2025",
      status: "inactive",
      avatar: "/placeholder.svg?text=TK",
      completedSessions: 2,
      upcomingSessions: 0,
    },
  ]

  const handleSignOut = async () => {
    setIsSigningOut(true)

    try {
      // First, call the server action to handle server-side logout
      const result = await signOut()

      if (!result.success) {
        throw new Error(result.error || "Server-side sign out failed")
      }

      // Then, call the client-side logout from AuthContext
      await logout()

      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      })

      // Redirect to auth page with a slight delay to ensure state updates
      setTimeout(() => {
        router.push("/auth")
      }, 100)
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  const handleNotificationClick = () => {
    setHasNotifications(false)
    toast({
      title: "Notifications cleared",
      description: "You have cleared all your notifications.",
    })
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)
    const monthName = currentMonth.toLocaleString("default", { month: "long" })

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const events = calendarEvents.filter(
        (event) => event.date.getDate() === day && event.date.getMonth() === month && event.date.getFullYear() === year,
      )

      const hasBooking = events.some((event) => event.type === "booking")
      const hasConsultation = events.some((event) => event.type === "consultation")

      days.push(
        <div
          key={`day-${day}`}
          className={`h-10 w-10 flex items-center justify-center rounded-full relative ${
            events.length > 0 ? "font-bold" : ""
          }`}
        >
          {day}
          {hasBooking && <span className="absolute bottom-0 right-0 w-2 h-2 bg-purple-500 rounded-full"></span>}
          {hasConsultation && <span className="absolute bottom-0 left-0 w-2 h-2 bg-blue-500 rounded-full"></span>}
        </div>,
      )
    }

    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">
            {monthName} {year}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
              onClick={() => {
                const newMonth = new Date(currentMonth)
                newMonth.setMonth(newMonth.getMonth() - 1)
                setCurrentMonth(newMonth)
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
              onClick={() => {
                const newMonth = new Date(currentMonth)
                newMonth.setMonth(newMonth.getMonth() + 1)
                setCurrentMonth(newMonth)
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-xs text-purple-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">{days}</div>
        <div className="flex gap-4 mt-4 text-xs">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            <span className="text-purple-300">Bookings</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-purple-300">Consultations</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-950 to-purple-950 text-white">
      <header className="border-b border-purple-900 bg-black/50 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Artist Dashboard</h1>
            <p className="text-sm text-purple-300">Welcome back, Ink Alchemist</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative" onClick={handleNotificationClick}>
              <Bell className="h-5 w-5 text-purple-300" />
              {hasNotifications && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
            </Button>
            <Button
              variant="outline"
              className="border-purple-700 bg-transparent text-white hover:bg-purple-900"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
          <ArtistStatsCards />

          <div className="mt-8">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-black/40 border border-purple-500/30 p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-purple-700">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="calendar" className="data-[state=active]:bg-purple-700">
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-700">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="clients" className="data-[state=active]:bg-purple-700">
                  Clients
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold text-white">Quick Actions</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <Link href="/artist/profile-management" passHref>
                      <Card className="bg-black/40 border-purple-500/30 text-white hover:bg-black/50 transition-colors">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <Settings className="mb-2 h-8 w-8 text-purple-500" />
                          <CardTitle className="mb-1 text-center">Manage Profile</CardTitle>
                          <CardDescription className="text-center text-purple-300">
                            Update your profile information and portfolio
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/artist/bookings" passHref>
                      <Card className="bg-black/40 border-purple-500/30 text-white hover:bg-black/50 transition-colors relative">
                        <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                          3
                        </span>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <CalendarIcon className="mb-2 h-8 w-8 text-purple-500" />
                          <CardTitle className="mb-1 text-center">Manage Bookings</CardTitle>
                          <CardDescription className="text-center text-purple-300">
                            3 upcoming appointments this week
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/artist/messages" passHref>
                      <Card className="bg-black/40 border-purple-500/30 text-white hover:bg-black/50 transition-colors relative">
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                          5
                        </span>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <MessageSquare className="mb-2 h-8 w-8 text-purple-500" />
                          <CardTitle className="mb-1 text-center">Client Messages</CardTitle>
                          <CardDescription className="text-center text-purple-300">
                            5 unread messages to respond to
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/artist/portfolio/upload" passHref>
                      <Card className="bg-black/40 border-purple-500/30 text-white hover:bg-black/50 transition-colors">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <Upload className="mb-2 h-8 w-8 text-purple-500" />
                          <CardTitle className="mb-1 text-center">Upload Work</CardTitle>
                          <CardDescription className="text-center text-purple-300">
                            Last upload: 3 days ago
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <div>
                    <h2 className="mb-4 text-xl font-semibold text-white">Upcoming Bookings</h2>
                    <UpcomingBookings />
                  </div>
                  <div>
                    <h2 className="mb-4 text-xl font-semibold text-white">Recent Messages</h2>
                    <RecentMessages />
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="mb-4 text-xl font-semibold text-white">Portfolio Preview</h2>
                  <PortfolioPreview />
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="md:col-span-2 bg-black/40 border-purple-500/30">
                    <CardHeader>
                      <CardTitle>Appointment Calendar</CardTitle>
                      <CardDescription className="text-purple-300">
                        View and manage your upcoming appointments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>{renderCalendar()}</CardContent>
                    <CardFooter>
                      <Button className="w-full bg-purple-700 hover:bg-purple-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Appointment
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-black/40 border-purple-500/30">
                    <CardHeader>
                      <CardTitle>Upcoming Schedule</CardTitle>
                      <CardDescription className="text-purple-300">Your next 7 days</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-purple-300">Today</h4>
                        <div className="bg-purple-950/50 border border-purple-500/20 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-white">Alex Chen</p>
                              <p className="text-sm text-purple-300">Cyberpunk Sleeve</p>
                            </div>
                            <Badge className="bg-green-600">2:00 PM</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-purple-300">Tomorrow</h4>
                        <div className="bg-purple-950/50 border border-purple-500/20 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-white">Jordan Smith</p>
                              <p className="text-sm text-purple-300">Geometric Wolf</p>
                            </div>
                            <Badge className="bg-green-600">10:00 AM</Badge>
                          </div>
                        </div>
                        <div className="bg-purple-950/50 border border-purple-500/20 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-white">Riley Thompson</p>
                              <p className="text-sm text-purple-300">Consultation</p>
                            </div>
                            <Badge className="bg-blue-600">3:30 PM</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-purple-300">May 20</h4>
                        <div className="bg-purple-950/50 border border-purple-500/20 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-white">Taylor Kim</p>
                              <p className="text-sm text-purple-300">Neon Dragon</p>
                            </div>
                            <Badge className="bg-green-600">3:30 PM</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-black/40 border-purple-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Profile Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col">
                        <div className="text-3xl font-bold text-white">{analyticsData.profileViews}</div>
                        <div className="flex items-center mt-1">
                          <Badge className="bg-green-600 text-xs">+{analyticsData.profileViewsChange}%</Badge>
                          <span className="text-xs text-purple-300 ml-2">vs last month</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-purple-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Booking Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col">
                        <div className="text-3xl font-bold text-white">{analyticsData.bookingRequests}</div>
                        <div className="flex items-center mt-1">
                          <Badge className="bg-green-600 text-xs">+{analyticsData.bookingRequestsChange}%</Badge>
                          <span className="text-xs text-purple-300 ml-2">vs last month</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-purple-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Conversion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col">
                        <div className="text-3xl font-bold text-white">{analyticsData.conversionRate}%</div>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-purple-300">Views to bookings</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2 bg-black/40 border-purple-500/30">
                    <CardHeader>
                      <CardTitle>Portfolio Performance</CardTitle>
                      <CardDescription className="text-purple-300">
                        Which of your works are getting the most attention
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-purple-900/30">
                              <img
                                src="/images/tattoo-cyberpunk.png"
                                alt="Cyberpunk Arm"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-white">Cyberpunk Arm</p>
                              <p className="text-xs text-purple-300">124 views</p>
                            </div>
                          </div>
                          <Progress value={85} className="w-1/3 h-2 bg-purple-950/70" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-purple-900/30">
                              <img
                                src="/images/tattoo-japanese.png"
                                alt="Koi Warrior"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-white">Neon Samurai</p>
                              <p className="text-xs text-purple-300">98 views</p>
                            </div>
                          </div>
                          <Progress value={65} className="w-1/3 h-2 bg-purple-950/70" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-purple-900/30">
                              <img
                                src="/images/tattoo-watercolor.png"
                                alt="Watercolor Wave"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-white">Digital Wave</p>
                              <p className="text-xs text-purple-300">156 views</p>
                            </div>
                          </div>
                          <Progress value={100} className="w-1/3 h-2 bg-purple-950/70" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-purple-500/30">
                    <CardHeader>
                      <CardTitle>Response Time</CardTitle>
                      <CardDescription className="text-purple-300">
                        How quickly you respond to inquiries
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center h-40">
                        <Clock className="h-12 w-12 text-purple-400 mb-2" />
                        <div className="text-3xl font-bold text-white">{analyticsData.averageResponseTime}</div>
                        <p className="text-sm text-purple-300 mt-1">Average response time</p>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-purple-500/20 pt-4">
                      <p className="text-xs text-purple-300 w-full text-center">
                        Faster responses can increase your booking rate by up to 35%
                      </p>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="clients" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="md:col-span-2 bg-black/40 border-purple-500/30">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Recent Clients</CardTitle>
                        <CardDescription className="text-purple-300">Manage your client relationships</CardDescription>
                      </div>
                      <Button className="bg-purple-700 hover:bg-purple-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Client
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentClients.map((client) => (
                          <div
                            key={client.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-purple-950/50 border border-purple-500/20"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.name} />
                                <AvatarFallback className="bg-purple-800 text-white">
                                  {client.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium text-white">{client.name}</h4>
                                <p className="text-sm text-purple-300">{client.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-sm font-medium text-white">Last visit: {client.lastVisit}</p>
                                <Badge
                                  variant={client.status === "active" ? "default" : "outline"}
                                  className={
                                    client.status === "active" ? "bg-green-600" : "border-yellow-500 text-yellow-500"
                                  }
                                >
                                  {client.status === "active" ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                              >
                                <Link href={`/artist/clients/${client.id}`}>View</Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-purple-500/20 pt-4 flex justify-center">
                      <Button
                        variant="outline"
                        className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                      >
                        View All Clients
                      </Button>
                    </CardFooter>
                  </Card>

                  <div className="space-y-6">
                    <Card className="bg-black/40 border-purple-500/30">
                      <CardHeader>
                        <CardTitle>Client Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300">Total Clients</span>
                          <span className="font-bold text-white">24</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300">Active Clients</span>
                          <span className="font-bold text-white">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300">New This Month</span>
                          <span className="font-bold text-white">5</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300">Retention Rate</span>
                          <span className="font-bold text-white">78%</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/40 border-purple-500/30">
                      <CardHeader>
                        <CardTitle>Client Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Import Clients
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Group Message
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Export Client Data
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
