"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface LocationSectionProps {
  onChange?: () => void
}

export function LocationSection({ onChange }: LocationSectionProps) {
  const [studioName, setStudioName] = useState("Neon Pulse Tattoo Studio")
  const [address, setAddress] = useState("123 Cyber Street, Neo City, NC 12345")
  const [travelWilling, setTravelWilling] = useState(true)
  const [serviceAreas, setServiceAreas] = useState(["Neo City", "Techno Heights", "Digital District", "Pixel Valley"])
  const [additionalNotes, setAdditionalNotes] = useState(
    "The studio is located on the second floor. There's free parking available in the back.",
  )
  const [newArea, setNewArea] = useState("")

  useEffect(() => {
    onChange?.()
  }, [studioName, address, travelWilling, serviceAreas, additionalNotes, onChange])

  const handleAddServiceArea = () => {
    if (newArea.trim() && !serviceAreas.includes(newArea.trim())) {
      setServiceAreas([...serviceAreas, newArea.trim()])
      setNewArea("")
      onChange?.()
    }
  }

  const handleRemoveServiceArea = (area: string) => {
    setServiceAreas(serviceAreas.filter((a) => a !== area))
    onChange?.()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-purple-200">Studio Information</CardTitle>
            <CardDescription className="text-purple-400">Your primary tattoo studio details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="studio-name" className="text-purple-300">
                Studio Name
              </Label>
              <Input
                id="studio-name"
                value={studioName}
                onChange={(e) => {
                  setStudioName(e.target.value)
                  onChange?.()
                }}
                className="bg-black/40 border-purple-500/30 focus:border-purple-400 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-purple-300">
                Address
              </Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value)
                  onChange?.()
                }}
                className="bg-black/40 border-purple-500/30 focus:border-purple-400 mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="additional-notes" className="text-purple-300">
                Additional Notes
              </Label>
              <Textarea
                id="additional-notes"
                value={additionalNotes}
                onChange={(e) => {
                  setAdditionalNotes(e.target.value)
                  onChange?.()
                }}
                className="bg-black/40 border-purple-500/30 focus:border-purple-400 mt-1"
                rows={3}
                placeholder="Parking information, entrance details, etc."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-purple-200">Service Areas</CardTitle>
            <CardDescription className="text-purple-400">Areas where you provide tattoo services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 p-4 rounded-lg bg-black/30 border border-purple-500/20">
              <Switch
                id="travel-willing"
                checked={travelWilling}
                onCheckedChange={(checked) => {
                  setTravelWilling(checked)
                  onChange?.()
                }}
                className="data-[state=checked]:bg-purple-700"
              />
              <Label htmlFor="travel-willing" className="text-purple-300">
                Willing to travel to clients
              </Label>
            </div>

            <div className="p-4 rounded-lg bg-black/30 border border-purple-500/20">
              <h4 className="text-sm font-medium text-purple-300 mb-3">Areas Served</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {serviceAreas.map((area) => (
                  <Badge key={area} className="bg-purple-900/70 text-purple-100 pr-1 flex items-center">
                    {area}
                    <button
                      onClick={() => handleRemoveServiceArea(area)}
                      className="ml-1 hover:bg-purple-700 rounded-full p-1"
                      aria-label={`Remove ${area}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add new area"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="bg-black/40 border-purple-500/30 focus:border-purple-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddServiceArea()
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={handleAddServiceArea}
                  className="bg-purple-950/50 border-purple-500/30 hover:bg-purple-800/50"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
