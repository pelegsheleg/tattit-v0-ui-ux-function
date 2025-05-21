"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ImagePlus, Plus, Star, Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface PortfolioSectionProps {
  onChange?: () => void
}

export function PortfolioSection({ onChange }: PortfolioSectionProps) {
  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: "1",
      title: "Cyberpunk Sleeve",
      description: "Full sleeve with neon circuit patterns and cybernetic elements",
      imageUrl: "/placeholder.svg?text=Cyberpunk+Sleeve",
      tags: ["Sleeve", "Cyberpunk", "Color"],
      featured: true,
    },
    {
      id: "2",
      title: "Geometric Wolf",
      description: "Geometric wolf design with sacred geometry elements",
      imageUrl: "/placeholder.svg?text=Geometric+Wolf",
      tags: ["Geometric", "Animal", "Blackwork"],
      featured: true,
    },
    {
      id: "3",
      title: "Neon Dragon",
      description: "Vibrant dragon design with neon color palette",
      imageUrl: "/placeholder.svg?text=Neon+Dragon",
      tags: ["Dragon", "Neon", "Color"],
      featured: false,
    },
    {
      id: "4",
      title: "Digital Wave",
      description: "Abstract wave pattern with digital glitch effects",
      imageUrl: "/placeholder.svg?text=Digital+Wave",
      tags: ["Abstract", "Glitch", "Minimalist"],
      featured: false,
    },
  ])

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    imageUrl: "/placeholder.svg?text=New+Image",
    tags: [] as string[],
    featured: false,
  })

  const [newTag, setNewTag] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    onChange?.()
  }, [portfolioItems, onChange])

  const handleAddItem = () => {
    if (newItem.title.trim() === "") return

    setPortfolioItems([
      ...portfolioItems,
      {
        id: Date.now().toString(),
        ...newItem,
      },
    ])

    setNewItem({
      title: "",
      description: "",
      imageUrl: "/placeholder.svg?text=New+Image",
      tags: [],
      featured: false,
    })

    onChange?.()
  }

  const handleDeleteItem = (id: string) => {
    setPortfolioItems(portfolioItems.filter((item) => item.id !== id))
    onChange?.()
  }

  const handleToggleFeatured = (id: string) => {
    setPortfolioItems(portfolioItems.map((item) => (item.id === id ? { ...item, featured: !item.featured } : item)))
    onChange?.()
  }

  const handleAddTag = () => {
    if (!newTag.trim() || newItem.tags.includes(newTag.trim())) return
    setNewItem({
      ...newItem,
      tags: [...newItem.tags, newTag.trim()],
    })
    setNewTag("")
  }

  const handleRemoveTag = (tag: string) => {
    setNewItem({
      ...newItem,
      tags: newItem.tags.filter((t) => t !== tag),
    })
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-purple-200">Portfolio Management</CardTitle>
          <CardDescription className="text-purple-400">Showcase your best work to attract clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-black/50 rounded-xl overflow-hidden border border-purple-500/20 transition-all duration-300 hover:border-purple-500/40 hover:shadow-xl"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {item.featured && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className="bg-purple-700 text-white border-none">Featured</Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                </div>
                <div className="relative p-4 z-10 -mt-20 bg-gradient-to-t from-black via-black/95 to-transparent">
                  <h3 className="font-medium text-xl text-white">{item.title}</h3>
                  <p className="text-sm text-purple-300 line-clamp-2 mt-2">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-purple-500/30 text-purple-300 bg-black/50"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFeatured(item.id)}
                      className={`${
                        item.featured
                          ? "text-yellow-400 hover:text-yellow-300"
                          : "text-purple-400 hover:text-purple-300"
                      }`}
                    >
                      <Star className={`h-4 w-4 mr-2 ${item.featured ? "fill-yellow-400" : ""}`} />
                      {item.featured ? "Featured" : "Mark as Featured"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="aspect-square flex items-center justify-center bg-black/30 rounded-xl border border-purple-500/20 border-dashed cursor-pointer hover:bg-purple-900/10 transition-all duration-300 hover:border-purple-500/40">
              <div className="flex flex-col items-center text-purple-400">
                <ImagePlus className="h-12 w-12 mb-3" />
                <span className="text-lg">Add New Work</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-lg border border-dashed border-purple-500/30 bg-black/20">
            <h3 className="text-xl font-medium text-white mb-6">Add New Portfolio Item</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-purple-300">Title</Label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="bg-black/40 border-purple-500/30 focus:border-purple-400 mt-1"
                  placeholder="e.g. Cyberpunk Sleeve"
                />
              </div>

              <div>
                <Label className="text-purple-300">Upload Image</Label>
                <div className="flex items-center mt-1">
                  <Button
                    variant="outline"
                    onClick={simulateUpload}
                    disabled={isUploading}
                    className="w-full bg-black/40 border-purple-500/30 hover:bg-purple-900/20"
                  >
                    {isUploading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Choose Image
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <Label className="text-purple-300">Description</Label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="bg-black/40 border-purple-500/30 focus:border-purple-400 mt-1"
                  rows={3}
                  placeholder="Describe your work, techniques used, and any interesting details"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-purple-300">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2 mt-1">
                  {newItem.tags.map((tag) => (
                    <Badge key={tag} className="bg-purple-800 pr-1 flex items-center">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:bg-purple-700 rounded-full p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="bg-black/40 border-purple-500/30 focus:border-purple-400"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={handleAddTag}
                    className="bg-purple-950/50 border-purple-500/30 hover:bg-purple-800/50"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center space-x-2">
                <Switch
                  checked={newItem.featured}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, featured: checked })}
                  className="data-[state=checked]:bg-purple-700"
                />
                <Label className="text-purple-300">Feature this work in your portfolio</Label>
              </div>
            </div>

            <Button
              onClick={handleAddItem}
              disabled={!newItem.title.trim()}
              className="w-full mt-6 bg-purple-700 hover:bg-purple-600 transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to Portfolio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
