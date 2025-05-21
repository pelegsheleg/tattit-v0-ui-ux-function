"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Home, Search, MapPin, Library, Wand2, Download, Rotate3D, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AIDesignerPage() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState(50)
  const [complexity, setComplexity] = useState(50)
  const [generatedDesign, setGeneratedDesign] = useState<string | null>(null)

  const handleGenerate = () => {
    // Simulating AI generation
    setTimeout(() => {
      setGeneratedDesign("/placeholder.svg?text=AI+Generated+Tattoo")
    }, 2000)
  }

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
              AI Tattoo Designer
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
          <h2 className="text-xl font-semibold">Describe Your Tattoo Idea</h2>
          <Textarea
            placeholder="E.g., A cyberpunk phoenix rising from digital ashes"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-purple-950/30 border-purple-500/30"
          />
          <div className="space-y-2">
            <label className="text-sm text-purple-300">Style: Realistic to Abstract</label>
            <Slider min={0} max={100} step={1} value={[style]} onValueChange={(value) => setStyle(value[0])} />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-purple-300">Complexity</label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[complexity]}
              onValueChange={(value) => setComplexity(value[0])}
            />
          </div>
          <Button onClick={handleGenerate} className="w-full bg-purple-700 hover:bg-purple-600">
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Design
          </Button>
        </motion.section>

        {generatedDesign && (
          <motion.section
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">Your AI-Generated Tattoo</h2>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-purple-900/20">
              <Image
                src={generatedDesign || "/placeholder.svg"}
                alt="AI-Generated Tattoo Design"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-purple-700 hover:bg-purple-600">
                <Download className="w-4 h-4 mr-2" />
                Save Design
              </Button>
              <Button className="flex-1 bg-purple-700 hover:bg-purple-600">
                <Rotate3D className="w-4 h-4 mr-2" />
                AR Preview
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
    </div>
  )
}
