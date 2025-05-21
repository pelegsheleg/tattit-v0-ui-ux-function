"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Save } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { getArtistProfile } from "@/lib/services/artist"
import { updateArtistProfileAction } from "@/app/actions/artist-actions"

declare global {
  interface Window {
    google: any
  }
}

export default function ArtistLocationPage() {
  const { userId } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [apiKey, setApiKey] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    studioName: "",
    location: "",
    locationDescription: "",
    isMobileArtist: false,
    latitude: 0,
    longitude: 0,
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
            studioName: data.studio_name || "",
            location: data.location || "",
            locationDescription: data.location_preferences || "",
            isMobileArtist: data.is_mobile_artist || false,
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
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

    // Fetch the API key
    const fetchApiKey = async () => {
      try {
        const response = await fetch("/api/maps/key")
        if (!response.ok) {
          throw new Error("Failed to fetch API key")
        }
        const data = await response.json()
        setApiKey(data.apiKey)
      } catch (error) {
        console.error("Error fetching Google Maps API key:", error)
        toast({
          title: "Error",
          description: "Failed to load map services",
          variant: "destructive",
        })
      }
    }

    fetchApiKey()
  }, [userId, toast])

  useEffect(() => {
    // Only load Google Maps script if we have the API key
    if (!apiKey) return

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setMapLoaded(true)
      return
    }

    // Load Google Maps
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => {
      setMapLoaded(true)
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [apiKey])

  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      initializeMap()
    }
  }, [mapLoaded, formData.latitude, formData.longitude])

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return

    const { latitude, longitude } = formData
    const center = { lat: latitude || 40.7128, lng: longitude || -74.006 }

    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 13,
      mapTypeControl: false,
    })

    markerRef.current = new window.google.maps.Marker({
      position: center,
      map: googleMapRef.current,
      draggable: true,
    })

    // Add click event to map
    googleMapRef.current.addListener("click", (e: any) => {
      const latLng = e.latLng
      markerRef.current.setPosition(latLng)
      setFormData((prev) => ({
        ...prev,
        latitude: latLng.lat(),
        longitude: latLng.lng(),
      }))
    })

    // Add dragend event to marker
    markerRef.current.addListener("dragend", () => {
      const position = markerRef.current.getPosition()
      setFormData((prev) => ({
        ...prev,
        latitude: position.lat(),
        longitude: position.lng(),
      }))
    })

    // Initialize search box
    const input = document.getElementById("location-search") as HTMLInputElement
    if (input) {
      const searchBox = new window.google.maps.places.SearchBox(input)

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces()
        if (places.length === 0) return

        const place = places[0]
        if (!place.geometry || !place.geometry.location) return

        // Update map and marker
        googleMapRef.current.setCenter(place.geometry.location)
        markerRef.current.setPosition(place.geometry.location)

        // Update form data
        setFormData((prev) => ({
          ...prev,
          location: place.formatted_address || input.value,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        }))
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSave = async () => {
    if (!userId) return

    setSaving(true)

    try {
      const formDataObj = new FormData()

      // Add all form fields
      formDataObj.append("studio_name", formData.studioName)
      formDataObj.append("location", formData.location)
      formDataObj.append("location_preferences", formData.locationDescription)
      formDataObj.append("is_mobile_artist", formData.isMobileArtist.toString())
      formDataObj.append("latitude", formData.latitude.toString())
      formDataObj.append("longitude", formData.longitude.toString())

      const result = await updateArtistProfileAction(formDataObj)

      if (result.success) {
        toast({
          title: "Success",
          description: "Your location information has been updated successfully",
        })

        // Refresh the profile data
        const { data } = await getArtistProfile(userId)
        setProfile(data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update location information",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving location information:", error)
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
            <h1 className="text-3xl font-bold">Studio & Location</h1>
            <p className="text-gray-500">Manage your studio information and location</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Studio & Location</h1>
          <p className="text-gray-500">Manage your studio information and location</p>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Studio Information</CardTitle>
            <CardDescription>Information about your studio and working location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="studioName">Studio Name</Label>
              <Input
                id="studioName"
                name="studioName"
                value={formData.studioName}
                onChange={handleChange}
                placeholder="Your studio name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-search">Location</Label>
              <Input
                id="location-search"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Search for your location"
              />
              <p className="text-sm text-gray-500">
                Search for your address or drag the pin on the map to set your exact location
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationDescription">Location Description</Label>
              <Textarea
                id="locationDescription"
                name="locationDescription"
                value={formData.locationDescription}
                onChange={handleChange}
                placeholder="Describe your studio environment and accessibility"
                rows={4}
              />
              <p className="text-sm text-gray-500">
                Include details like parking, accessibility, private room availability, etc.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isMobileArtist"
                checked={formData.isMobileArtist}
                onCheckedChange={(checked) => handleSwitchChange("isMobileArtist", checked)}
              />
              <Label htmlFor="isMobileArtist">I'm a mobile artist (willing to travel to clients)</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pin Your Location</CardTitle>
            <CardDescription>Click on the map or drag the pin to set your exact location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] rounded-md overflow-hidden bg-gray-100" ref={mapRef}>
              {!mapLoaded && (
                <div className="h-full flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-gray-400 animate-pulse" />
                  <span className="ml-2 text-gray-500">Loading map...</span>
                </div>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-500 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {formData.latitude && formData.longitude
                ? `Latitude: ${formData.latitude.toFixed(6)}, Longitude: ${formData.longitude.toFixed(6)}`
                : "No location selected"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
