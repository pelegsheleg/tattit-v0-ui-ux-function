"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Search,
  Heart,
  Play,
  Clock,
  Zap,
  Home,
  MapPin,
  Library,
  Sparkles,
  Bitcoin,
  Rocket,
  Video,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface VideoType {
  id: string
  title: string
  artist: string
  thumbnail: string
  duration: string
  views: string
}

interface Design {
  id: string
  title: string
  artist: string
  image: string
}

interface Category {
  id: string
  title: string
  image: string
}

interface LiveSession {
  id: string
  title: string
  artist: string
  thumbnail: string
  viewers: number
  status: "live" | "upcoming"
  startTime?: string
}

interface TimeframeEra {
  year: string
  title: string
  description: string
  image: string
  details: {
    styles: string[]
    subjects?: string[]
    artists?: string[]
    features?: string[]
  }
}

const featuredVideos: VideoType[] = [
  {
    id: "1",
    title: "Cyberpunk Sleeve Process",
    artist: "NeoInk Studio",
    thumbnail: "/images/tattoo-cyberpunk.png",
    duration: "12:34",
    views: "1.2K",
  },
  {
    id: "2",
    title: "Geometric Back Piece",
    artist: "Digital Dermis",
    thumbnail: "/images/tattoo-geometric.png",
    duration: "8:45",
    views: "856",
  },
  {
    id: "3",
    title: "Bio-mechanical Design",
    artist: "Quantum Ink",
    thumbnail: "/images/tattoo-biomechanical.png",
    duration: "15:20",
    views: "2.1K",
  },
  {
    id: "4",
    title: "Neon Tribal Tattoo",
    artist: "SynthSkin",
    thumbnail: "/images/tattoo-tribal.png",
    duration: "10:15",
    views: "1.5K",
  },
  {
    id: "5",
    title: "AI-Generated Design Process",
    artist: "CyberSkin",
    thumbnail: "/images/tattoo-ai.png",
    duration: "18:30",
    views: "3.2K",
  },
]

const likedDesigns: Design[] = [
  { id: "1", title: "Mythological Patchwork", artist: "CyberSkin", image: "/images/tattoo-mythological.png" },
  { id: "2", title: "Digital Wave", artist: "Pixel Pulse", image: "/images/tattoo-watercolor.png" },
  { id: "3", title: "All-Seeing Eye", artist: "SynthSkin", image: "/images/tattoo-illuminati-hand.png" },
  { id: "4", title: "Mandala Sleeves", artist: "NeoInk Studio", image: "/images/tattoo-mandala-sleeves.png" },
  { id: "5", title: "Neon Samurai", artist: "Digital Dermis", image: "/images/tattoo-japanese.png" },
  { id: "6", title: "Symbolic Collection", artist: "Quantum Ink", image: "/images/tattoo-symbolic-patchwork.png" },
]

const categories: Category[] = [
  { id: "1", title: "Back Pieces", image: "/placeholder.svg?text=BP" },
  { id: "2", title: "Arm Sleeves", image: "/placeholder.svg?text=AS" },
  { id: "3", title: "Minimalist", image: "/placeholder.svg?text=MN" },
  { id: "4", title: "Watercolor", image: "/placeholder.svg?text=WC" },
  { id: "5", title: "Blackwork", image: "/placeholder.svg?text=BW" },
  { id: "6", title: "Sci-Fi Inspired", image: "/placeholder.svg?text=SF" },
]

