import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function ArtistsPage() {
  const artists = ["NeoInk", "CyberSkin", "QuantumTat", "BioMech", "PixelPunk", "NeonNeedle", "SynthSkin", "GlitchArt"]

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <Link href="/search" className="inline-flex items-center text-blue-400 mb-6">
        <ArrowLeft className="mr-2" /> Back to Search
      </Link>
      <h1 className="text-3xl font-bold mb-6">Top Artists</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {artists.map((artist) => (
          <div key={artist} className="flex flex-col items-center space-y-2">
            <div className="relative w-full aspect-square rounded-full overflow-hidden border-2 border-blue-400/40">
              <Image
                src={`/images/tattoo-${artist.toLowerCase()}.png`}
                alt={artist}
                layout="fill"
                objectFit="cover"
                className="bg-gradient-to-br from-blue-900 to-cyan-900"
                onError={(e) => {
                  e.currentTarget.src = `/placeholder.svg?text=${artist[0]}`
                }}
              />
            </div>
            <span className="text-sm font-medium text-center">{artist}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
