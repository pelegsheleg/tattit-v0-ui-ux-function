import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function PortfolioPreview({ images }) {
  // Take up to 5 images to display
  const displayImages = images?.slice(0, 5) || []

  return (
    <div>
      {displayImages.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No portfolio images yet</p>
          <Button asChild>
            <Link href="/artist/portfolio">
              <Plus className="mr-2 h-4 w-4" />
              Add Images
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {displayImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative rounded-md overflow-hidden ${index === 0 ? "col-span-2 row-span-2" : "col-span-1"}`}
            >
              <img
                src={image.image_url || "/placeholder.svg"}
                alt="Portfolio"
                className="w-full h-full object-cover aspect-square"
              />
            </div>
          ))}

          {displayImages.length < 5 && (
            <div className="flex items-center justify-center bg-gray-100 rounded-md aspect-square">
              <Button variant="ghost" asChild>
                <Link href="/artist/portfolio">
                  <Plus className="h-6 w-6" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
