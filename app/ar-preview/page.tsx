"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, Search, MapPin, Library, Camera, RotateCcw, Download, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ARPreviewPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedTattoo, setSelectedTattoo] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const tattoos = [
    "/placeholder.svg?text=Tattoo1",
    "/placeholder.svg?text=Tattoo2",
    "/placeholder.svg?text=Tattoo3",
    "/placeholder.svg?text=Tattoo4",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white pb-20">
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Profile" />
              <AvatarFallback>TT</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
              AR Tattoo Preview
            </h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-8 max-w-4xl mx-auto">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Upload Your Photo</h2>
          <div
            className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedImage ? (
              <div className="relative aspect-video">
                <Image src={selectedImage} alt="Uploaded image" layout="fill" objectFit="contain" />
              </div>
            ) : (
              <>
                <Camera className="w-12 h-12 mx-auto text-purple-400 mb-4" />
                <p className="text-purple-300">Click to upload or take a photo</p>
              </>
            )}
            <Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          </div>
        </motion.section>

        {selectedImage && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">Choose a Tattoo</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {tattoos.map((tattoo, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                    selectedTattoo === tattoo ? "ring-2 ring-purple-500" : ""
                  }`}
                  onClick={() => setSelectedTattoo(tattoo)}
                >
                  <Image src={tattoo} alt={`Tattoo ${index + 1}`} layout="fill" objectFit="cover" />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {selectedImage && selectedTattoo && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">AR Preview</h2>
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image src={selectedImage} alt="AR Preview" layout="fill" objectFit="contain" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image src={selectedTattoo} alt="Selected Tattoo" width={200} height={200} className="opacity-80" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-purple-700 hover:bg-purple-600">
                <RotateCcw className="w-4 h-4 mr-2" />
                Adjust
              </Button>
              <Button className="flex-1 bg-purple-700 hover:bg-purple-600">
                <Download className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button className="flex-1 bg-purple-700 hover:bg-purple-600">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.section>
        )}
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
        <Link href="/library" className="flex flex-col items-center">
          <Library className="w-6 h-6" />
          <span className="text-xs">Library</span>
        </Link>
      </nav>

      {/* Circuit Board Pattern Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM37.656 0l8.485 8.485-1.414 1.414L36.242 0h1.414zM22.344 0L13.858 8.485 15.272 9.9l8.485-8.485H22.344zM32.4 0l10.142 10.142-1.414 1.414L30.986 0H32.4zm-4.8 0L17.457 10.142l1.415 1.414L29.014 0H27.6zM35.785 0l11.314 11.314-1.414 1.414L33.37 0h2.415zm-11.57 0L12.9 11.314l1.414 1.414L26.63 0H24.215zM39.17 0L51.8 12.627l-1.414 1.414L36.755 0h2.414zm-18.34 0L8.2 12.627l1.415 1.414L23.245 0h-2.414zM42.557 0L51.8 9.243l-1.415 1.414L39.14 0h3.417zm-25.114 0L8.2 9.243l1.414 1.414L20.86 0h-3.415zm20.915 0l8.485 8.485-1.414 1.414L38.644 0h-0.285zM20.283 0L11.8 8.485l1.414 1.414L19.9 0h0.383zM35.785 0L48.4 12.627l-1.414 1.414L33.37 0h2.415zm-11.57 0L11.8 12.627l1.414 1.414L26.63 0h-2.415z' fill='%239C6EF1' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
