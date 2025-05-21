"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

export default function GoogleMapsLoader() {
  const [loaded, setLoaded] = useState(false)
  const [apiKey, setApiKey] = useState("")

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setLoaded(true)
      // Dispatch an event to notify other components
      window.dispatchEvent(new Event("google-maps-loaded"))
      return
    }

    // Fetch the API key from the server
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
      }
    }

    fetchApiKey()
  }, [])

  const handleLoad = () => {
    setLoaded(true)
    // Dispatch an event to notify other components
    window.dispatchEvent(new Event("google-maps-loaded"))
  }

  if (!apiKey) {
    return null // Don't render the script tag until we have the API key
  }

  return (
    <Script
      id="google-maps-script"
      src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
      strategy="lazyOnload"
      loading="async"
      onLoad={handleLoad}
    />
  )
}
