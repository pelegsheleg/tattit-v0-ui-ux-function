import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MatchesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white p-4">
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/search" className="inline-flex items-center text-blue-400 mb-6">
              <ArrowLeft className="mr-2" /> Back to Search
            </Link>
            <div className="h-8 w-8 rounded-full bg-purple-900/50 animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
              Find Your Artist
            </h1>
          </div>
          <div className="h-1 bg-purple-950 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-1/4 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Share Your Vision</h2>
            <p className="text-purple-300">Upload a reference image or take a photo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center transition-all hover:border-purple-500/50">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-900/50 mb-4 animate-pulse"></div>
                  <p className="text-sm text-purple-300">Drag and drop or click to upload</p>
                </div>
              </div>
              <Skeleton className="h-10 w-full bg-purple-950/30" />
            </div>

            <div className="aspect-square rounded-lg bg-purple-900/20 flex items-center justify-center animate-pulse">
              <p className="text-purple-300">Preview will appear here</p>
            </div>
          </div>

          <Skeleton className="h-12 w-full bg-purple-950/30" />
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-950/80 backdrop-blur-sm text-gray-400 flex justify-around py-2 border-t border-purple-500/20">
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-gray-800 animate-pulse"></div>
          <span className="text-xs mt-1">Home</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-gray-800 animate-pulse"></div>
          <span className="text-xs mt-1">Search</span>
        </div>
        <div className="flex flex-col items-center text-purple-400">
          <div className="w-6 h-6 rounded-full bg-purple-800 animate-pulse"></div>
          <span className="text-xs mt-1">Matches</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-gray-800 animate-pulse"></div>
          <span className="text-xs mt-1">Library</span>
        </div>
      </nav>
    </div>
  )
}
