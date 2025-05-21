"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Calendar, Clock, Filter, Search, Check, X, MoreHorizontal, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

// Mock data for bookings
const mockBookings = [
  {
    id: "b1",
    client: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?text=AC",
      email: "alex@example.com",
      phone: "+1 (555) 123-4567",
    },
    date: "2025-05-20T14:00:00",
    duration: 180, // in minutes
    service: "Full Sleeve Design",
    design: {
      name: "Cyberpunk Arm",
      image: "/images/tattoo-cyberpunk.png",
    },
    status: "confirmed",
    notes: "Client wants to incorporate circuit board patterns and neon elements.",
    deposit: 150,
    totalPrice: 800,
  },
  {
    id: "b2",
    client: {
      name: "Jordan Smith",
      avatar: "/placeholder.svg?text=JS",
      email: "jordan@example.com",
      phone: "+1 (555) 987-6543",
    },
    date: "2025-05-21T10:00:00",
    duration: 120, // in minutes
    service: "Half Sleeve",
    design: {
      name: "Japanese Koi",
      image: "/images/tattoo-japanese.png",
    },
    status: "confirmed",
    notes: "Client is interested in traditional Japanese style with water elements.",
    deposit: 100,
    totalPrice: 600,
  },
  {
    id: "b3",
    client: {
      name: "Riley Thompson",
      avatar: "/placeholder.svg?text=RT",
      email: "riley@example.com",
      phone: "+1 (555) 456-7890",
    },
    date: "2025-05-21T15:30:00",
    duration: 60, // in minutes
    service: "Consultation",
    design: {
      name: "Custom Design",
      image: "/placeholder.svg?text=Consultation",
    },
    status: "pending",
    notes: "Initial consultation for a back piece. Client has reference images to share.",
    deposit: 0,
    totalPrice: 0,
  },
  {
    id: "b4",
    client: {
      name: "Taylor Kim",
      avatar: "/placeholder.svg?text=TK",
      email: "taylor@example.com",
      phone: "+1 (555) 789-0123",
    },
    date: "2025-05-22T13:00:00",
    duration: 240, // in minutes
    service: "Back Piece",
    design: {
      name: "Geometric Mandala",
      image: "/images/tattoo-blackwork.png",
    },
    status: "confirmed",
    notes: "Second session for the back piece. Focus on shading the central elements.",
    deposit: 200,
    totalPrice: 1200,
  },
  {
    id: "b5",
    client: {
      name: "Morgan Lee",
      avatar: "/placeholder.svg?text=ML",
      email: "morgan@example.com",
      phone: "+1 (555) 234-5678",
    },
    date: "2025-05-23T11:00:00",
    duration: 90, // in minutes
    service: "Forearm Piece",
    design: {
      name: "Watercolor Abstract",
      image: "/images/tattoo-watercolor.png",
    },
    status: "cancelled",
    notes: "Client had to cancel due to personal emergency. Deposit refunded.",
    deposit: 0,
    totalPrice: 0,
  },
  {
    id: "b6",
    client: {
      name: "Casey Johnson",
      avatar: "/placeholder.svg?text=CJ",
      email: "casey@example.com",
      phone: "+1 (555) 345-6789",
    },
    date: "2025-05-25T16:00:00",
    duration: 150, // in minutes
    service: "Thigh Piece",
    design: {
      name: "Botanical Lines",
      image: "/images/tattoo-fineline.png",
    },
    status: "confirmed",
    notes: "Client wants fine line botanical design with minimal shading.",
    deposit: 120,
    totalPrice: 550,
  },
]

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState(mockBookings)
  const [filteredBookings, setFilteredBookings] = useState(mockBookings)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("upcoming")
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter bookings based on search query and filters
    let filtered = [...bookings]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    // Apply date filter
    const now = new Date()
    if (dateFilter === "upcoming") {
      filtered = filtered.filter((booking) => new Date(booking.date) >= now)
    } else if (dateFilter === "past") {
      filtered = filtered.filter((booking) => new Date(booking.date) < now)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (booking) =>
          booking.client.name.toLowerCase().includes(query) ||
          booking.service.toLowerCase().includes(query) ||
          booking.design.name.toLowerCase().includes(query),
      )
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    setFilteredBookings(filtered)
  }, [bookings, searchQuery, statusFilter, dateFilter])

  const handleStatusChange = (bookingId, newStatus) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking,
    )
    setBookings(updatedBookings)

    toast({
      title: "Booking updated",
      description: `Booking status changed to ${newStatus}.`,
    })
  }

  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatTime = (dateString) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true }
    return new Date(dateString).toLocaleTimeString(undefined, options)
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours > 0 ? `${hours}h` : ""} ${mins > 0 ? `${mins}m` : ""}`
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-600">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-600">Cancelled</Badge>
      case "completed":
        return <Badge className="bg-blue-600">Completed</Badge>
      default:
        return <Badge className="bg-gray-600">Unknown</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-950 to-purple-950 text-white">
      <header className="border-b border-purple-900 bg-black/50 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/artist/dashboard")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Bookings</h1>
            <p className="text-sm text-purple-300">Manage your appointments and consultations</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-purple-300">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-purple-300">Date</label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Dates</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="past">Past</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      className="w-full bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                      onClick={() => {
                        setStatusFilter("all")
                        setDateFilter("all")
                        setSearchQuery("")
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300">Today</span>
                    <span className="font-bold text-white">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300">This Week</span>
                    <span className="font-bold text-white">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300">This Month</span>
                    <span className="font-bold text-white">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300">Pending</span>
                    <span className="font-bold text-white">3</span>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full bg-purple-700 hover:bg-purple-600">
                <Calendar className="mr-2 h-4 w-4" />
                Create New Booking
              </Button>
            </div>

            {/* Main content */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/40 border-purple-500/30"
                  />
                </div>
                <Button variant="outline" className="bg-black/40 border-purple-500/30">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced
                </Button>
              </div>

              <Tabs defaultValue="list" className="w-full">
                <TabsList className="bg-black/40 border border-purple-500/30 p-1">
                  <TabsTrigger value="list" className="data-[state=active]:bg-purple-700">
                    List View
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="data-[state=active]:bg-purple-700">
                    Calendar View
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="mt-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="bg-black/40 border-purple-500/30 animate-pulse">
                          <CardContent className="p-4 h-24"></CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <Card className="bg-black/40 border-purple-500/30">
                      <CardContent className="p-6 text-center">
                        <p className="text-purple-300">No bookings found matching your filters.</p>
                        <Button
                          variant="link"
                          className="mt-2 text-purple-400"
                          onClick={() => {
                            setStatusFilter("all")
                            setDateFilter("all")
                            setSearchQuery("")
                          }}
                        >
                          Clear filters
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {filteredBookings.map((booking) => (
                        <Card
                          key={booking.id}
                          className="bg-black/40 border-purple-500/30 hover:bg-black/50 transition-colors"
                        >
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-purple-500">
                                  <AvatarImage
                                    src={booking.client.avatar || "/placeholder.svg"}
                                    alt={booking.client.name}
                                  />
                                  <AvatarFallback>{booking.client.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium text-white">{booking.client.name}</h3>
                                  <p className="text-sm text-purple-300">{booking.service}</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                                <div className="flex flex-col">
                                  <div className="flex items-center text-sm text-purple-300">
                                    <Calendar className="mr-1 h-4 w-4" />
                                    {formatDate(booking.date)}
                                  </div>
                                  <div className="flex items-center text-sm text-purple-300">
                                    <Clock className="mr-1 h-4 w-4" />
                                    {formatTime(booking.date)} ({formatDuration(booking.duration)})
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {getStatusBadge(booking.status)}
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setSelectedBooking(booking)}
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-gray-900 border-purple-500/30 text-white">
                                      <DialogHeader>
                                        <DialogTitle>Booking Details</DialogTitle>
                                        <DialogDescription className="text-purple-300">
                                          View and manage booking information
                                        </DialogDescription>
                                      </DialogHeader>

                                      {selectedBooking && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                          <div className="space-y-4">
                                            <div>
                                              <h4 className="text-sm font-medium text-purple-300">Client</h4>
                                              <div className="flex items-center gap-2 mt-1">
                                                <Avatar className="h-8 w-8">
                                                  <AvatarImage
                                                    src={selectedBooking.client.avatar || "/placeholder.svg"}
                                                    alt={selectedBooking.client.name}
                                                  />
                                                  <AvatarFallback>{selectedBooking.client.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                  <p className="font-medium text-white">
                                                    {selectedBooking.client.name}
                                                  </p>
                                                  <p className="text-xs text-purple-300">
                                                    {selectedBooking.client.email}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>

                                            <div>
                                              <h4 className="text-sm font-medium text-purple-300">Appointment</h4>
                                              <p className="text-white">
                                                {formatDate(selectedBooking.date)} at {formatTime(selectedBooking.date)}
                                              </p>
                                              <p className="text-sm text-purple-300">
                                                Duration: {formatDuration(selectedBooking.duration)}
                                              </p>
                                            </div>

                                            <div>
                                              <h4 className="text-sm font-medium text-purple-300">Service</h4>
                                              <p className="text-white">{selectedBooking.service}</p>
                                              <p className="text-sm text-purple-300">
                                                Design: {selectedBooking.design.name}
                                              </p>
                                            </div>

                                            <div>
                                              <h4 className="text-sm font-medium text-purple-300">Payment</h4>
                                              <p className="text-white">
                                                Deposit: ${selectedBooking.deposit.toFixed(2)}
                                              </p>
                                              <p className="text-white">
                                                Total: ${selectedBooking.totalPrice.toFixed(2)}
                                              </p>
                                            </div>
                                          </div>

                                          <div className="space-y-4">
                                            <div>
                                              <h4 className="text-sm font-medium text-purple-300">Design Preview</h4>
                                              <div className="mt-1 rounded-md overflow-hidden aspect-square">
                                                <img
                                                  src={selectedBooking.design.image || "/placeholder.svg"}
                                                  alt={selectedBooking.design.name}
                                                  className="w-full h-full object-cover"
                                                />
                                              </div>
                                            </div>

                                            <div>
                                              <h4 className="text-sm font-medium text-purple-300">Notes</h4>
                                              <p className="text-sm text-white mt-1">{selectedBooking.notes}</p>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button
                                              variant="outline"
                                              className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                                            >
                                              Change Status <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent className="bg-gray-900 border-purple-500/30 text-white">
                                            <DropdownMenuItem
                                              onClick={() => handleStatusChange(selectedBooking?.id, "confirmed")}
                                            >
                                              <Check className="mr-2 h-4 w-4 text-green-500" />
                                              Confirm
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() => handleStatusChange(selectedBooking?.id, "completed")}
                                            >
                                              <Check className="mr-2 h-4 w-4 text-blue-500" />
                                              Mark as Completed
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() => handleStatusChange(selectedBooking?.id, "cancelled")}
                                            >
                                              <X className="mr-2 h-4 w-4 text-red-500" />
                                              Cancel
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                        <Button className="bg-purple-700 hover:bg-purple-600">Edit Booking</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="calendar" className="mt-4">
                  <Card className="bg-black/40 border-purple-500/30">
                    <CardContent className="p-6">
                      <p className="text-center text-purple-300">Calendar view coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
