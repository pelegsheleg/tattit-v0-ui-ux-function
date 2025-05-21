"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

interface ImageCropperProps {
  image: File
  aspectRatio?: number
  onCropComplete: (croppedFile: File) => void
  onCancel: () => void
}

export default function ImageCropper({ image, aspectRatio = 1, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop>()
  const imgRef = useRef<HTMLImageElement>(null)
  const [imgSrc, setImgSrc] = useState<string>("")

  // Load the image
  useState(() => {
    const reader = new FileReader()
    reader.addEventListener("load", () => {
      setImgSrc(reader.result?.toString() || "")
    })
    reader.readAsDataURL(image)
  })

  // Center and create initial crop with aspect ratio
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget
      const cropWidthInPercent = (400 / width) * 100

      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: cropWidthInPercent,
          },
          aspectRatio,
          width,
          height,
        ),
        width,
        height,
      )

      setCrop(crop)
    },
    [aspectRatio],
  )

  // Create a cropped image file
  const createCroppedImage = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height

    canvas.width = completedCrop.width
    canvas.height = completedCrop.height

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    )

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) return

      // Create a new file from the blob
      const croppedFile = new File([blob], image.name, {
        type: image.type,
        lastModified: Date.now(),
      })

      onCropComplete(croppedFile)
    }, image.type)
  }, [completedCrop, image, onCropComplete])

  return (
    <div className="space-y-4">
      {imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspectRatio}
          circularCrop={false}
        >
          <img
            ref={imgRef}
            src={imgSrc || "/placeholder.svg"}
            alt="Crop preview"
            onLoad={onImageLoad}
            className="max-h-[500px] w-auto mx-auto"
          />
        </ReactCrop>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={createCroppedImage} disabled={!completedCrop?.width || !completedCrop?.height}>
          Crop Image
        </Button>
      </div>
    </div>
  )
}
