"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Camera,
  Search,
  MapPin,
  Home,
  Library,
  ChevronRight,
  ChevronLeft,
  Star,
  Minimize2,
  Droplet,
  Hexagon,
  Feather,
  Aperture,
  CameraIcon,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import ImmersiveStudioExplorer from "@/components/ImmersiveStudioExplorer"
import TattooGrid from "@/components/TattooGrid"

const categories = [
  { name: "Minimalist", icon: Minimize2, color: "from-gray-700 to-gray-900" },
  { name: "Watercolor", icon: Droplet, color: "from-blue-700 to-blue-900" },
  { name: "Geometric", icon: Hexagon, color: "from-indigo-700 to-indigo-900" },
  { name: "Traditional", icon: Feather, color: "from-red-700 to-red-900" },
  { name: "Blackwork", icon: Aperture, color: "from-gray-800 to-gray-950" },
  { name: "Realism", icon: CameraIcon, color: "from-green-700 to-green-900" },
]

const trendingSearches = [
  "Minimalist line art",
  "Watercolor flowers",
  "Geometric animals",
  "Traditional roses",
  "Blackwork mandala",
  "Realistic portraits",
]

const featuredArtists = [
  {
    name: "NeoInk",
    avatar: "/placeholder.svg?text=NI",
    specialty: "Cyberpunk",
    rating: 4.9,
    reviews: 127,
    distance: "2.5 miles",
    status: "Top Rated",
    nextAvailable: "Today",
    works: ["/placeholder.svg?text=NeoInk1", "/placeholder.svg?text=NeoInk2", "/placeholder.svg?text=NeoInk3"],
  },
  {
    name: "ColorSplash",
    avatar: "/placeholder.svg?text=CS",
    specialty: "Watercolor",
    rating: 4.7,
    reviews: 98,
    distance: "3.8 miles",
    status: "Rising Star",
    nextAvailable: "Tomorrow",
    works: [
      "/placeholder.svg?text=ColorSplash1",
      "/placeholder.svg?text=ColorSplash2",
      "/placeholder.svg?text=ColorSplash3",
    ],
  },
  {
    name: "GeomeTrix",
    avatar: "/placeholder.svg?text=GT",
    specialty: "Geometric",
    rating: 4.8,
    reviews: 156,
    distance: "1.2 miles",
    status: "Top Rated",
    nextAvailable: "In 2 days",
    works: ["/placeholder.svg?text=GeomeTrix1", "/placeholder.svg?text=GeomeTrix2", "/placeholder.svg?text=GeomeTrix3"],
  },
  {
    name: "InkMaster",
    avatar: "/placeholder.svg?text=IM",
    specialty: "Traditional",
    rating: 4.6,
    reviews: 203,
    distance: "4.5 miles",
    status: "Veteran",
    nextAvailable: "Next week",
    works: ["/placeholder.svg?text=InkMaster1", "/placeholder.svg?text=InkMaster2", "/placeholder.svg?text=InkMaster3"],
  },
]

