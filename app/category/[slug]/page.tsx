"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import Masonry from "react-masonry-css"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, ArrowLeft, Heart, MessageCircle, Share2, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data - replace with real API call
const getCategoryImages = (category: string) => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `${category}-${i}`,
    url: `/placeholder.svg?text=${category}${i}`,
    title: `${category} Design ${i + 1}`,
    artist: {
      name: `Artist ${i + 1}`,
      avatar: `/placeholder.svg?text=A${i}`,
    },
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    // Add varying aspect ratios and sizes
    size: {
      // Randomly choose between different preset sizes
      type: ["tall", "wide", "large", "normal"][Math.floor(Math.random() * 4)],
      aspectRatio: ["3/4", "4/3", "1/1", "2/3", "3/2"][Math.floor(Math.random() * 5)],
    },
  }))
}

export default function CategoryPage() {
  const params = useParams()
  const category = typeof params.slug === "string" ? params.slug : ""
  const [images, setImages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setImages(getCategoryImages(category))
      setIsLoading(false)
    }, 1000)
  }, [category])

  const breakpointColumns = {
    default: 4,
    1536: 3,
    1280: 3,
    1024: 2,
    768: 2,
    640: 1,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white">
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/search" className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
              <ArrowLeft className="mr-2" />
              Back to Search
            </Link>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Profile" />
              <AvatarFallback>TT</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold capitalize">{category} Tattoos</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={`Search ${category} tattoos...`}
              className="w-full pl-10 bg-gray-800/50 border-purple-700/50 focus:border-purple-500 text-white placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-purple-900/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex w-auto -ml-6"
            columnClassName="pl-6 bg-clip-padding"
          >
            {images.map((image, index) => (
              <ImageCard key={image.id} image={image} index={index} />
            ))}
          </Masonry>
        )}
      </main>
    </div>
  )
}

const ImageCard = ({ image, index }: { image: any; index: number }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Define size classes based on the image size type
  const sizeClasses = {
    tall: "col-span-1 row-span-2",
    wide: "col-span-2 row-span-1",
    large: "col-span-2 row-span-2",
    normal: "col-span-1 row-span-1",
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`mb-6 ${image.size.type === "large" ? "break-inside-avoid" : ""}`}
    >
      <div className="group relative rounded-xl overflow-hidden bg-purple-900/20">
        <div
          className="relative"
          style={{
            aspectRatio: image.size.aspectRatio,
            width: "100%",
          }}
        >
          <Image
            src={image.url || "/placeholder.svg"}
            alt={image.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={image.artist.avatar} alt={image.artist.name} />
                <AvatarFallback>{image.artist.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{image.artist.name}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" className="hover:bg-white/20 text-white">
                  <Heart className="h-4 w-4 mr-1" />
                  {image.likes}
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-white/20 text-white">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {image.comments}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/20 text-white">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/20 text-white">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
