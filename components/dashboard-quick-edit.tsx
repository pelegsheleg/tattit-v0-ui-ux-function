"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Check, X } from "lucide-react"
import { updateArtistProfileAction } from "@/app/actions/artist-actions"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function DashboardQuickEdit({ profile }) {
  const { toast } = useToast()
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)

  const [editedProfile, setEditedProfile] = useState({
    bio: profile?.bio || "",
    hourly_rate: profile?.hourly_rate || "",
    location: profile?.location || "",
    studio_name: profile?.studio_name || "",
    years_of_experience: profile?.years_of_experience || "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    const formData = new FormData()
    formData.append("bio", editedProfile.bio)
    formData.append("hourly_rate", editedProfile.hourly_rate.toString())
    formData.append("location", editedProfile.location)
    formData.append("studio_name", editedProfile.studio_name)
    formData.append("years_of_experience", editedProfile.years_of_experience.toString())

    try {
      const result = await updateArtistProfileAction(formData)

      if (result.success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
        setIsEditing(false)
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setEditedProfile({
      bio: profile?.bio || "",
      hourly_rate: profile?.hourly_rate || "",
      location: profile?.location || "",
      studio_name: profile?.studio_name || "",
      years_of_experience: profile?.years_of_experience || "",
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-4 w-full">
      {isEditing ? (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              name="bio"
              value={editedProfile.bio}
              onChange={handleChange}
              placeholder="Tell clients about yourself"
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hourly Rate ($)</label>
              <Input
                name="hourly_rate"
                type="number"
                value={editedProfile.hourly_rate}
                onChange={handleChange}
                placeholder="100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Experience (years)</label>
              <Input
                name="years_of_experience"
                type="number"
                value={editedProfile.years_of_experience}
                onChange={handleChange}
                placeholder="5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input name="location" value={editedProfile.location} onChange={handleChange} placeholder="City, State" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Studio Name</label>
            <Input
              name="studio_name"
              value={editedProfile.studio_name}
              onChange={handleChange}
              placeholder="Your studio name"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Check className="mr-1 h-4 w-4" />
              Save
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500">Bio</h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit Profile</span>
              </Button>
            </div>
            <p className="text-sm">{profile?.bio || "Add a bio to tell clients about yourself and your work."}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Hourly Rate</h3>
              <p className="text-sm font-medium">${profile?.hourly_rate || "Not set"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Experience</h3>
              <p className="text-sm">{profile?.years_of_experience || "0"} years</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="text-sm">{profile?.location || "Not set"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Studio</h3>
              <p className="text-sm">{profile?.studio_name || "Independent Artist"}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
