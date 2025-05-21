"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  CalendarIcon,
  Upload,
  Search,
  ArrowRight,
  ArrowLeft,
  Camera,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Home,
  Library,
  Crosshair,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"

interface MatchPreferences {
  image: string | null
  style: string
  price: number[]
  date: Date | undefined
  startTime: string
  endTime: string
  location: string
  radius: number
  experience: string
}

interface Artist {
  id: number
  name: string
  avatar: string
  specialization: string
  rating: number
  distance: number
  hourlyRate: number
  portfolio: string[]
  bio: string
  instagram: string
  facebook: string
  website: string
  lat: number
  lng: number
  changePercent: number
}

const styles = [
  { name: "Neo-Traditional", icon: "🌺" },
  { name: "Blackwork", icon: "⚫" },
  { name: "Watercolor", icon: "🎨" },
  { name: "Geometric", icon: "🔷" },
  { name: "Minimalist", icon: "➖" },
  { name: "Realism", icon: "📷" },
  { name: "Japanese", icon: "🌸" },
  { name: "Biomechanical", icon: "🦾" },
]

const mockArtists: Artist[] = [
  {
    id: 1,
    name: "Neo Ink",
    avatar: "/placeholder.svg?text=NI",
    specialization: "Neo-Traditional",
    rating: 4.8,
    distance: 2.3,
    hourlyRate: 150,
    portfolio: [
      "/images/tattoo-mythological.png",
      "/images/tattoo-illuminati-hand.png",
      "/images/tattoo-symbolic-patchwork.png",
      "/images/tattoo-mandala-sleeves.png",
    ],
    bio: "Specializing in vibrant neo-traditional designs with a modern twist.",
    instagram: "neoink",
    facebook: "neoinkstudio",
    website: "neoink.com",
    lat: 40.7128,
    lng: -74.006,
    changePercent: 5.2,
  },
  {
    id: 2,
    name: "Blackwork Beast",
    avatar: "/placeholder.svg?text=BB",
    specialization: "Blackwork",
    rating: 4.6,
    distance: 3.1,
    hourlyRate: 130,
    portfolio: [
      "/images/tattoo-fineline-bird.jpeg",
      "/images/tattoo-graphic-style.jpeg",
      "/images/tattoo-blackwork.png",
      "/images/tattoo-japanese.png",
    ],
    bio: "Bold, intricate blackwork designs that make a statement.",
    instagram: "blackworkbeast",
    facebook: "blackworkbeastart",
    website: "blackworkbeast.art",
    lat: 40.7282,
    lng: -73.9942,
    changePercent: -2.1,
  },
  {
    id: 3,
    name: "Watercolor Wonder",
    avatar: "/placeholder.svg?text=WW",
    specialization: "Watercolor",
    rating: 4.9,
    distance: 1.8,
    hourlyRate: 180,
    portfolio: [
      "/images/tattoo-watercolor.png",
      "/images/tattoo-cyberpunk.png",
      "/images/tattoo-geometric.png",
      "/images/tattoo-neotraditional.png",
    ],
    bio: "Bringing your ideas to life with vibrant watercolor techniques.",
    instagram: "watercolorwonder",
    facebook: "watercolorwondertattoo",
    website: "watercolorwonder.ink",
    lat: 40.7589,
    lng: -73.9851,
    changePercent: 8.7,
  },
]

