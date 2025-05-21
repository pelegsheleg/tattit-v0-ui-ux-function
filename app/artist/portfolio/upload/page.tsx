"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Upload, X, ImageIcon, Info, Check, Loader2, ImageIcon as ImageIcon2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for tattoo categories
const tattooCategories = [
  "Traditional",
  "Neo-Traditional",
  "Japanese",
  "Blackwork",
  "Realism",
  "Watercolor",
  "Geometric",
  "Tribal",
  "New School",
  "Minimalist",
  "Dotwork",
  "Biomechanical",
  "Portrait",
  "Script",
  "Illustrative",
  "Surrealism",
  "Abstract",
  "Cyberpunk",
]

// Mock data for tattoo styles
const tattooStyles = ["Color", "Black and Grey", "Linework", "Blackout", "Fine Line", "Bold", "Ornamental", "Sketch"]

// Mock data for body placements
const bodyPlacements = [
  "Arm",
  "Forearm",
  "Upper Arm",
  "Sleeve",
  "Chest",
  "Back",
  "Shoulder",
  "Leg",
  "Thigh",
  "Calf",
  "Ankle",
  "Foot",
  "Hand",
  "Neck",
  "Face",
  "Ribs",
  "Hip",
  "Stomach",
]

// Example tattoo images
const exampleImages = [
  {
    url: "/images/tattoo-mythological.png",
    name: "mythological-patchwork.jpg",
    size: 3.2 * 1024 * 1024,
  },
  {
    url: "/images/tattoo-illuminati-hand.png",
    name: "illuminati-hand.jpg",
    size: 2.8 * 1024 * 1024,
  },
]

