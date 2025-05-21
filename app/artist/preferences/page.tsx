"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, XSquare, Trash2, Save, Plus } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { getArtistProfile } from "@/lib/services/artist"
import { updateArtistProfileAction } from "@/app/actions/artist-actions"

export default function ArtistPreferencesPage() {
  const { userId } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  // Form state
  const [formData, setFormData] = useState({
    doList: [""],
    dontList: [""],
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
            doList: data.do_list || [""],
            dontList: data.dont_list || [""],
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

  const handleArrayChange = (name: string, index: number, value: string) => {
    setFormData((prev) => {
      const newArray = [...(prev[name as keyof typeof prev] as string[])]
      newArray[index] = value
      return { ...prev, [name]: newArray }
    })
  }

  const handleAddArrayItem = (name: string) => {
    setFormData((prev) => {
      const newArray = [...(prev[name as keyof typeof prev] as string[]), ""]
      return { ...prev, [name]: newArray }
    })
  }

  const handleRemoveArrayItem = (name: string, index: number) => {
    setFormData((prev) => {
      const newArray = [...(prev[name as keyof typeof prev] as string[])]
      newArray.splice(index, 1)
      return { ...prev, [name]: newArray.length ? newArray : [""] }
    })
  }

  const handleSave = async () => {
    if (!userId) return

    setSaving(true)

    try {
      const formDataObj = new FormData()

      // Add all form fields
      formDataObj.append("do_list", JSON.stringify(formData.doList.filter((item) => item.trim())))
      formDataObj.append("dont_list", JSON.stringify(formData.dontList.filter((item) => item.trim())))

      const result = await updateArtistProfileAction(formDataObj)

      if (result.success) {
        toast({
          title: "Success",
          description: "Your preferences have been updated successfully",
        })

        // Refresh the profile data
        const { data } = await getArtistProfile(userId)
        setProfile(data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update preferences",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving preferences:", error)
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
            <h1 className="text-3xl font-bold">Do/Don't List</h1>
            <p className="text-gray-500">Specify what types of tattoos you love to do and what you don't do</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Do/Don't List</h1>
          <p className="text-gray-500">Specify what types of tattoos you love to do and what you don't do</p>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckSquare className="mr-2 h-5 w-5 text-green-500" />
              Tattoos I Love to Do
            </CardTitle>
            <CardDescription>List the types of tattoos, styles, and designs you enjoy creating</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.doList.map((item, index) => (
              <div key={`do-${index}`} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={(e) => handleArrayChange("doList", index, e.target.value)}
                  placeholder="e.g., Floral designs"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveArrayItem("doList", index)}
                  disabled={formData.doList.length === 1 && !formData.doList[0]}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button type="button" variant="outline" size="sm" onClick={() => handleAddArrayItem("doList")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <XSquare className="mr-2 h-5 w-5 text-red-500" />
              Tattoos I Don't Do
            </CardTitle>
            <CardDescription>List the types of tattoos you decline to create</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.dontList.map((item, index) => (
              <div key={`dont-${index}`} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={(e) => handleArrayChange("dontList", index, e.target.value)}
                  placeholder="e.g., Face tattoos"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveArrayItem("dontList", index)}
                  disabled={formData.dontList.length === 1 && !formData.dontList[0]}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button type="button" variant="outline" size="sm" onClick={() => handleAddArrayItem("dontList")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
