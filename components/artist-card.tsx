import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ArtistCardProps {
  artist: any
}

export function ArtistCard({ artist }: ArtistCardProps) {
  // Handle the case where artist_profile might not exist
  const artistProfile = artist.artist_profile || {}

  // Get the first primary portfolio image or undefined
  const primaryImage = artist.portfolio_images?.find((img: any) => img.is_primary)?.image_url

  // Fallback values for missing data
  const hourlyRate = artistProfile.hourly_rate || 0
  const yearsExperience = artistProfile.years_experience || 0
  const location = artistProfile.location || "Location not specified"
  const styleTags = artistProfile.style_tags || []

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-gray-100">
        {primaryImage ? (
          <img
            src={primaryImage || "/placeholder.svg"}
            alt={`${artist.full_name}'s work`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">No portfolio image</p>
          </div>
        )}
      </div>

      <CardContent className="pt-6 pb-2">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={artist.profile_image_url || ""} alt={artist.full_name} />
            <AvatarFallback>{artist.full_name?.substring(0, 2).toUpperCase() || "TA"}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{artist.full_name}</h3>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-100 p-2 rounded">
            <p className="text-xs text-gray-500">Hourly Rate</p>
            <p className="font-medium">${hourlyRate}/hr</p>
          </div>
          <div className="bg-gray-100 p-2 rounded">
            <p className="text-xs text-gray-500">Experience</p>
            <p className="font-medium">{yearsExperience} years</p>
          </div>
        </div>

        {styleTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {styleTags.slice(0, 3).map((tag: string, index: number) => (
              <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {styleTags.length > 3 && (
              <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">+{styleTags.length - 3} more</span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/artists/${artist.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
