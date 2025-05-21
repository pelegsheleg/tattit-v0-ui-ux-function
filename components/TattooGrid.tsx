"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import type React from "react" // Added import for React

interface TattooPost {
  id: string
  imageUrl: string
  title: string
  artist: {
    name: string
    avatar: string
  }
  likes: number
  comments: number
  description: string
}

const mockTattoos: TattooPost[] = [
  {
    id: "1",
    imageUrl: "/images/tattoo-mythological.png",
    title: "Mythological Patchwork",
    artist: { name: "NeoInk", avatar: "/images/tattoo-cyberpunk.png" },
    likes: 256,
    comments: 42,
    description:
      "A stunning collection of mythological symbols and figures, creating a narrative across the chest and arms.",
  },
  {
    id: "2",
    imageUrl: "/images/tattoo-illuminati-hand.png",
    title: "All-Seeing Eye",
    artist: { name: "ColorSplash", avatar: "/images/tattoo-watercolor.png" },
    likes: 189,
    comments: 31,
    description: "Powerful illuminati symbolism with ancient runes, perfectly placed on the hand for maximum impact.",
  },
  {
    id: "3",
    imageUrl: "/images/tattoo-symbolic-patchwork.png",
    title: "Symbolic Collection",
    artist: { name: "FuturInk", avatar: "/images/tattoo-japanese.png" },
    likes: 312,
    comments: 57,
    description:
      "A curated collection of symbolic imagery including snakes, celestial bodies, and anthropomorphic figures.",
  },
  {
    id: "4",
    imageUrl: "/images/tattoo-mandala-sleeves.png",
    title: "Mandala Sleeves",
    artist: { name: "SimpleLines", avatar: "/images/tattoo-fineline.png" },
    likes: 145,
    comments: 23,
    description: "Intricate mandala patterns flowing down both arms with contrasting hand symbols for balance.",
  },
  {
    id: "5",
    imageUrl: "/images/tattoo-fineline-bird.jpeg",
    title: "Delicate Bird",
    artist: { name: "ZenInk", avatar: "/images/tattoo-blackwork.png" },
    likes: 278,
    comments: 46,
    description: "Exquisitely detailed fine line work depicting a bird among delicate foliage.",
  },
  {
    id: "6",
    imageUrl: "/images/tattoo-graphic-style.jpeg",
    title: "Urban Graphic",
    artist: { name: "StarGazer", avatar: "/images/tattoo-geometric.png" },
    likes: 203,
    comments: 38,
    description:
      "Bold graphic style with street art influences, pushing the boundaries of traditional tattoo aesthetics.",
  },
  {
    id: "7",
    imageUrl: "/images/tattoo-blackwork.png",
    title: "Blackwork Masterpiece",
    artist: { name: "MechArt", avatar: "/images/tattoo-neotraditional.png" },
    likes: 167,
    comments: 29,
    description: "Solid blackwork with precise linework creating depth and dimension through negative space.",
  },
  {
    id: "8",
    imageUrl: "/images/tattoo-japanese.png",
    title: "Neo-Japanese",
    artist: { name: "EasternWaves", avatar: "/images/tattoo-portrait.png" },
    likes: 231,
    comments: 41,
    description: "Modern interpretation of traditional Japanese tattoo art with a cyberpunk twist.",
  },
]

const TattooGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {mockTattoos.map((tattoo) => (
        <TattooCard key={tattoo.id} tattoo={tattoo} />
      ))}
    </div>
  )
}

const TattooCard: React.FC<{ tattoo: TattooPost }> = ({ tattoo }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(tattoo.likes)
  const [comment, setComment] = useState("")

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1)
    } else {
      setLikes(likes - 1)
    }
    setLiked(!liked)
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the comment to your backend
    console.log("New comment:", comment)
    setComment("")
  }

  return (
    <motion.div
      className="relative w-full aspect-square rounded-lg overflow-hidden cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
        style={{ backfaceVisibility: "hidden" }}
      >
        {/* Front of the card */}
        <div className="absolute inset-0">
          <Image
            src={tattoo.imageUrl || "/placeholder.svg"}
            alt={tattoo.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-lg font-semibold text-white mb-1">{tattoo.title}</h3>
            <p className="text-sm text-gray-300">By {tattoo.artist.name}</p>
          </div>
          <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            AI Enhanced
          </div>
        </div>
      </motion.div>

      {/* Back of the card */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-gray-900 p-4 flex flex-col"
        initial={false}
        animate={{ rotateY: isFlipped ? 0 : -180 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={tattoo.artist.avatar || "/placeholder.svg"} alt={tattoo.artist.name} />
            <AvatarFallback>{tattoo.artist.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white">{tattoo.artist.name}</h3>
            <p className="text-sm text-gray-400">Artist</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-4 flex-grow">{tattoo.description}</p>
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center ${liked ? "text-red-500" : "text-gray-400"}`}
            onClick={(e) => {
              e.stopPropagation()
              handleLike()
            }}
          >
            <Heart className={`h-5 w-5 mr-1 ${liked ? "fill-current" : ""}`} />
            {likes}
          </Button>
          <div className="flex items-center text-gray-400">
            <MessageCircle className="h-5 w-5 mr-1" />
            <span>{tattoo.comments}</span>
          </div>
        </div>
        <form onSubmit={handleComment} className="flex items-center">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-grow mr-2 bg-gray-800 border-gray-700 text-white"
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            type="submit"
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default TattooGrid
