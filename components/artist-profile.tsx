import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, DollarSign, Clock, Award, Home } from "lucide-react"

export function ArtistProfile({ artist }) {
  const profile = artist.artist_profiles?.[0]

  if (!profile) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Artist profile not found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <div className="relative h-64 w-64">
            <Image
              src={artist.profile_image_url || "/placeholder.svg?text=No+Image"}
              alt={artist.full_name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{artist.full_name}</h1>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-lg font-semibold">{profile.rating || "N/A"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {profile.style_tags?.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <span>{profile.location || "Location not specified"}</span>
            </div>

            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
              <span>${profile.hourly_rate || "?"}/hr</span>
            </div>

            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <span>{profile.years_experience} years experience</span>
            </div>

            <div className="flex items-center">
              <Home className="h-5 w-5 text-gray-500 mr-2" />
              <span>{profile.studio_name || "Independent Artist"}</span>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-gray-700">{profile.bio || "No bio available"}</p>
          </div>

          {profile.certifications && (
            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Certifications
              </h2>
              <p className="text-gray-700">{profile.certifications}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