export default function UploadWork() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [style, setStyle] = useState("")
  const [placement, setPlacement] = useState("")
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState("")
  const [images, setImages] = useState([])
  const [isPublic, setIsPublic] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showExamples, setShowExamples] = useState(true)

  // Load example images on component mount
  useEffect(() => {
    if (showExamples && images.length === 0) {
      setImages(exampleImages)
    }
  }, [showExamples])

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)

    // Check if files are selected
    if (selectedFiles.length === 0) return

    // Check file types and sizes
    const validFiles = selectedFiles.filter((file) => {
      const isImage = file.type.startsWith("image/")
      const isUnderLimit = file.size <= 5 * 1024 * 1024 // 5MB limit

      if (!isImage) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        })
      } else if (!isUnderLimit) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 5MB limit.`,
          variant: "destructive",
        })
      }

      return isImage && isUnderLimit
    })

    // Create preview URLs for valid files
    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }))

    // Clear examples if this is the first real upload
    if (showExamples && images.length > 0) {
      setImages(newImages)
      setShowExamples(false)
    } else {
      setImages((prev) => [...prev, ...newImages])
    }
  }

  // Handle removing an image
  const handleRemoveImage = (index) => {
    const newImages = [...images]
    if (newImages[index].preview && !showExamples) {
      URL.revokeObjectURL(newImages[index].preview)
    }
    newImages.splice(index, 1)
    setImages(newImages)
  }

  // Handle adding a tag
  const handleAddTag = () => {
    const trimmedTag = currentTag.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag])
      setCurrentTag("")
    }
  }

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your work.",
        variant: "destructive",
      })
      return
    }

    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image.",
        variant: "destructive",
      })
      return
    }

    // Simulate upload process
    setIsUploading(true)

    // Simulate progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)

        // Simulate server processing
        setTimeout(() => {
          setIsUploading(false)
          setUploadProgress(0)

          toast({
            title: "Upload successful",
            description: "Your work has been uploaded to your portfolio.",
          })

          // Redirect to portfolio
          router.push("/artist/portfolio")
        }, 1000)
      }
    }, 300)
  }

  // Handle example selection
  const handleUseExample = () => {
    setTitle("Mythological Patchwork")
    setDescription(
      "A collection of symbolic and mythological imagery in traditional blackwork style. This design tells a story through various interconnected symbols.",
    )
    setCategory("Blackwork")
    setStyle("Black and Grey")
    setPlacement("Chest")
    setTags(["mythological", "blackwork", "symbolic", "patchwork", "chest"])
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-950 to-purple-950 text-white">
      <header className="border-b border-purple-900 bg-black/50 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/artist/dashboard")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Upload Work</h1>
            <p className="text-sm text-purple-300">Add new designs to your portfolio</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="bg-black/40 border border-purple-500/30 p-1">
              <TabsTrigger value="upload" className="data-[state=active]:bg-purple-700">
                Upload Work
              </TabsTrigger>
              <TabsTrigger value="batch" className="data-[state=active]:bg-purple-700">
                Batch Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left column - Images */}
                  <div className="md:col-span-1 space-y-4">
                    <Card className="bg-black/40 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="text-center">
                            <h3 className="font-medium text-white">Upload Images</h3>
                            <p className="text-xs text-purple-300 mt-1">Upload up to 10 images (5MB max per image)</p>
                          </div>

                          {/* Image upload area */}
                          <div
                            className="border-2 border-dashed border-purple-500/30 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="image/*"
                              multiple
                              onChange={handleFileChange}
                            />
                            <Upload className="h-8 w-8 mx-auto text-purple-400" />
                            <p className="mt-2 text-sm text-purple-300">Click to upload or drag and drop</p>
                            <p className="text-xs text-purple-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                          </div>

                          {/* Preview images */}
                          {images.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <h4 className="text-sm font-medium text-white">Uploaded Images</h4>
                                {showExamples && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                                    onClick={handleUseExample}
                                  >
                                    <ImageIcon2 className="h-3 w-3 mr-1" />
                                    Use Example
                                  </Button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {images.map((image, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={image.url || image.preview || "/placeholder.svg"}
                                      alt={image.name}
                                      className="rounded-md object-cover aspect-square w-full"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="absolute top-1 right-1 bg-black/50 hover:bg-black/75 text-white"
                                      onClick={() => handleRemoveImage(index)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Title */}
                    <Card className="bg-black/40 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            type="text"
                            id="title"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Description */}
                    <Card className="bg-black/40 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Middle column - Categories, Styles, Placements */}
                  <div className="md:col-span-1 space-y-4">
                    <Card className="bg-black/40 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select onValueChange={setCategory} value={category}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {tattooCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/40 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <Label htmlFor="style">Style</Label>
                          <Select onValueChange={setStyle} value={style}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a style" />
                            </SelectTrigger>
                            <SelectContent>
                              {tattooStyles.map((sty) => (
                                <SelectItem key={sty} value={sty}>
                                  {sty}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/40 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <Label htmlFor="placement">Placement</Label>
                          <Select onValueChange={setPlacement} value={placement}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a placement" />
                            </SelectTrigger>
                            <SelectContent>
                              {bodyPlacements.map((place) => (
                                <SelectItem key={place} value={place}>
                                  {place}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right column - Tags, Visibility, Submit */}
                  <div className="md:col-span-1 space-y-4">
                    <Card className="bg-black/40 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <Label htmlFor="tags">Tags</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="text"
                              id="currentTag"
                              placeholder="Enter tag"
                              value={currentTag}
                              onChange={(e) => setCurrentTag(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  handleAddTag()
                                }
                              }}
                            />
                            <Button type="button" size="sm" onClick={handleAddTag}>
                              Add
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                {tag}
                                <X className="h-3 w-3 ml-1" />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/40 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="public">
                              <div className="flex items-center">
                                <Info className="h-4 w-4 mr-2" />
                                <span>Public</span>
                              </div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 ml-2 cursor-pointer" />
                                  </TooltipTrigger>
                                  <TooltipContent>Make this work visible to everyone.</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="featured">
                              <div className="flex items-center">
                                <ImageIcon className="h-4 w-4 mr-2" />
                                <span>Featured</span>
                              </div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 ml-2 cursor-pointer" />
                                  </TooltipTrigger>
                                  <TooltipContent>Highlight this work on your profile.</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button type="submit" className="w-full" disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading ({uploadProgress}%)
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Publish Work
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="batch" className="mt-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Batch Upload Coming Soon</h3>
                  <p className="text-purple-300 mb-4">
                    We're working on a feature to let you upload multiple designs at once with bulk tagging and
                    categorization.
                  </p>
                  <Button variant="outline" className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50">
                    Get Notified When Available
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
