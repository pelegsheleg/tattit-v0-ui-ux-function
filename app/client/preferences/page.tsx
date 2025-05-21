"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { getClientPreferences, updateClientPreferences } from "@/app/actions/client-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { MultiSelect } from "@/components/multi-select"
import { toast } from "@/components/ui/use-toast"

// Common tattoo styles
const TATTOO_STYLES = [
  "Traditional",
  "Neo-Traditional",
  "Realism",
  "Watercolor",
  "Tribal",
  "Japanese",
  "Blackwork",
  "Dotwork",
  "Geometric",
  "Minimalist",
  "Portrait",
  "New School",
  "Biomechanical",
  "Illustrative",
  "Abstract",
  "Lettering",
]

export default function ClientPreferencesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, setValue, watch } = useForm()

  const budgetRange = watch("budgetRange") || [0, 500]
  const searchRadius = watch("searchRadius") || 10

  useEffect(() => {
    async function loadPreferences() {
      // In a real app, you would get the client ID from auth context
      const clientId = "client1_id" // Placeholder
      const { preferences, error } = await getClientPreferences(clientId)

      if (error) {
        toast({
          title: "Error",
          description: `Failed to load preferences: ${error}`,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (preferences) {
        setValue("preferredStyles", preferences.preferred_styles || [])
        setValue("budgetRange", [preferences.budget_min || 0, preferences.budget_max || 500])
        setValue("location", preferences.location || "")
        setValue("searchRadius", preferences.search_radius || 10)
        setValue("preferredExperience", preferences.preferred_experience || "Any")
      }

      setLoading(false)
    }

    loadPreferences()
  }, [setValue])

  const onSubmit = async (data) => {
    setSaving(true)

    // In a real app, you would get the client ID from auth context
    const clientId = "client1_id" // Placeholder

    const preferencesData = {
      preferred_styles: data.preferredStyles,
      budget_min: data.budgetRange[0],
      budget_max: data.budgetRange[1],
      location: data.location,
      search_radius: data.searchRadius,
      preferred_experience: data.preferredExperience,
    }

    const { success, error } = await updateClientPreferences(clientId, preferencesData)

    setSaving(false)

    if (error) {
      toast({
        title: "Error",
        description: `Failed to save preferences: ${error}`,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "Your preferences have been saved",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Your Preferences</h1>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Your Preferences</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="preferredStyles">Preferred Tattoo Styles</Label>
          <MultiSelect
            options={TATTOO_STYLES.map((style) => ({ label: style, value: style }))}
            {...register("preferredStyles")}
            onChange={(values) => setValue("preferredStyles", values)}
            value={watch("preferredStyles") || []}
          />
          <p className="text-sm text-gray-500">Select the styles you're interested in</p>
        </div>

        <div className="space-y-2">
          <Label>Budget Range (per hour)</Label>
          <div className="pt-6 px-2">
            <Slider
              min={0}
              max={500}
              step={10}
              value={budgetRange}
              onValueChange={(value) => setValue("budgetRange", value)}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>${budgetRange[0]}</span>
            <span>${budgetRange[1]}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Your Location</Label>
          <Input id="location" placeholder="City, State" {...register("location")} />
        </div>

        <div className="space-y-2">
          <Label>Search Radius (miles)</Label>
          <div className="pt-6 px-2">
            <Slider
              min={1}
              max={100}
              step={1}
              value={[searchRadius]}
              onValueChange={(value) => setValue("searchRadius", value[0])}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>1 mile</span>
            <span>{searchRadius} miles</span>
            <span>100 miles</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredExperience">Preferred Artist Experience</Label>
          <select id="preferredExperience" className="w-full p-2 border rounded" {...register("preferredExperience")}>
            <option value="Any">Any Experience Level</option>
            <option value="Beginner">Beginner (0-2 years)</option>
            <option value="Intermediate">Intermediate (3-5 years)</option>
            <option value="Experienced">Experienced (6-10 years)</option>
            <option value="Expert">Expert (10+ years)</option>
          </select>
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </form>
    </div>
  )
}
