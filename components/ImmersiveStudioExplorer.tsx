"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, Share2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import Masonry from "react-masonry-css"
import { useInView } from "react-intersection-observer"

interface Artwork {
  id: string
  image: string
  title: string
  description: string
  size: "small" | "medium" | "large"
  aspectRatio: "1:1" | "3:4" | "4:3" | "16:9"
}

interface Artist {
  name: string
  avatar: string
  style: string
  preference: string
  works: Artwork[]
  bio: string
}

interface Studio {
  name: string
  artists: Artist[]
}

const ImmersiveStudioExplorer: React.FC<{ studio: Studio; onClose: () => void }> = ({ studio, onClose }) => {
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  const currentArtist = studio.artists[currentArtistIndex]

  const nextArtist = () => {
    setCurrentArtistIndex((prevIndex) => (prevIndex + 1) % studio.artists.length)
  }

  const prevArtist = () => {
    setCurrentArtistIndex((prevIndex) => (prevIndex - 1 + studio.artists.length) % studio.artists.length)
  }

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 500) // Match this with the exit animation duration
  }

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="relative w-full h-full bg-gradient-to-br from-gray-900 to-purple-900 overflow-hidden"
        >
          {/* Neon accents */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-transparent" />
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-blue-500 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-transparent" />
          </div>

          {/* Navigation and close button */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <Button variant="ghost" size="icon" onClick={prevArtist} className="text-white hover:bg-white/10">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h2 className="text-2xl font-bold text-white">{studio.name}</h2>
            <Button variant="ghost" size="icon" onClick={handleClose} className="text-white hover:bg-white/10">
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Artist content */}
          <ScrollArea className="h-full pt-20 pb-16">
            <div className="max-w-6xl mx-auto px-4">
              <motion.div
                key={currentArtist.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                {/* Artist info */}
                <div className="flex items-center space-x-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <Avatar className="h-32 w-32 ring-4 ring-purple-500">
                      <AvatarImage src={currentArtist.avatar} alt={currentArtist.name} />
                      <AvatarFallback>{currentArtist.name[0]}</AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div>
                    <motion.h3
                      className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {currentArtist.name}
                    </motion.h3>
                    <motion.p
                      className="text-2xl text-purple-300 font-light"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {currentArtist.style}
                    </motion.p>
                    <motion.p
                      className="text-lg text-gray-400 mt-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Preference: {currentArtist.preference}
                    </motion.p>
                  </div>
                </div>

                {/* Artist bio */}
                <motion.p
                  className="text-xl text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {currentArtist.bio}
                </motion.p>

                {/* Artist works */}
                <div>
                  <motion.h4
                    className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Featured Works
                  </motion.h4>
                  <Masonry
                    breakpointCols={{
                      default: 3,
                      1100: 2,
                      700: 1,
                    }}
                    className="flex w-auto -ml-4"
                    columnClassName="pl-4 bg-clip-padding"
                  >
                    {currentArtist.works.map((work, index) => (
                      <ArtworkCard key={work.id} work={work} index={index} artistName={currentArtist.name} />
                    ))}
                  </Masonry>
                </div>
              </motion.div>
            </div>
          </ScrollArea>

          {/* Artist navigation */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <Button variant="ghost" onClick={prevArtist} className="text-white hover:bg-white/10">
              <ChevronLeft className="h-6 w-6 mr-2" />
              Previous Artist
            </Button>
            <Button variant="ghost" onClick={nextArtist} className="text-white hover:bg-white/10">
              Next Artist
              <ChevronRight className="h-6 w-6 ml-2" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const ArtworkCard = ({ work, index, artistName }: { work: Artwork; index: number; artistName: string }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const sizeClasses = {
    small: "w-full sm:w-1/2 md:w-1/3",
    medium: "w-full sm:w-2/3 md:w-1/2",
    large: "w-full",
  }

  const aspectRatioClasses = {
    "1:1": "aspect-square",
    "3:4": "aspect-[3/4]",
    "4:3": "aspect-[4/3]",
    "16:9": "aspect-video",
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`mb-4 ${sizeClasses[work.size]}`}
    >
      <div className={`relative rounded-lg overflow-hidden group ${aspectRatioClasses[work.aspectRatio]}`}>
        <img
          src={work.image || "/placeholder.svg"}
          alt={`${work.title} by ${artistName}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="w-full">
            <h5 className="text-white text-lg font-bold mb-2">{work.title}</h5>
            <p className="text-gray-300 text-sm">{work.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Inquire
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ImmersiveStudioExplorer

const studio: Studio = {
  name: "CyberInk Studios",
  artists: [
    {
      name: "Neon",
      avatar: "/placeholder.svg?text=Neon",
      style: "Cyberpunk portraits",
      preference: "Large scale pieces",
      works: [
        {
          id: "neon1",
          image: "/placeholder.svg?text=Neon1",
          title: "Neon Dreamer",
          description: "A vibrant cyberpunk portrait with neon accents",
          size: "large",
          aspectRatio: "3:4",
        },
        {
          id: "neon2",
          image: "/placeholder.svg?text=Neon2",
          title: "Digital Horizon",
          description: "A panoramic cityscape with futuristic elements",
          size: "large",
          aspectRatio: "16:9",
        },
        {
          id: "neon3",
          image: "/placeholder.svg?text=Neon3",
          title: "Cyber Geisha",
          description: "A traditional geisha reimagined with cybernetic enhancements",
          size: "medium",
          aspectRatio: "1:1",
        },
        {
          id: "neon4",
          image: "/placeholder.svg?text=Neon4",
          title: "Neon Samurai",
          description: "A futuristic samurai warrior with glowing neon armor",
          size: "medium",
          aspectRatio: "4:3",
        },
      ],
      bio: "Neon specializes in creating vibrant, futuristic portraits that blend human features with cybernetic enhancements. Their work often incorporates neon colors and intricate circuitry patterns.",
    },
    // Add more artists with similar work structures
  ],
}