/** KEEP THIS SINGLE `featuredStudios` ARRAY (remove the duplicate below) **/
const featuredStudios = [
  {
    name: "CyberInk Studios",
    description: "Futuristic designs meet traditional techniques",
    image: "/placeholder.svg?text=CyberInk",
    specialty: "Cyberpunk",
    artists: [
      {
        name: "Neon",
        avatar: "/placeholder.svg?text=Neon",
        style: "Cyberpunk portraits",
        preference: "Large scale pieces",
        works: [
          "/placeholder.svg?text=Neon1",
          "/placeholder.svg?text=Neon2",
          "/placeholder.svg?text=Neon3",
          "/placeholder.svg?text=Neon4",
        ],
        bio: "Neon specializes in creating vibrant, futuristic portraits that blend human features with cybernetic enhancements. Their work often incorporates neon colors and intricate circuitry patterns.",
      },
      {
        name: "Pixel",
        avatar: "/placeholder.svg?text=Pixel",
        style: "Digital glitch art",
        preference: "Small to medium tattoos",
        works: [
          "/placeholder.svg?text=Pixel1",
          "/placeholder.svg?text=Pixel2",
          "/placeholder.svg?text=Pixel3",
          "/placeholder.svg?text=Pixel4",
        ],
        bio: "Pixel pushes the boundaries of tattoo art by incorporating digital glitch aesthetics into their designs. They excel at creating tattoos that appear to 'glitch' on the skin, blurring the line between digital and physical art.",
      },
    ],
  },
  {
    name: "NeoTrad Tattoo",
    description: "Reimagining classic tattoo art for the modern era",
    image: "/placeholder.svg?text=NeoTrad",
    specialty: "Neo-Traditional",
    artists: [
      {
        name: "Inky",
        avatar: "/placeholder.svg?text=Inky",
        style: "Bold neo-traditional",
        preference: "Color-rich designs",
        works: [
          "/placeholder.svg?text=Inky1",
          "/placeholder.svg?text=Inky2",
          "/placeholder.svg?text=Inky3",
          "/placeholder.svg?text=Inky4",
        ],
        bio: "Inky brings classic tattoo motifs into the 21st century with bold lines and vibrant colors. Their work often features reimagined traditional symbols with a modern twist.",
      },
      {
        name: "Sketch",
        avatar: "/placeholder.svg?text=Sketch",
        style: "Illustrative neo-trad",
        preference: "Black and grey work",
        works: [
          "/placeholder.svg?text=Sketch1",
          "/placeholder.svg?text=Sketch2",
          "/placeholder.svg?text=Sketch3",
          "/placeholder.svg?text=Sketch4",
        ],
        bio: "Sketch specializes in creating neo-traditional designs with an illustrative flair. Their black and grey work often incorporates intricate shading and fine details to bring depth to classic tattoo imagery.",
      },
    ],
  },
  {
    name: "Watercolor Dreams",
    description: "Bringing vibrant, fluid art to life on skin",
    image: "/placeholder.svg?text=Watercolor",
    specialty: "Watercolor",
    artists: [
      {
        name: "Splash",
        style: "Abstract watercolor",
        preference: "Colorful, large pieces",
      },
      {
        name: "Pastel",
        style: "Soft watercolor portraits",
        preference: "Delicate, small tattoos",
      },
    ],
  },
  {
    name: "Geometric Precision",
    description: "Clean lines and perfect symmetry in every design",
    image: "/placeholder.svg?text=Geometric",
    specialty: "Geometric",
    artists: [
      {
        name: "Angle",
        style: "Sacred geometry",
        preference: "Full sleeves and back pieces",
      },
      {
        name: "Dot",
        style: "Dotwork geometric",
        preference: "Intricate, time-intensive work",
      },
    ],
  },
  {
    name: "Realism Masters",
    description: "Photorealistic tattoos that blur the line between art and reality",
    image: "/placeholder.svg?text=Realism",
    specialty: "Realism",
    artists: [
      { name: "Lens", style: "Hyperrealism", preference: "Portraits and nature scenes" },
      { name: "Shadow", style: "Black and grey realism", preference: "Dark and moody pieces" },
    ],
  },
]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentStudioIndex, setCurrentStudioIndex] = useState(0)
  const [selectedStudio, setSelectedStudio] = useState<(typeof featuredStudios)[0] | null>(null)

  const nextStudio = () => {
    setCurrentStudioIndex((prevIndex) => (prevIndex + 1) % featuredStudios.length)
  }

  const prevStudio = () => {
    setCurrentStudioIndex((prevIndex) => (prevIndex - 1 + featuredStudios.length) % featuredStudios.length)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950 to-gray-900 text-gray-200 pb-20">
      <header
        className={`sticky top-0 z-10 transition-all duration-300 ${
          isScrolled ? "bg-gray-900/90 backdrop-blur-md border-b border-purple-800/30" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
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
              <h1 className="text-2xl font-bold text-gray-100">Tattit</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-gray-400">
                <Camera className="h-6 w-6" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback>TT</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tattoos, artists, or styles"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 bg-gray-800/50 border-purple-700/50 focus:border-purple-500 text-gray-200 placeholder-gray-400"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 space-y-16">
        <section className="mt-12 relative overflow-hidden">
          <h2 className="text-3xl font-semibold mb-6 text-gray-100">Featured Studios</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center z-10">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-purple-900/50 text-white hover:bg-purple-800/70"
                onClick={prevStudio}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center z-10">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-purple-900/50 text-white hover:bg-purple-800/70"
                onClick={nextStudio}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            <ScrollArea className="w-full">
              <div className="flex space-x-6 pb-6">
                {featuredStudios.map((studio, index) => (
                  <Card
                    key={studio.name}
                    className={`flex-shrink-0 w-full sm:w-[400px] bg-gray-800/80 border-purple-700/30 transition-all duration-300 ${
                      index === currentStudioIndex ? "scale-100 opacity-100" : "scale-95 opacity-70"
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className="relative h-56 sm:h-72">
                        <Image
                          src={studio.image || "/placeholder.svg"}
                          alt={studio.name}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-t-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-2xl font-semibold text-white mb-2">{studio.name}</h3>
                          <p className="text-sm text-gray-300">{studio.description}</p>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-white mb-2">Featured Artists</h4>
                        {studio.artists.map((artist, artistIndex) => (
                          <div key={artist.name} className="mb-4 last:mb-0">
                            <h5 className="text-md font-medium text-purple-300">{artist.name}</h5>
                            <p className="text-sm text-gray-400">Style: {artist.style}</p>
                            <p className="text-sm text-gray-400">Preference: {artist.preference}</p>
                          </div>
                        ))}
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-purple-300 font-medium">{studio.specialty}</span>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-purple-700 hover:bg-purple-600 text-white"
                            onClick={() => setSelectedStudio(studio)}
                          >
                            Explore Studio
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-6 text-gray-100">Explore Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {categories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-xl aspect-square bg-gradient-to-br ${category.color} p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20`}
              >
                <category.icon className="w-12 h-12 text-purple-300" />
                <div>
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                  <Link
                    href={`/category/${category.name.toLowerCase()}`}
                    className="text-sm text-purple-300 hover:text-white transition-colors flex items-center mt-2"
                  >
                    Explore <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="relative">
          <h2 className="text-3xl font-semibold mb-6 text-gray-100">Trending Searches</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {trendingSearches.map((search, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-lg bg-gray-900 p-4 text-left transition-all hover:bg-gray-800"
                onClick={() => setSearchTerm(search)}
              >
                <span className="text-sm font-medium text-gray-300">{search}</span>
                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-700"></div>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="relative">
          <h2 className="text-3xl font-semibold mb-6 text-gray-100">Top Artists Near You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtists.map((artist, index) => (
              <motion.div
                key={artist.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0.5 bg-gradient-to-br from-purple-600 to-blue-700 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gray-900 rounded-lg p-6 flex flex-col items-center space-y-4 overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        artist.status === "Top Rated"
                          ? "bg-yellow-500 text-gray-900"
                          : artist.status === "Rising Star"
                            ? "bg-purple-500 text-white"
                            : "bg-blue-500 text-white"
                      }`}
                    >
                      {artist.status}
                    </span>
                  </div>
                  <Avatar className="h-24 w-24 ring-2 ring-purple-500">
                    <AvatarImage src={artist.avatar} alt={artist.name} />
                    <AvatarFallback>{artist.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg text-white">{artist.name}</h3>
                    <p className="text-sm text-purple-300">{artist.specialty}</p>
                    <div className="flex items-center justify-center mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.floor(artist.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-300">({artist.reviews})</span>
                    </div>
                  </div>
                  <div className="w-full">
                    <p className="text-sm text-center text-gray-400 mb-2">{artist.distance} away</p>
                    <p className="text-sm text-center text-green-400 mb-4">Next available: {artist.nextAvailable}</p>
                  </div>
                  <div className="flex justify-center space-x-2 mb-4">
                    {artist.works.map((work, i) => (
                      <div key={i} className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={work || "/placeholder.svg"}
                          alt={`${artist.name}'s work ${i + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                          className="transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300">
                    View Profile
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="relative">
          <h2 className="text-3xl font-semibold mb-6 text-gray-100">Discover Unique Designs</h2>
          <TattooGrid />
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md text-gray-400 flex justify-around py-3 border-t border-purple-800/30">
        <Link href="/" className="flex flex-col items-center">
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center text-purple-400">
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Search</span>
        </Link>
        <Link href="/matches" className="flex flex-col items-center">
          <MapPin className="w-6 h-6" />
          <span className="text-xs mt-1">Matches</span>
        </Link>
        <Link href="/library" className="flex flex-col items-center">
          <Library className="w-6 h-6" />
          <span className="text-xs mt-1">Library</span>
        </Link>
      </nav>

      {selectedStudio && <ImmersiveStudioExplorer studio={selectedStudio} onClose={() => setSelectedStudio(null)} />}
    </div>
  )
}
