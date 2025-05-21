import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function AIDesignPage() {
  const designs = [
    { name: "Cyber Doberman", description: "AI-generated cyberpunk dog tattoo" },
    { name: "Neon Samurai", description: "Futuristic warrior with glowing edges" },
    { name: "Digital Dreamcatcher", description: "Traditional symbol reimagined with circuitry" },
    { name: "Quantum Butterfly", description: "Insect with fractal wing patterns" },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <Link href="/search" className="inline-flex items-center text-blue-400 mb-6">
        <ArrowLeft className="mr-2" /> Back to Search
      </Link>
      <h1 className="text-3xl font-bold mb-6">AI-Generated Designs</h1>
      <div className="grid gap-6">
        {designs.map((design) => (
          <div
            key={design.name}
            className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-blue-900 to-cyan-900 border border-blue-400/20"
          >
            <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={`/placeholder.svg?text=${design.name[0]}${design.name.split(" ")[1]?.[0] || ""}`}
                alt={design.name}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{design.name}</h3>
              <p className="text-sm text-blue-300">{design.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