export default function MatchesPage() {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(25)
  const [preferences, setPreferences] = useState<MatchPreferences>({
    image: null,
    style: "",
    price: [200],
    date: undefined,
    startTime: "",
    endTime: "",
    location: "",
    radius: 10,
    experience: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [matchedArtists, setMatchedArtists] = useState<Artist[]>([])
  const [showMap, setShowMap] = useState(false)
  const [locationMethod, setLocationMethod] = useState<"manual" | "current">("manual")
  const [comparisonArtists, setComparisonArtists] = useState<Artist[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [activeComparisonTab, setActiveComparisonTab] = useState<string>("overview")

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreferences((prev) => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
    setProgress((prev) => Math.min(100, prev + 25))
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
    setProgress((prev) => Math.max(0, prev - 25))
  }

  const findMatches = useCallback(async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setMatchedArtists(mockArtists)
    } catch (error) {
      console.error("Error finding matches:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLocationMethod = (method: "manual" | "current") => {
    setLocationMethod(method)
    if (method === "current") {
      // Simulating geolocation API
      setPreferences((prev) => ({ ...prev, location: "New York, NY" }))
    }
  }

  useEffect(() => {
    if (step === 4) {
      findMatches()
    }
  }, [step, findMatches])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white">
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2">
              <motion.div className="relative w-8 h-8" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dog%20face%20image%20background-80tC7pNknHSwIU4KYQODUQRYlZl8t1.png"
                  alt="Tattit Logo"
                  fill
                  className="object-contain"
                />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                Find Your Artist
              </h1>
            </Link>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Profile" />
              <AvatarFallback>TT</AvatarFallback>
            </Avatar>
          </div>
          <Progress value={progress} className="h-1 bg-purple-950" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Share Your Vision</h2>
                  <p className="text-purple-300">Upload a reference image or take a photo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center transition-all hover:border-purple-500/50">
                      <label className="cursor-pointer block">
                        <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        <Upload className="w-12 h-12 mx-auto text-purple-400 mb-4" />
                        <p className="text-sm text-purple-300">Drag and drop or click to upload</p>
                      </label>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Take Photo
                    </Button>
                  </div>

                  {preferences.image ? (
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-purple-900/20">
                      <Image
                        src={preferences.image || "/placeholder.svg"}
                        alt="Reference image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg bg-purple-900/20 flex items-center justify-center">
                      <p className="text-purple-300">Preview will appear here</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={nextStep}
                  className="w-full bg-purple-700 hover:bg-purple-600"
                  disabled={!preferences.image}
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Choose Your Style</h2>
                  <p className="text-purple-300">Select the style that matches your vision</p>
                </div>

                <RadioGroup
                  value={preferences.style}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, style: value }))}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {styles.map((style) => (
                    <div key={style.name}>
                      <RadioGroupItem value={style.name} id={style.name} className="peer sr-only" />
                      <Label
                        htmlFor={style.name}
                        className="flex flex-col items-center justify-center p-4 border-2 border-purple-500/30 rounded-lg cursor-pointer transition-all hover:bg-purple-900/20 peer-checked:bg-purple-900/40 peer-checked:border-purple-500"
                      >
                        <span className="text-2xl mb-2">{style.icon}</span>
                        <span className="font-medium">{style.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex gap-4">
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1 bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="flex-1 bg-purple-700 hover:bg-purple-600"
                    disabled={!preferences.style}
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Set Your Preferences</h2>
                  <p className="text-purple-300">Tell us about your requirements</p>
                </div>

                <div className="grid gap-6 p-6 bg-purple-900/20 rounded-lg border border-purple-500/30">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-purple-400" />
                      Budget Range
                    </Label>
                    <div className="relative pt-6">
                      <Slider
                        min={50}
                        max={1000}
                        step={10}
                        value={preferences.price}
                        onValueChange={(value) => setPreferences((prev) => ({ ...prev, price: value }))}
                        className="w-full"
                      />
                      <div className="absolute left-0 right-0 top-0 flex justify-between text-sm text-purple-300">
                        <span>$50</span>
                        <span>$1000</span>
                      </div>
                    </div>
                    <div className="text-center text-lg font-semibold text-purple-300">
                      Up to ${preferences.price[0]}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-purple-400" />
                      Location
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter your location"
                        value={preferences.location}
                        onChange={(e) => setPreferences((prev) => ({ ...prev, location: e.target.value }))}
                        className="bg-purple-950/30 border-purple-500/30 flex-grow"
                        disabled={locationMethod === "current"}
                      />
                      <Button
                        variant="outline"
                        className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                        onClick={() => handleLocationMethod(locationMethod === "manual" ? "current" : "manual")}
                      >
                        {locationMethod === "manual" ? (
                          <Crosshair className="h-4 w-4 mr-2" />
                        ) : (
                          <MapPin className="h-4 w-4 mr-2" />
                        )}
                        {locationMethod === "manual" ? "Use Current" : "Enter Manually"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-purple-400" />
                      Search Radius
                    </Label>
                    <div className="relative pt-6">
                      <Slider
                        min={1}
                        max={100}
                        step={1}
                        value={[preferences.radius]}
                        onValueChange={(value) => setPreferences((prev) => ({ ...prev, radius: value[0] }))}
                        className="w-full"
                      />
                      <div className="absolute left-0 right-0 top-0 flex justify-between text-sm text-purple-300">
                        <span>1 mile</span>
                        <span>100 miles</span>
                      </div>
                    </div>
                    <div className="text-center text-lg font-semibold text-purple-300">{preferences.radius} miles</div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-400" />
                      Preferred Date and Time Range
                    </Label>
                    <div className="flex flex-col gap-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left bg-purple-950/30 border-purple-500/30",
                              !preferences.date && "text-purple-300",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {preferences.date ? format(preferences.date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={preferences.date}
                            onSelect={(date) => setPreferences((prev) => ({ ...prev, date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <div className="flex gap-4">
                        <Select
                          value={preferences.startTime}
                          onValueChange={(value) => setPreferences((prev) => ({ ...prev, startTime: value }))}
                        >
                          <SelectTrigger className="w-full bg-purple-950/30 border-purple-500/30">
                            <SelectValue placeholder="Start time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                              <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                                {`${hour.toString().padStart(2, "0")}:00`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={preferences.endTime}
                          onValueChange={(value) => setPreferences((prev) => ({ ...prev, endTime: value }))}
                        >
                          <SelectTrigger className="w-full bg-purple-950/30 border-purple-500/30">
                            <SelectValue placeholder="End time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                              <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                                {`${hour.toString().padStart(2, "0")}:00`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-purple-400" />
                      Artist Experience
                    </Label>
                    <RadioGroup
                      value={preferences.experience}
                      onValueChange={(value) => setPreferences((prev) => ({ ...prev, experience: value }))}
                      className="grid grid-cols-3 gap-4"
                    >
                      {["Any", "Intermediate", "Expert"].map((level) => (
                        <div key={level}>
                          <RadioGroupItem value={level} id={`experience-${level}`} className="peer sr-only" />
                          <Label
                            htmlFor={`experience-${level}`}
                            className="flex items-center justify-center p-2 border-2 border-purple-500/30 rounded-lg cursor-pointer transition-all hover:bg-purple-900/20 peer-checked:bg-purple-900/40 peer-checked:border-purple-500"
                          >
                            {level}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1 bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="flex-1 bg-purple-700 hover:bg-purple-600"
                    disabled={!preferences.location || !preferences.date || !preferences.experience}
                  >
                    Find Matches <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Perfect Matches</h2>
                    <p className="text-purple-300">Discover artists that match your style</p>
                  </div>
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-[180px] bg-purple-950/30 border-purple-500/30">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-end mb-4">
                      <Button
                        onClick={() => setShowMap(!showMap)}
                        variant="outline"
                        className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                      >
                        {showMap ? "Hide Map" : "Show Map"}
                      </Button>
                    </div>

                    {showMap && isLoaded && (
                      <div className="h-96 w-full rounded-lg overflow-hidden mb-6">
                        <GoogleMap
                          mapContainerStyle={{ width: "100%", height: "100%" }}
                          center={{ lat: 40.7128, lng: -74.006 }}
                          zoom={12}
                        >
                          {matchedArtists.map((artist) => (
                            <Marker
                              key={artist.id}
                              position={{ lat: artist.lat, lng: artist.lng }}
                              icon={{
                                url: "/marker.svg",
                                scaledSize: new window.google.maps.Size(30, 30),
                              }}
                            />
                          ))}
                        </GoogleMap>
                      </div>
                    )}

                    <div className="grid gap-4">
                      {matchedArtists.map((artist) => (
                        <motion.div
                          key={artist.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="group relative overflow-hidden bg-purple-900/20 rounded-lg border border-purple-500/30 transition-all hover:bg-purple-900/40"
                        >
                          <div className="p-4 flex items-center gap-4">
                            <div className="relative">
                              <Avatar className="h-16 w-16 ring-2 ring-purple-500">
                                <AvatarImage src={artist.avatar || "/placeholder.svg"} alt={artist.name} />
                                <AvatarFallback>{artist.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-1">
                                <Star className="h-3 w-3 text-yellow-300 fill-yellow-300" />
                              </div>
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{artist.name}</h3>
                                <div className="flex items-center gap-1 text-sm">
                                  <span className="text-purple-300">Match Score:</span>
                                  <span className="font-medium text-green-400">
                                    {Math.floor(Math.random() * 21) + 80}%
                                  </span>
                                </div>
                              </div>
                              <p className="text-purple-300 text-sm">{artist.specialization}</p>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-purple-300">${artist.hourlyRate}/hr</span>
                                <span className="text-purple-300">{artist.distance} miles</span>
                              </div>
                            </div>
                          </div>
                          <div className="relative h-32 overflow-hidden">
                            <div className="absolute inset-0 flex transition-transform duration-300 ease-in-out hover:translate-x-[-75%]">
                              {artist.portfolio.map((work, index) => (
                                <div key={index} className="flex-shrink-0 w-full h-full">
                                  <Image
                                    src={work || "/placeholder.svg"}
                                    alt={`Work sample ${index + 1}`}
                                    width={300}
                                    height={128}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="p-4 flex justify-between items-center border-t border-purple-500/30">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span className="font-medium">{artist.rating}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs bg-purple-900/30 border-purple-400/30 hover:bg-purple-800/50"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Open comparison dialog with this artist
                                  setComparisonArtists((prev) => {
                                    // Toggle artist in comparison list
                                    const exists = prev.some((a) => a.id === artist.id)
                                    if (exists) {
                                      return prev.filter((a) => a.id !== artist.id)
                                    } else {
                                      return prev.length < 3 ? [...prev, artist] : [...prev.slice(1), artist]
                                    }
                                  })
                                }}
                              >
                                {comparisonArtists?.some((a) => a.id === artist.id) ? "Remove Compare" : "Compare"}
                              </Button>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="bg-purple-700 hover:bg-purple-600">View Profile</Button>
                              </DialogTrigger>
                              <DialogContent className="bg-gray-950 text-white border border-purple-500 max-w-3xl max-h-[90vh] overflow-y-auto">
                                <div className="space-y-6">
                                  <div className="flex items-center gap-4">
                                    <Avatar className="h-24 w-24 ring-2 ring-purple-500">
                                      <AvatarImage src={artist.avatar || "/placeholder.svg"} alt={artist.name} />
                                      <AvatarFallback>{artist.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h2 className="text-3xl font-bold">{artist.name}</h2>
                                      <p className="text-xl text-purple-300">{artist.specialization} Specialist</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between bg-purple-900/20 p-4 rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <Star className="h-6 w-6 text-yellow-400" />
                                      <span className="text-xl">{artist.rating}/5</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-6 w-6 text-purple-400" />
                                      <span className="text-xl">{artist.distance} miles away</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="h-6 w-6 text-green-400" />
                                      <span className="text-xl">${artist.hourlyRate}/hr</span>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="text-2xl font-semibold mb-2">About Me</h3>
                                    <p className="text-gray-300 text-lg">{artist.bio}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-2xl font-semibold mb-2">Portfolio</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                      {artist.portfolio.map((work, index) => (
                                        <div key={index} className="aspect-square rounded-lg overflow-hidden">
                                          <Image
                                            src={work || "/placeholder.svg"}
                                            alt={`Work sample ${index + 1}`}
                                            width={400}
                                            height={400}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="text-2xl font-semibold mb-2">Reviews</h3>
                                    <div className="space-y-4">
                                      {[
                                        { name: "Alex", rating: 5, comment: "Incredible work! Exactly what I wanted." },
                                        {
                                          name: "Sam",
                                          rating: 4,
                                          comment: "Great artist, very professional. Slightly pricey.",
                                        },
                                        {
                                          name: "Jordan",
                                          rating: 5,
                                          comment: "Amazing attention to detail. Highly recommend!",
                                        },
                                      ].map((review, index) => (
                                        <div key={index} className="bg-purple-900/20 p-4 rounded-lg">
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">{review.name}</span>
                                            <div className="flex items-center">
                                              {Array.from({ length: review.rating }).map((_, i) => (
                                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                              ))}
                                            </div>
                                          </div>
                                          <p className="text-gray-300">{review.comment}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="text-2xl font-semibold mb-2">Socials</h3>
                                    <div className="flex gap-4">
                                      <Link
                                        href={`https://instagram.com/${artist.instagram}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-purple-400"
                                      >
                                        Instagram
                                      </Link>
                                      <Link
                                        href={`https://facebook.com/${artist.facebook}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-purple-400"
                                      >
                                        Facebook
                                      </Link>
                                      <Link
                                        href={`https://${artist.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-purple-400"
                                      >
                                        Website
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <Button
                      onClick={() => {
                        setStep(1)
                        setProgress(25)
                        setPreferences({
                          image: null,
                          style: "",
                          price: [200],
                          date: undefined,
                          startTime: "",
                          endTime: "",
                          location: "",
                          radius: 10,
                          experience: "",
                        })
                      }}
                      variant="outline"
                      className="w-full bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50 mt-6"
                    >
                      Start New Search
                    </Button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Comparison Dialog */}
      {comparisonArtists.length > 0 && (
        <>
          <div className="fixed bottom-16 right-4 z-10">
            <Button
              onClick={() => setShowComparison(true)}
              className="bg-purple-700 hover:bg-purple-600 flex items-center gap-2"
            >
              Compare Artists ({comparisonArtists.length})
            </Button>
          </div>

          <Dialog open={showComparison} onOpenChange={setShowComparison}>
            <DialogContent className="bg-gray-950 text-white border border-purple-500 max-w-5xl max-h-[90vh] overflow-y-auto p-0">
              <div className="sticky top-0 z-10 bg-gray-900 p-4 border-b border-purple-500/30">
                <h2 className="text-2xl font-bold">Artist Comparison</h2>
                <p className="text-purple-300 text-sm">Compare artists based on our advanced matching algorithms</p>

                <div className="flex mt-4 border-b border-purple-500/30">
                  {["overview", "portfolio", "style", "attributes", "quality"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveComparisonTab(tab)}
                      className={`px-4 py-2 font-medium text-sm transition-colors ${
                        activeComparisonTab === tab
                          ? "text-white border-b-2 border-purple-500"
                          : "text-purple-300 hover:text-white"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* Your Reference */}
                <div className="mb-6 bg-purple-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Your Reference</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden">
                      <Image
                        src={preferences.image || "/placeholder.svg?text=Your+Design"}
                        alt="Your reference design"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-purple-300">Style: {preferences.style || "Not specified"}</p>
                      <p className="text-sm text-purple-300">Budget: Up to ${preferences.price[0]}</p>
                    </div>
                  </div>
                </div>

                {/* Overview Tab */}
                {activeComparisonTab === "overview" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {comparisonArtists.map((artist) => {
                      const matchScore = Math.floor(Math.random() * 21) + 80
                      return (
                        <div key={artist.id} className="bg-purple-900/20 p-4 rounded-lg relative">
                          <button
                            className="absolute top-2 right-2 text-purple-300 hover:text-white"
                            onClick={() => setComparisonArtists((prev) => prev.filter((a) => a.id !== artist.id))}
                          >
                            ✕
                          </button>

                          <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={artist.avatar || "/placeholder.svg"} alt={artist.name} />
                              <AvatarFallback>{artist.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{artist.name}</h3>
                              <p className="text-sm text-purple-300">{artist.specialization}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-purple-300">Overall Match</span>
                              <span className="font-semibold text-green-400">{matchScore}%</span>
                            </div>
                            <Progress value={matchScore} className="h-2" />
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-purple-300">Portfolio Match</span>
                              <span>{70 + Math.floor(Math.random() * 30)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-300">Style Compatibility</span>
                              <span>{70 + Math.floor(Math.random() * 30)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-300">Attribute Match</span>
                              <span>{70 + Math.floor(Math.random() * 30)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-300">Quality Score</span>
                              <span>{70 + Math.floor(Math.random() * 30)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-300">Price</span>
                              <span>${artist.hourlyRate}/hr</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-300">Distance</span>
                              <span>{artist.distance} miles</span>
                            </div>
                          </div>

                          <Button className="w-full mt-4 bg-purple-700 hover:bg-purple-600">View Profile</Button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Portfolio Match Tab */}
                {activeComparisonTab === "portfolio" && (
                  <div>
                    <div className="bg-purple-900/30 p-4 rounded-lg mb-6">
                      <h3 className="font-semibold mb-2">Cross-Attention Matching Transformer</h3>
                      <p className="text-sm text-purple-300">
                        Our AI analyzes each artist's entire portfolio together, learning cues like consistency, line
                        quality, and color palettes to find the best match for your design.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {comparisonArtists.map((artist) => {
                        const portfolioScore = 70 + Math.floor(Math.random() * 30)
                        return (
                          <div key={artist.id} className="bg-purple-900/20 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold">{artist.name}</h3>
                              <div className="text-lg font-bold text-green-400">{portfolioScore}%</div>
                            </div>

                            <div className="mb-4">
                              <div className="text-sm text-purple-300 mb-1">Portfolio Relevance Score</div>
                              <Progress value={portfolioScore} className="h-2" />
                            </div>

                            <div className="space-y-4">
                              <div>
                                <div className="text-sm text-purple-300 mb-2">Top Matching Works</div>
                                <div className="grid grid-cols-2 gap-2">
                                  {artist.portfolio.slice(0, 4).map((work, index) => (
                                    <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                                      <Image
                                        src={work || "/placeholder.svg"}
                                        alt={`${artist.name}'s work ${index + 1}`}
                                        fill
                                        className="object-cover"
                                      />
                                      <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1">
                                        {90 - index * 5}%
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-purple-300">Style Consistency</span>
                                  <span>{80 + Math.floor(Math.random() * 20)}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-purple-300">Subject Matter Expertise</span>
                                  <span>{70 + Math.floor(Math.random() * 30)}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-purple-300">Technique Relevance</span>
                                  <span>{70 + Math.floor(Math.random() * 30)}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Style Analysis Tab */}
                {activeComparisonTab === "style" && (
                  <div>
                    <div className="bg-purple-900/30 p-4 rounded-lg mb-6">
                      <h3 className="font-semibold mb-2">Style-Conditioned Diffusion "Test Run"</h3>
                      <p className="text-sm text-purple-300">
                        Our AI generates a preview of how your design would look in each artist's style, analyzing their
                        needle thickness, shading style, and overall approach.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {comparisonArtists.map((artist) => {
                        const styleScore = 70 + Math.floor(Math.random() * 30)
                        return (
                          <div key={artist.id} className="bg-purple-900/20 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold">{artist.name}</h3>
                              <div className="text-lg font-bold text-green-400">{styleScore}%</div>
                            </div>

                            <div className="relative aspect-square rounded-lg overflow-hidden mb-4 border border-purple-500/30">
                              <div className="absolute inset-0 flex items-center justify-center bg-purple-900/50 text-sm">
                                AI-generated preview in {artist.name}'s style
                              </div>
                              <Image
                                src={artist.portfolio[0] || "/placeholder.svg"}
                                alt={`Style preview for ${artist.name}`}
                                fill
                                className="object-cover opacity-70"
                              />
                            </div>

                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-purple-300">Line Work</span>
                                  <span>{70 + Math.floor(Math.random() * 30)}%</span>
                                </div>
                                <Progress value={70 + Math.floor(Math.random() * 30)} className="h-1.5" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-purple-300">Shading Technique</span>
                                  <span>{70 + Math.floor(Math.random() * 30)}%</span>
                                </div>
                                <Progress value={70 + Math.floor(Math.random() * 30)} className="h-1.5" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-purple-300">Color Palette</span>
                                  <span>{70 + Math.floor(Math.random() * 30)}%</span>
                                </div>
                                <Progress value={70 + Math.floor(Math.random() * 30)} className="h-1.5" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-purple-300">Composition</span>
                                  <span>{70 + Math.floor(Math.random() * 30)}%</span>
                                </div>
                                <Progress value={70 + Math.floor(Math.random() * 30)} className="h-1.5" />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Attributes Tab */}
                {activeComparisonTab === "attributes" && (
                  <div>
                    <div className="bg-purple-900/30 p-4 rounded-lg mb-6">
                      <h3 className="font-semibold mb-2">Attribute Vector Agreement</h3>
                      <p className="text-sm text-purple-300">
                        Our AI analyzes specific attributes like style, complexity, and colorfulness to ensure the
                        artist regularly works on designs similar to yours.
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-purple-500/30">
                            <th className="text-left p-2">Attribute</th>
                            {comparisonArtists.map((artist) => (
                              <th key={artist.id} className="p-2 text-center">
                                {artist.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            "Style Match",
                            "Complexity",
                            "Colorfulness",
                            "Detail Level",
                            "Placement Expertise",
                            "Size Range",
                            "Subject Matter",
                          ].map((attribute) => (
                            <tr key={attribute} className="border-b border-purple-500/10">
                              <td className="p-2 text-sm text-purple-300">{attribute}</td>
                              {comparisonArtists.map((artist) => {
                                const score = 70 + Math.floor(Math.random() * 30)
                                let textColor = "text-yellow-400"
                                if (score > 85) textColor = "text-green-400"
                                if (score < 75) textColor = "text-red-400"

                                return (
                                  <td key={artist.id} className="p-2 text-center">
                                    <span className={`font-medium ${textColor}`}>{score}%</span>
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      {comparisonArtists.map((artist) => {
                        const attributeScore = 70 + Math.floor(Math.random() * 30)
                        return (
                          <div key={artist.id} className="bg-purple-900/20 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold">{artist.name}</h3>
                              <div className="text-lg font-bold text-green-400">{attributeScore}%</div>
                            </div>

                            <div className="text-sm text-purple-300 mb-4">
                              {artist.name}'s portfolio shows strong alignment with your design preferences,
                              particularly in {["style match", "complexity", "detail level"][artist.id % 3]}.
                            </div>

                            <div className="text-sm">
                              <div className="font-medium mb-1">Key Strengths:</div>
                              <ul className="list-disc list-inside text-purple-300 space-y-1">
                                <li>{["Color theory", "Line precision", "Composition"][artist.id % 3]}</li>
                                <li>{["Shading technique", "Detail work", "Creative adaptation"][artist.id % 3]}</li>
                                <li>
                                  {
                                    ["Similar subject matter", "Placement expertise", "Size specialization"][
                                      artist.id % 3
                                    ]
                                  }
                                </li>
                              </ul>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Quality Score Tab */}
                {activeComparisonTab === "quality" && (
                  <div>
                    <div className="bg-purple-900/30 p-4 rounded-lg mb-6">
                      <h3 className="font-semibold mb-2">Skill & Quality Scoring Layer</h3>
                      <p className="text-sm text-purple-300">
                        Our AI assesses technical quality factors like line smoothness, color saturation, and healing
                        results to ensure you get the highest quality work.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {comparisonArtists.map((artist) => {
                        const qualityScore = 70 + Math.floor(Math.random() * 30)
                        return (
                          <div key={artist.id} className="bg-purple-900/20 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold">{artist.name}</h3>
                              <div className="text-lg font-bold text-green-400">{qualityScore}%</div>
                            </div>

                            <div className="mb-4">
                              <div className="text-sm text-purple-300 mb-1">Overall Quality Score</div>
                              <Progress value={qualityScore} className="h-2" />
                            </div>

                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-purple-300">Line Quality</span>
                                  <div className="flex">
                                    {Array.from({ length: Math.floor(4 + Math.random()) }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-purple-300">Color Saturation</span>
                                  <div className="flex">
                                    {Array.from({ length: Math.floor(4 + Math.random()) }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-purple-300">Healing Results</span>
                                  <div className="flex">
                                    {Array.from({ length: Math.floor(4 + Math.random()) }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-purple-300">Consistency</span>
                                  <div className="flex">
                                    {Array.from({ length: Math.floor(4 + Math.random()) }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 p-3 bg-purple-900/30 rounded-md text-sm">
                              <p className="text-purple-200">
                                Based on {Math.floor(Math.random() * 50) + 20} client reviews and AI analysis of
                                {Math.floor(Math.random() * 50) + 30} completed tattoos.
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-gray-900 p-4 border-t border-purple-500/30 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setComparisonArtists([])}
                  className="bg-purple-900/30 border-purple-500/30 hover:bg-purple-800/50"
                >
                  Clear All
                </Button>
                <Button onClick={() => setShowComparison(false)} className="bg-purple-700 hover:bg-purple-600">
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-gray-950/80 backdrop-blur-sm text-gray-400 flex justify-around py-2 border-t border-purple-500/20">
        <Link href="/" className="flex flex-col items-center">
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center">
          <Search className="w-6 h-6" />
          <span className="text-xs">Search</span>
        </Link>
        <Link href="/matches" className="flex flex-col items-center text-purple-400">
          <MapPin className="w-6 h-6" />
          <span className="text-xs">Matches</span>
        </Link>
        <Link href="/library" className="flex flex-col items-center">
          <Library className="w-6 h-6" />
          <span className="text-xs">Library</span>
        </Link>
      </nav>
    </div>
  )
}
