"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Upload, X, ImageIcon, Tag, Edit, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import ImageCropper from "@/components/image-cropper"
import { useAuth } from "@/app/contexts/AuthContext"
import { uploadPortfolioImageAction, addStyleTagAction, deletePortfolioImageAction } from "@/app/actions/artist-actions"
import { getArtistPortfolio, getArtistStyleTags } from "@/lib/services/artist"

export default function PortfolioPage() {
  const { userId } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [portfolioImages, setPortfolioImages] = useState<any[]>([])
  const [styleTags, setStyleTags] = useState<any[]>([])
  const [newTag, setNewTag] = useState("")
  const [addingTag, setAddingTag] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [croppedImage, setCroppedImage] = useState<File | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [isPrimary, setIsPrimary] = useState(false)
  const [allowsReplication, setAllowsReplication] = useState(true)
  const [imageDescription, setImageDescription] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [completionPercentage, setCompletionPercentage] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      if (!userId) return

      try {
        // Load portfolio images
        const { data: images } = await getArtistPortfolio(userId)
        if (images) {
          setPortfolioImages(images)
        }

        // Load style tags
        const { data: tags } = await getArtistStyleTags(userId)
        if (tags) {
          setStyleTags(tags)
        }

        // Calculate profile completion
        calculateProfileCompletion(images || [], tags || [])
      } catch (error) {
        console.error("Error loading portfolio data:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load portfolio data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userId, toast])

  const calculateProfileCompletion = (images: any[], tags: any[]) => {
    let percentage = 0
    const totalItems = 5 // Basic profile + portfolio images + style tags + bio + contact info
    let completedItems = 0

    // Check if has profile image
    if (images.some((img) => img.is_primary)) completedItems++

    // Check if has portfolio images (at least 3)
    if (images.length >= 3) completedItems++

    // Check if has style tags (at least 3)
    if (tags.length >= 3) completedItems++

    // Check if has bio (we'll assume it's completed for now)
    completedItems++

    // Check if has contact info (we'll assume it's completed for now)
    completedItems++

    percentage = Math.round((completedItems / totalItems) * 100)
    setCompletionPercentage(percentage)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
      setShowCropper(true)
    }
  }

  const handleCropComplete = (croppedFile: File) => {
    setCroppedImage(croppedFile)
    setShowCropper(false)
  }

  const handleCropCancel = () => {
    setSelectedImage(null)
    setShowCropper(false)
  }

  const handleTagSelect = (tagName: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagName)) {
        return prev.filter((t) => t !== tagName)
      } else {
        return [...prev, tagName]
      }
    })
  }

  // Find the handleUpload function and update it to handle the response correctly
  const handleUpload = async () => {
    if (!croppedImage || !userId) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", croppedImage)
      formData.append("is_primary", isPrimary.toString())
      formData.append("allows_replication", allowsReplication.toString())
      formData.append("description", imageDescription)

      if (selectedTags.length > 0) {
        formData.append("style_tags", JSON.stringify(selectedTags))
      }

      const result = await uploadPortfolioImageAction(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })

        // Refresh the portfolio images
        const { data: images } = await getArtistPortfolio(userId)
        if (images) {
          setPortfolioImages(images)
          calculateProfileCompletion(images, styleTags)
        }

        // Reset the form
        setCroppedImage(null)
        setIsPrimary(false)
        setAllowsReplication(true)
        setImageDescription("")
        setSelectedTags([])
      } else {
        toast({
          title: "Error",
          description: result.error?.message || "Failed to upload image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleAddTag = async () => {
    if (!newTag.trim() || !userId) return

    setAddingTag(true)

    try {
      const formData = new FormData()
      formData.append("tag_name", newTag.trim())

      const result = await addStyleTagAction(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Style tag added successfully",
        })

        // Refresh the style tags
        const { data: tags } = await getArtistStyleTags(userId)
        if (tags) {
          setStyleTags(tags)
          calculateProfileCompletion(portfolioImages, tags)
        }

        // Reset the form
        setNewTag("")
      } else {
        toast({
          title: "Error",
          description: result.error?.message || "Failed to add style tag",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding style tag:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setAddingTag(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      const formData = new FormData()
      formData.append("image_id", imageId)

      const result = await deletePortfolioImageAction(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Image deleted successfully",
        })

        // Update the local state
        setPortfolioImages(portfolioImages.filter((img) => img.id !== imageId))
      } else {
        toast({
          title: "Error",
          description: result.error?.message || result.error || "Failed to delete image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTag = async (tagId: number) => {
    // This would be implemented with a server action to delete the tag
    toast({
      title: "Coming Soon",
      description: "Tag deletion will be implemented in a future update",
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <p className="text-gray-500">Showcase your work and style to potential clients</p>
        </div>

        <div className="w-full md:w-64">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <Tabs defaultValue="portfolio">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="portfolio">Portfolio Images</TabsTrigger>
            <TabsTrigger value="styles">Style Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="mt-6">
            {showCropper && selectedImage ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Crop Your Image</h2>
                <ImageCropper image={selectedImage} onCropComplete={handleCropComplete} onCancel={handleCropCancel} />
              </div>
            ) : croppedImage ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Upload Your Image</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={URL.createObjectURL(croppedImage) || "/placeholder.svg"}
                      alt="Cropped preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPrimary"
                        checked={isPrimary}
                        onChange={(e) => setIsPrimary(e.target.checked)}
                      />
                      <Label htmlFor="isPrimary">Set as primary profile image</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="allowsReplication"
                        checked={allowsReplication}
                        onCheckedChange={setAllowsReplication}
                      />
                      <Label htmlFor="allowsReplication">Allow design replication</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageDescription">Description</Label>
                      <Textarea
                        id="imageDescription"
                        value={imageDescription}
                        onChange={(e) => setImageDescription(e.target.value)}
                        placeholder="Describe this tattoo (style, size, time taken, etc.)"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Style Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {styleTags.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant={selectedTags.includes(tag.tag_name) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleTagSelect(tag.tag_name)}
                          >
                            {tag.tag_name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleUpload} disabled={uploading} className="w-full">
                      {uploading ? "Uploading..." : "Upload Image"}
                    </Button>

                    <Button variant="outline" onClick={() => setCroppedImage(null)} disabled={uploading}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Your Portfolio</h2>
                  <Button onClick={() => document.getElementById("upload-image")?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                  <Input
                    type="file"
                    id="upload-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                </div>

                {portfolioImages.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No images</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by uploading your first portfolio image.</p>
                    <div className="mt-6">
                      <Button onClick={() => document.getElementById("upload-image")?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Add Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {portfolioImages.map((image) => (
                      <Card key={image.id} className="overflow-hidden">
                        <div className="relative aspect-square">
                          <img
                            src={image.image_url || "/placeholder.svg"}
                            alt="Portfolio"
                            className="w-full h-full object-cover"
                          />
                          {image.is_primary && (
                            <div className="absolute top-2 right-2">
                              <Badge>Primary</Badge>
                            </div>
                          )}
                          <div className="absolute top-2 left-2 flex space-x-1">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
                              onClick={() => handleDeleteImage(image.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {image.style_tags?.map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                            {(!image.style_tags || image.style_tags.length === 0) && (
                              <span className="text-sm text-gray-500">No style tags</span>
                            )}
                          </div>

                          {/* We're removing the description and allows_design_replication display since they don't exist in the database */}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="styles" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Style Tags</h2>
              </div>

              <div className="flex items-end gap-2 mb-6">
                <div className="flex-grow">
                  <Label htmlFor="new-tag" className="mb-2 block">
                    Add New Style Tag
                  </Label>
                  <Input
                    id="new-tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="e.g., Traditional, Blackwork, Watercolor"
                  />
                </div>
                <Button onClick={handleAddTag} disabled={!newTag.trim() || addingTag}>
                  {addingTag ? "Adding..." : "Add Tag"}
                </Button>
              </div>

              {styleTags.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Tag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No style tags</h3>
                  <p className="mt-1 text-sm text-gray-500">Add style tags to help clients find your work.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {styleTags.map((tag) => (
                    <div key={tag.id} className="group relative">
                      <Badge className="px-3 py-1 text-base">
                        {tag.tag_name}
                        <button
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteTag(tag.id)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Style Tag Tips</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Add at least 5 style tags to improve your visibility</li>
                    <li>Be specific about your specialties (e.g., "Japanese" instead of just "Traditional")</li>
                    <li>Include both style and subject matter tags (e.g., "Blackwork", "Floral")</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
