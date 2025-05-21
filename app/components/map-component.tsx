"use client"

import { useState, useMemo, useEffect } from "react"
import { GoogleMap, Marker } from "@react-google-maps/api"

interface Artist {
  id: number
  name: string
  lat: number
  lng: number
  // Other properties...
}

interface GoogleMapComponentProps {
  artists: Artist[]
  isLoaded: boolean
}

export function GoogleMapComponent({ artists, isLoaded }: GoogleMapComponentProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [apiKey, setApiKey] = useState("")

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch("/api/maps/key")
        if (!response.ok) throw new Error("Failed to fetch API key")
        const data = await response.json()
        setApiKey(data.apiKey)
      } catch (error) {
        console.error("Error fetching Google Maps API key:", error)
      }
    }
    fetchApiKey()
  }, [])

  // Calculate center based on artists
  const center = useMemo(() => {
    if (artists.length === 0) {
      return { lat: 40.7128, lng: -74.006 } // Default to NYC
    }

    const sumLat = artists.reduce((sum, artist) => sum + artist.lat, 0)
    const sumLng = artists.reduce((sum, artist) => sum + artist.lng, 0)

    return {
      lat: sumLat / artists.length,
      lng: sumLng / artists.length,
    }
  }, [artists])

  const onLoad = (map: google.maps.Map) => {
    setMap(map)
  }

  const onUnmount = () => {
    setMap(null)
  }

  if (!isLoaded) {
    return (
      <div className="h-96 w-full rounded-lg overflow-hidden mb-6 bg-purple-900/20 flex items-center justify-center">
        <div className="animate-pulse text-purple-300">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden mb-6">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#242f3e" }],
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#242f3e" }],
            },
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#746855" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }],
            },
          ],
        }}
      >
        {artists.map((artist) => (
          <Marker
            key={artist.id}
            position={{ lat: artist.lat, lng: artist.lng }}
            icon={{
              url: "/marker.svg",
              scaledSize: new google.maps.Size(30, 30),
            }}
            title={artist.name}
          />
        ))}
      </GoogleMap>
    </div>
  )
}
