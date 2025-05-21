import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function StudiosPage() {
  const studios = [
    { name: "Neon Needle", description: "Specializing in vibrant, glowing designs" },
    { name: "Quantum Ink", description: "Cutting-edge techniques and styles" },
    { name: "Cyber Canvas", description: "Where technology meets skin art" },
    { name: "Digital Dermis", description: "Pushing the boundaries of tattoo artistry" },
    { name: "Pixel Pulse", description: "Retro-futuristic designs and old-school gaming inspired art" },
    { name: "Synth Skin", description: "Music-inspired tattoos with a futuristic twist" },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <Link href="/search" className="inline-flex items-center text-blue-400 mb-6">
        <ArrowLeft className="mr-2" /> Back to Search
      </Link>
      <h1 className="text-3xl font-bold mb-6">Featured Studios</h1>
      <div className="space-y-4">
        {studios.map((studio) => (
          <div
            key={studio.name}
            className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-blue-900 to-cyan-900 border border-blue-400/20"
          >
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={`/placeholder.svg?text=${studio.name[0]}${studio.name.split(" ")[1]?.[0] || ""}`}
                alt={studio.name}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold">{studio.name}</h3>
              <p className="text-sm text-blue-300">{studio.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
