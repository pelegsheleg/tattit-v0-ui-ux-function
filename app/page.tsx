"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  Heart,
  MessageCircle,
  Share2,
  Play,
  Camera,
  Home,
  MapPin,
  Library,
  Wand2,
  LogOut,
  Plus,
  Bookmark,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "./contexts/AuthContext"

interface FeedItem {
  id: string
  type: "image" | "video" | "artist"
  content: {
    title: string
    artist: string
    image: string
    likes: number
    comments: number
    description?: string
    location?: string
    timestamp?: string
  }
}

const generateFeedItems = (count: number): FeedItem[] => {
  const types = ["image", "video", "artist"]
  const descriptions = [
    "Cyberpunk meets traditional in this mind-bending design.",
    "AI-generated tattoo pushing the boundaries of art.",
    "Neon-infused biomechanical masterpiece.",
    "Glitch art meets skin - a true digital age tattoo.",
    "Futuristic tribal design with holographic elements.",
  ]
  const locations = ["Tokyo", "New York", "London", "Berlin", "Seoul"]
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${Date.now()}-${i}`,
    type: types[Math.floor(Math.random() * types.length)] as "image" | "video" | "artist",
    content: {
      title: `Cyber Ink ${i + 1}`,
      artist: `Neon Artist ${i + 1}`,
      image: [
        "/images/tattoo-mythological.png",
        "/images/tattoo-illuminati-hand.png",
        "/images/tattoo-symbolic-patchwork.png",
        "/images/tattoo-mandala-sleeves.png",
        "/images/tattoo-fineline-bird.jpeg",
        "/images/tattoo-graphic-style.jpeg",
        "/images/tattoo-cyberpunk.png",
        "/images/tattoo-japanese.png",
        "/images/tattoo-watercolor.png",
        "/images/tattoo-blackwork.png",
      ][i % 10],
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      timestamp: `${Math.floor(Math.random() * 23)}h ago`,
    },
  }))
}

const stories = [
  { id: 1, name: "Your Story", image: "/images/tattoo-fineline-bird.jpeg", isUser: true },
  { id: 2, name: "CyberInk", image: "/images/tattoo-cyberpunk.png" },
  { id: 3, name: "NeonSkin", image: "/images/tattoo-watercolor.png" },
  { id: 4, name: "QuantumTat", image: "/images/tattoo-mythological.png" },
  { id: 5, name: "GlitchArt", image: "/images/tattoo-graphic-style.jpeg" },
  { id: 6, name: "BioMech", image: "/images/tattoo-symbolic-patchwork.png" },
]

export default function HomePage() {
  const { logout } = useAuth()
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const loaderRef = useRef(null)

  const loadMoreItems = () => {
    setLoading(true)
    setTimeout(() => {
      setFeedItems((prevItems) => [...prevItems, ...generateFeedItems(5)])
      setLoading(false)
    }, 1500)
  }

  useEffect(() => {
    loadMoreItems()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreItems()
        }
      },
      { threshold: 1.0 },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [loading]) // Removed loadMoreItems from dependencies

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white pb-20">
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <motion.div className="relative w-8 h-8" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dog%20face%20image%20background-80tC7pNknHSwIU4KYQODUQRYlZl8t1.png"
                  alt="Tattit Logo"
                  fill
                  className="object-contain"
                />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                Tattit
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-purple-400">
                <Camera className="h-6 w-6" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback>TT</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" className="text-purple-400" onClick={logout}>
                <LogOut className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tattoos, artists, or styles"
              className="w-full pl-10 bg-gray-800/50 border-gray-700 focus:border-purple-500 text-white placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-8 max-w-4xl mx-auto">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4">
            {stories.map((story) => (
              <div key={story.id} className="flex flex-col items-center space-y-1">
                <div
                  className={`w-16 h-16 rounded-full ${story.isUser ? "bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-0.5" : ""}`}
                >
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={story.name}
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-purple-500"
                  />
                </div>
                <span className="text-xs">{story.name}</span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/ai-designer"
              className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30 flex flex-col items-center justify-center text-center"
            >
              <Wand2 className="w-8 h-8 mb-2 text-purple-400" />
              <h3 className="font-semibold">AI Tattoo Designer</h3>
              <p className="text-sm text-purple-300">Create unique designs</p>
            </Link>
            <Link
              href="/ar-preview"
              className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30 flex flex-col items-center justify-center text-center"
            >
              <Camera className="w-8 h-8 mb-2 text-purple-400" />
              <h3 className="font-semibold">AR Preview</h3>
              <p className="text-sm text-purple-300">See tattoos on your skin</p>
            </Link>
          </div>
        </motion.section>

        <AnimatePresence>
          {feedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-purple-900/20 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/20 border border-purple-500/30"
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-purple-500">
                    <AvatarImage src="/placeholder.svg" alt={item.content.artist} />
                    <AvatarFallback>{item.content.artist[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-purple-300">{item.content.artist}</h3>
                    <p className="text-xs text-gray-400">{item.content.location}</p>
                  </div>
                </div>
                {item.type === "artist" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="relative aspect-square">
                <Image
                  src={item.content.image || "/placeholder.svg"}
                  alt={item.content.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-300 hover:brightness-110"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white opacity-80" />
                  </div>
                )}
                {item.type === "image" && (
                  <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                    AI Enhanced
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1 text-pink-500 transition-colors duration-200 hover:text-pink-400">
                      <Heart className="w-6 h-6" />
                      <span>{item.content.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-purple-400 transition-colors duration-200 hover:text-purple-300">
                      <MessageCircle className="w-6 h-6" />
                      <span>{item.content.comments}</span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-gray-300 transition-colors duration-200">
                      <Share2 className="w-6 h-6" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-300 transition-colors duration-200">
                      <Bookmark className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-2">{item.content.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{item.content.timestamp}</span>
                  <button className="hover:text-gray-300">View all comments</button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={loaderRef} className="text-center py-4">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full bg-purple-900/20" />
              <Skeleton className="h-64 w-full bg-purple-900/20" />
              <Skeleton className="h-12 w-full bg-purple-900/20" />
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-20 right-4 z-20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-950/80 backdrop-blur-sm text-gray-400 flex justify-around py-2 border-t border-purple-500/20">
        <Link href="/" className="flex flex-col items-center text-purple-400">
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
        <Link href="/library" className="flex flex-col items-center">
          <Library className="w-6 h-6" />
          <span className="text-xs">Library</span>
        </Link>
      </nav>
    </div>
  )
}
