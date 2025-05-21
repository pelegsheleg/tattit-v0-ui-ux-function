"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { getArtistProfile } from "@/lib/services/artist"
import { updateArtistProfileAction } from "@/app/actions/artist-actions"

export default function ArtistPricingPage() {
  const { userId } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  // Form state
  const [formData, setFormData] = useState({
    hourlyRate: "",
    minimumPrice: "",
    depositPercentage: "25",
    cancellationHours: "48",
    pricingFAQ: "",
    priceRanges: [{ style: "", size: "small", priceMin: "", priceMax: "" }],
  })

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return

      try {
        const { data, error } = await getArtistProfile(userId)

        if (error) {
          throw new Error(error)
        }

        setProfile(data)

        // Populate form data
        if (data) {
          setFormData({
            hourlyRate: data.hourly_rate?.toString() || "",
            minimumPrice: data.minimum_price?.toString() || "",
            depositPercentage: data.deposit_percentage?.toString() || "25",
            cancellationHours: data.cancellation_hours?.toString() || "48",
            pricingFAQ: data.pricing_faq || "",
            priceRanges: data.price_ranges || [{ style: "", size: "small", priceMin: "", priceMax: "" }],
          })
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [userId, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePriceRangeChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newRanges = [...prev.priceRanges]
      newRanges[index] = { ...newRanges[index], [field]: value }
      return { ...prev, priceRanges: newRanges }
    })
  }

  const handleAddPriceRange = () => {
    setFormData((prev) => ({
      ...prev,
      priceRanges: [...prev.priceRanges, { style: "", size: "small", priceMin: "", priceMax: "" }],
    }))
  }

  const handleRemovePriceRange = (index: number) => {
    setFormData((prev) => {
      const newRanges = [...prev.priceRanges]
      newRanges.splice(index, 1)
      return {
        ...prev,
        priceRanges: newRanges.length ? newRanges : [{ style: "", size: "small", priceMin: "", priceMax: "" }],
      }
    })
  }

  const handleSave = async () => {
    if (!userId) return

    setSaving(true)

    try {
      const formDataObj = new FormData()

      // Add all form fields
      formDataObj.append("hourly_rate", formData.hourlyRate)
      formDataObj.append("minimum_price", formData.minimumPrice)
      formDataObj.append("deposit_percentage", formData.depositPercentage)
      formDataObj.append("cancellation_hours", formData.cancellationHours)
      formDataObj.append("pricing_faq", formData.pricingFAQ)
      formDataObj.append("price_ranges", JSON.stringify(formData.priceRanges))

      const result = await updateArtistProfileAction(formDataObj)

      if (result.success) {
        toast({
          title: "Success",
          description: "Your pricing information has been updated successfully",
        })

        // Refresh the profile data
        const { data } = await getArtistProfile(userId)
        setProfile(data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update pricing information",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving pricing information:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Pricing Hub</h1>
            <p className="text-gray-500">Manage your pricing structure and policies</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pricing Hub</h1>
          <p className="text-gray-500">Manage your pricing structure and policies</p>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Base Pricing</CardTitle>
            <CardDescription>Set your standard rates that apply to most tattoos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  min="0"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="e.g., 150"
                />
                <p className="text-sm text-gray-500">Your standard hourly rate for tattoo work</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumPrice">Minimum Price ($)</Label>
                <Input
                  id="minimumPrice"
                  name="minimumPrice"
                  type="number"
                  min="0"
                  value={formData.minimumPrice}
                  onChange={handleChange}
                  placeholder="e.g., 100"
                />
                <p className="text-sm text-gray-500">The minimum amount you charge for any tattoo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price Ranges by Style & Size</CardTitle>
            <CardDescription>Set specific price ranges for different styles and sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.priceRanges.map((range, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="space-y-2 md:col-span-2">
                  <Label>Style/Design Type</Label>
                  <Input
                    value={range.style}
                    onChange={(e) => handlePriceRangeChange(index, "style", e.target.value)}
                    placeholder="e.g., Traditional, Geometric"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Size</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={range.size}
                    onChange={(e) => handlePriceRangeChange(index, "size", e.target.value)}
                  >
                    <option value="small">Small (2-3")</option>
                    <option value="medium">Medium (4-6")</option>
                    <option value="large">Large (7-10")</option>
                    <option value="xlarge">X-Large (11"+)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <Input
                      type="number"
                      min="0"
                      value={range.priceMin}
                      onChange={(e) => handlePriceRangeChange(index, "priceMin", e.target.value)}
                      placeholder="Min"
                    />
                    <span className="text-gray-500">-</span>
                    <Input
                      type="number"
                      min="0"
                      value={range.priceMax}
                      onChange={(e) => handlePriceRangeChange(index, "priceMax", e.target.value)}
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePriceRange(index)}
                    disabled={formData.priceRanges.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={handleAddPriceRange} className="mt-2">
              <Plus className="mr-2 h-4 w-4" />
              Add Price Range
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Policies</CardTitle>
            <CardDescription>Set your deposit and cancellation policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="depositPercentage">Deposit Percentage (%)</Label>
                <Input
                  id="depositPercentage"
                  name="depositPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.depositPercentage}
                  onChange={handleChange}
                  placeholder="e.g., 25"
                />
                <p className="text-sm text-gray-500">Percentage of total price required as a non-refundable deposit</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellationHours">Cancellation Notice (hours)</Label>
                <Input
                  id="cancellationHours"
                  name="cancellationHours"
                  type="number"
                  min="0"
                  value={formData.cancellationHours}
                  onChange={handleChange}
                  placeholder="e.g., 48"
                />
                <p className="text-sm text-gray-500">How many hours notice required for cancellation without penalty</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing FAQ</CardTitle>
            <CardDescription>Answer common questions about your pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="pricingFAQ">Pricing FAQ</Label>
              <Textarea
                id="pricingFAQ"
                name="pricingFAQ"
                value={formData.pricingFAQ}
                onChange={handleChange}
                placeholder="Answer common pricing questions here. For example:
- How do you determine the price of a tattoo?
- Do you offer discounts for larger pieces?
- What forms of payment do you accept?
- When is the deposit due?"
                rows={8}
              />
              <p className="text-sm text-gray-500">
                Help clients understand your pricing structure and what affects cost
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
