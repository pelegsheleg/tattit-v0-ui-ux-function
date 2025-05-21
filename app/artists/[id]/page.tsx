import { getArtistDetails } from "@/app/actions/artist-actions"
import { ArtistProfile } from "@/components/artist-profile"
import { PortfolioGallery } from "@/components/portfolio-gallery"
import { StyleAnalysis } from "@/components/style-analysis"
import { BookingForm } from "@/components/booking-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Calendar } from "lucide-react"
import Link from "next/link"

export default async function ArtistDetailPage({ params }: { params: { id: string } }) {
  const { artist, error } = await getArtistDetails(params.id)

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Artist Details</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading artist: {error}</p>
        </div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Artist Details</h1>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Artist not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/artists">← Back to Artists</Link>
        </Button>
      </div>

      <ArtistProfile artist={artist} />

      <div className="mt-8">
        <Tabs defaultValue="portfolio">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="style">Style Analysis</TabsTrigger>
            <TabsTrigger value="booking">Book Consultation</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="mt-6">
            <PortfolioGallery images={artist.portfolio_images || []} />
          </TabsContent>

          <TabsContent value="style" className="mt-6">
            {artist.style_analysis && artist.style_analysis.length > 0 ? (
              <StyleAnalysis analysis={artist.style_analysis[0]} />
            ) : (
              <div className="text-center py-12 bg-gray-100 rounded-lg">
                <p className="text-gray-500">No style analysis available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="booking" className="mt-6">
            <BookingForm artistId={artist.id} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-8 flex gap-4">
        <Button asChild className="flex-1">
          <Link href={`/messages/${artist.id}`}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Message Artist
          </Link>
        </Button>

        <Button asChild variant="outline" className="flex-1">
          <Link href={`/artists/${artist.id}/bookings`}>
            <Calendar className="mr-2 h-4 w-4" />
            View Availability
          </Link>
        </Button>
      </div>
    </div>
  )
}
