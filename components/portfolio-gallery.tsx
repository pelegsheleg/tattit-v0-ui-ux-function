"use client"

import Image from "next/image"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function PortfolioGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null)

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No portfolio images available</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Portfolio</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Dialog key={image.id}>
            <DialogTrigger asChild>
              <div
                className="relative aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage(image)}
              >
                <Image src={image.image_url || "/placeholder.svg"} alt="Portfolio work" fill className="object-cover" />
                {image.is_primary && (
                  <div className="absolute top-2 right-2">
                    <Badge>Primary</Badge>
                  </div>
                )}
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <div className="relative aspect-square">
                <Image
                  src={image.image_url || "/placeholder.svg"}
                  alt="Portfolio work"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Style Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {image.style_tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}
