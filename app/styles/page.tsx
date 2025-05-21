import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function StylesPage() {
  const styles = [
    "Cyberpunk",
    "Biomechanical",
    "Neon Tribal",
    "Glitch Art",
    "Synthwave",
    "Vaporwave",
    "Retrowave",
    "Futurism",
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <Link href="/search" className="inline-flex items-center text-blue-400 mb-6">
        <ArrowLeft className="mr-2" /> Back to Search
      </Link>
      <h1 className="text-3xl font-bold mb-6">Popular Styles</h1>
      <div className="grid grid-cols-2 gap-4">
        {styles.map((style) => (
          <div
            key={style}
            className="relative overflow-hidden rounded-lg aspect-[2/1] bg-gradient-to-br from-blue-900 to-cyan-900 border border-blue-400/20"
          >
            <div className="p-4">
              <span className="text-xl font-bold">{style}</span>
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16 opacity-20 bg-circuit-pattern" />
          </div>
        ))}
      </div>
    </div>
  )
}