const liveSessions: LiveSession[] = [
  {
    id: "1",
    title: "Cyberpunk Arm Sleeve",
    artist: "NeoInk",
    thumbnail: "/images/tattoo-mythological.png",
    viewers: 1200,
    status: "live",
  },
  {
    id: "2",
    title: "Watercolor Phoenix",
    artist: "AquaBrush",
    thumbnail: "/images/tattoo-watercolor.png",
    viewers: 850,
    status: "live",
  },
  {
    id: "3",
    title: "Geometric Wolf",
    artist: "AngledArt",
    thumbnail: "/images/tattoo-geometric.png",
    viewers: 620,
    status: "live",
  },
  {
    id: "4",
    title: "AI vs. Artist Battle",
    artist: "TechInk",
    thumbnail: "/images/tattoo-ai.png",
    viewers: 0,
    status: "upcoming",
    startTime: "2h 30m",
  },
  {
    id: "5",
    title: "Mystery Tattoo Reveal",
    artist: "EnigmaInk",
    thumbnail: "/images/tattoo-tribal.png",
    viewers: 0,
    status: "upcoming",
    startTime: "4h 15m",
  },
]

const timeframeEras: TimeframeEra[] = [
  {
    year: "1980s",
    title: "Classic Revival",
    description: "Heavy Traditional American & Japanese Irezumi",
    image: "/placeholder.svg?text=80s",
    details: {
      styles: ["Traditional American", "Japanese Irezumi"],
      subjects: ["Skulls", "Eagles", "Koi fish"],
      artists: ["Don Ed Hardy", "Sailor Jerry Legacy"],
    },
  },
  {
    year: "1990s",
    title: "Tribal Domination",
    description: "Bold blackwork tribal patterns",
    image: "/placeholder.svg?text=90s",
    details: {
      styles: ["Blackwork tribal patterns", "Armband tattoos", "Celtic designs"],
      features: ["Popularized by rock bands & extreme sports culture"],
    },
  },
  {
    year: "2000s",
    title: "Hyperrealism & Biomechanical",
    description: "3D tattoos & surrealistic body art",
    image: "/placeholder.svg?text=00s",
    details: {
      styles: ["3D tattoos", "Surrealistic body art", "Biomech designs"],
      features: ["Color portrait tattoos became mainstream"],
    },
  },
  {
    year: "2010s",
    title: "Watercolor & Minimalism",
    description: "Delicate, pastel ink & splatter effects",
    image: "/placeholder.svg?text=10s",
    details: {
      styles: ["Watercolor", "One-line tattoos", "Fine-line tattoos", "Micro tattoos"],
      features: ["Fusion of geometric & dotwork styles"],
    },
  },
  {
    year: "2020s",
    title: "AI & Digital Fusion",
    description: "AI-generated designs & blockchain verification",
    image: "/placeholder.svg?text=20s",
    details: {
      styles: ["AI-generated tattoo designs", "Glow-in-the-dark tattoos", "UV ink tattoos"],
      features: ["Crypto/NFT tattoos with scannable blockchain verification"],
    },
  },
]

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [showCryptoModal, setShowCryptoModal] = useState(false)
  const [currentEraIndex, setCurrentEraIndex] = useState(0)
  const [selectedEra, setSelectedEra] = useState<TimeframeEra | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const nextEra = () => {
    setCurrentEraIndex((prevIndex) => (prevIndex + 1) % timeframeEras.length)
  }

  const prevEra = () => {
    setCurrentEraIndex((prevIndex) => (prevIndex - 1 + timeframeEras.length) % timeframeEras.length)
  }

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTo({
        left: currentEraIndex * 200, // Adjust based on your item width
        behavior: "smooth",
      })
    }
  }, [currentEraIndex])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white pb-20">
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-6">
            <motion.div className="relative w-8 h-8" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dog%20face%20image%20background-80tC7pNknHSwIU4KYQODUQRYlZl8t1.png"
                alt="Tattit Logo"
                fill
                className="object-contain"
              />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
              Your Library
            </h1>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
              onClick={() => setShowCryptoModal(true)}
            >
              <Bitcoin className="w-4 h-4 mr-2" />
              TattCoin
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
              <TabsTrigger value="all" className="bg-purple-950/30 data-[state=active]:bg-purple-800 rounded-full">
                All
              </TabsTrigger>
              <TabsTrigger value="artists" className="bg-purple-950/30 data-[state=active]:bg-purple-800 rounded-full">
                Artists
              </TabsTrigger>
              <TabsTrigger value="styles" className="bg-purple-950/30 data-[state=active]:bg-purple-800 rounded-full">
                Styles
              </TabsTrigger>
              <TabsTrigger value="studios" className="bg-purple-950/30 data-[state=active]:bg-purple-800 rounded-full">
                Studios
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="p-4 space-y-8 max-w-4xl mx-auto">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Video className="w-6 h-6 mr-2 text-red-500" />
            Tattit Live Ink
          </h2>
          <div className="relative">
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex space-x-4">
                {liveSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    className="flex-shrink-0 w-72"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative rounded-lg overflow-hidden group">
                      <Image
                        src={session.thumbnail || "/placeholder.svg"}
                        alt={session.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                        <h3 className="font-semibold text-white text-lg">{session.title}</h3>
                        <p className="text-sm text-gray-300">{session.artist}</p>
                        {session.status === "live" ? (
                          <div className="flex items-center mt-2">
                            <Badge variant="destructive" className="mr-2 animate-pulse">
                              LIVE
                            </Badge>
                            <span className="text-sm text-gray-300">{session.viewers} viewers</span>
                          </div>
                        ) : (
                          <div className="flex items-center mt-2">
                            <Badge variant="secondary" className="mr-2">
                              Upcoming
                            </Badge>
                            <span className="text-sm text-gray-300">Starts in {session.startTime}</span>
                          </div>
                        )}
                      </div>
                      {session.status === "live" && (
                        <Button className="absolute top-2 right-2 bg-purple-600 hover:bg-purple-700">Watch Now</Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Heart className="w-6 h-6 mr-2 text-red-500" />
            Liked Designs
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {likedDesigns.map((design) => (
              <div key={design.id} className="space-y-2">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-purple-900/20 group">
                  <Image
                    src={design.image || "/placeholder.svg"}
                    alt={design.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-sm font-semibold text-white">{design.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-purple-400" />
            Want to Do Soon
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-purple-900/20 group">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                    <p className="text-sm font-semibold text-white">{category.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-400" />
            Featured Videos
          </h2>
          <ScrollArea className="w-full whitespace-nowrap rounded-lg">
            <div className="flex w-full gap-4 pb-4">
              {featuredVideos.map((video) => (
                <div key={video.id} className="relative group flex-none w-[300px]">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-semibold text-sm whitespace-normal">{video.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-purple-400">
                      <span>{video.artist}</span>
                      <span>•</span>
                      <span>{video.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-400" />
            Timeframe Tattoo Art Archive
          </h2>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
              onClick={prevEra}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
              onClick={nextEra}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            <ScrollArea className="w-full" ref={timelineRef}>
              <div className="flex space-x-4 p-4">
                {timeframeEras.map((era, index) => (
                  <motion.div
                    key={era.year}
                    className={`flex-shrink-0 w-64 ${index === currentEraIndex ? "scale-105" : "scale-100"}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <div
                          className="bg-purple-900/30 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                          onClick={() => setSelectedEra(era)}
                        >
                          <Image
                            src={era.image || "/placeholder.svg"}
                            alt={era.title}
                            width={256}
                            height={144}
                            className="w-full h-36 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="text-lg font-semibold">
                              {era.year} - {era.title}
                            </h3>
                            <p className="text-sm text-gray-300">{era.description}</p>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 text-white border border-purple-500 max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {era.year} - {era.title}
                          </DialogTitle>
                        </DialogHeader>
                        <Tabs defaultValue="overview" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 bg-purple-900/50">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="gallery">Gallery</TabsTrigger>
                            <TabsTrigger value="community">Community</TabsTrigger>
                          </TabsList>
                          <TabsContent value="overview" className="mt-4">
                            <div className="space-y-4">
                              <p className="text-lg">{era.description}</p>
                              <div>
                                <h4 className="font-semibold mb-2">Popular Styles:</h4>
                                <ul className="list-disc list-inside">
                                  {era.details.styles.map((style, index) => (
                                    <li key={index}>{style}</li>
                                  ))}
                                </ul>
                              </div>
                              {era.details.subjects && (
                                <div>
                                  <h4 className="font-semibold mb-2">Popular Subjects:</h4>
                                  <ul className="list-disc list-inside">
                                    {era.details.subjects.map((subject, index) => (
                                      <li key={index}>{subject}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {era.details.artists && (
                                <div>
                                  <h4 className="font-semibold mb-2">Famous Artists:</h4>
                                  <ul className="list-disc list-inside">
                                    {era.details.artists.map((artist, index) => (
                                      <li key={index}>{artist}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {era.details.features && (
                                <div>
                                  <h4 className="font-semibold mb-2">Key Features:</h4>
                                  <ul className="list-disc list-inside">
                                    {era.details.features.map((feature, index) => (
                                      <li key={index}>{feature}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                          <TabsContent value="gallery" className="mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                                  <Image
                                    src={`/placeholder-h0e5x.png?key=9yodb&text=${era.year}+Tattoo+${i}`}
                                    alt={`${era.year} Tattoo ${i}`}
                                    layout="fill"
                                    objectFit="cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="community" className="mt-4">
                            <div className="space-y-4">
                              <h4 className="font-semibold">Community Stories</h4>
                              <div className="bg-purple-900/30 p-4 rounded-lg">
                                <p className="text-sm italic">
                                  "My first tattoo from {era.year} was a {era.details.styles[0]} design. It was all the
                                  rage back then!"
                                </p>
                                <p className="text-xs text-gray-400 mt-2">- Anonymous User</p>
                              </div>
                              <Button className="w-full">Share Your Story</Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Rocket className="w-6 h-6 mr-2 text-blue-400" />
            Boost Your Tattit Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-xl font-semibold mb-2">Refer a Friend</h3>
              <p className="text-purple-300 mb-4">Get 100 TattCoins for each friend who joins!</p>
              <Button className="w-full bg-purple-700 hover:bg-purple-600">Share Referral Link</Button>
            </div>
            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-xl font-semibold mb-2">Daily Check-in</h3>
              <p className="text-purple-300 mb-4">Earn TattCoins every day you use the app!</p>
              <Button className="w-full bg-purple-700 hover:bg-purple-600">Check In Now</Button>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-950/80 backdrop-blur-sm text-gray-400 flex justify-around py-2 border-t border-purple-500/20">
        <Link href="/" className="flex flex-col items-center">
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center">
          <Search className="w-6 h-6" />
          <span className="text-xs">Search</span>
        </Link>
        <Link href="/matches" className="flex flex-col items-center">
          <MapPin className="w-6 h-6" />
          <span className="text-xs">Matches</span>
        </Link>
        <Link href="/library" className="flex flex-col items-center text-purple-400">
          <Library className="w-6 h-6" />
          <span className="text-xs">Library</span>
        </Link>
      </nav>

      {/* TattCoin Modal */}
      <Dialog open={showCryptoModal} onOpenChange={setShowCryptoModal}>
        <DialogContent className="bg-gray-950 text-white border border-purple-500">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">TattCoin Balance</h2>
              <Bitcoin className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-center">1,250 TTC</p>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Earn More TattCoins</h3>
              <ul className="list-disc list-inside text-purple-300">
                <li>Complete daily challenges</li>
                <li>Refer friends to Tattit</li>
                <li>Rate and review tattoo artists</li>
                <li>Share your tattoo designs</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Use Your TattCoins</h3>
              <ul className="list-disc list-inside text-purple-300">
                <li>Get exclusive discounts on tattoos</li>
                <li>Unlock premium AI-generated designs</li>
                <li>Book priority appointments with top artists</li>
                <li>Access limited edition digital tattoo collectibles</li>
              </ul>
            </div>
            <Button className="w-full bg-purple-700 hover:bg-purple-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Boost Your TattCoins
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
