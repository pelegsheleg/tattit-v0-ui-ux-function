import { getArtists } from "../actions/artist-actions"
import { ArtistCard } from "@/components/artist-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ArtistsPage() {
  const { artists, error } = await getArtists()

  console.log("Artists page received:", { artists, error })

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Artists</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading artists: {error}</p>
          <p className="mt-2">
            <Link href="/auth" className="text-blue-600 underline">
              Go to authentication page
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Discover Tattoo Artists</h1>

      {/* Debug info - remove in production */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="font-semibold mb-2">Debug Info:</h2>
        <p>Found {artists?.length || 0} artists</p>
        {artists && artists.length > 0 && (
          <details>
            <summary className="cursor-pointer text-blue-600">Show artist data</summary>
            <pre className="mt-2 p-2 bg-gray-200 rounded text-xs overflow-auto">{JSON.stringify(artists, null, 2)}</pre>
          </details>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists && artists.length > 0 ? (
          artists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">No artists found</p>
            <Button asChild>
              <Link href="/auth">Register as an Artist</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
