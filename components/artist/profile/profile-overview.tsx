"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Instagram, Facebook, Twitter, Globe, Plus, Trash2 } from "lucide-react"

interface ProfileOverviewProps {
  onChange?: () => void
}

export function ProfileOverview({ onChange }: ProfileOverviewProps) {
  const [profileImage, setProfileImage] = useState("/placeholder.svg?text=Profile")
  const [coverImage, setCoverImage] = useState("/placeholder.svg?text=Cover")
  const [name, setName] = useState("Alex Morgan")
  const [artistName, setArtistName] = useState("Ink Alchemist")
  const [bio, setBio] = useState(
    "Award-winning tattoo artist with 8+ years of experience specializing in blackwork, neo-traditional, and Japanese styles. Based in Los Angeles with guest spots nationwide.",
  )
  const [experience, setExperience] = useState("8")
  const [specialties, setSpecialties] = useState(["blackwork", "neo-traditional", "japanese"])
  const [newSpecialty, setNewSpecialty] = useState("")

  const [socialLinks, setSocialLinks] = useState([
    { id: 1, platform: "instagram", url: "https://instagram.com/inkalchemist" },
    { id: 2, platform: "website", url: "https://inkalchemist.com" },
  ])

  const [newSocialPlatform, setNewSocialPlatform] = useState("instagram")
  const [newSocialUrl, setNewSocialUrl] = useState("")

  useEffect(() => {
    onChange?.()
  }, [profileImage, coverImage, name, artistName, bio, experience, specialties, socialLinks, onChange])

  const handleAddSpecialty = () => {
    if (!newSpecialty.trim() || specialties.includes(newSpecialty.toLowerCase())) return
    setSpecialties([...specialties, newSpecialty.toLowerCase()])
    setNewSpecialty("")
    onChange?.()
  }

  const handleRemoveSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((s) => s !== specialty))
    onChange?.()
  }

  const handleAddSocialLink = () => {
    if (!newSocialUrl.trim()) return

    setSocialLinks([
      ...socialLinks,
      {
        id: Date.now(),
        platform: newSocialPlatform,
        url: newSocialUrl,
      },
    ])

    setNewSocialPlatform("instagram")
    setNewSocialUrl("")
    onChange?.()
  }

  const handleRemoveSocialLink = (id: number) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id))
    onChange?.()
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-4 w-4" />
      case "facebook":
        return <Facebook className="h-4 w-4" />
      case "twitter":
        return <Twitter className="h-4 w-4" />
      case "website":
        return <Globe className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-purple-200">Profile Images</CardTitle>
          <CardDescription className="text-purple-400">Upload your profile and cover images</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Label className="text-purple-300 mb-2 block">Profile Image</Label>
              <div className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-black/40 border border-purple-500/30">
                  <Image src={profileImage || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-2 right-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-purple-400 mt-2">Recommended: 500x500px, JPG or PNG</p>
            </div>

            <div className="md:col-span-2">
              <Label className="text-purple-300 mb-2 block">Cover Image</Label>
              <div className="relative group">
                <div className="aspect-[2/1] rounded-lg overflow-hidden bg-black/40 border border-purple-500/30">
                  <Image src={coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-2 right-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-purple-400 mt-2">Recommended: 1200x600px, JPG or PNG</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-purple-200">Basic Information</CardTitle>
          <CardDescription className="text-purple-400">Your name and profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="full-name" className="text-purple-300">
                Full Name
              </Label>
              <Input
                id="full-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  onChange?.()
                }}
                className="bg-black/40 border-purple-500/30 focus:border-purple-400 mt-1"
              />
              <p className="text-xs text-purple-400 mt-1">Your legal name (not visible to clients)</p>
            </div>
            <div>
              <Label htmlFor="artist-name" className="text-purple-300">
                Artist Name
              </Label>
              <Input
                id="artist-name"
                value={artistName}
                onChange={(e) => {
                  setArtistName(e.target.value)
                  onChange?.()
                }}
                className="bg-black/40 border-purple-500/30 focus:border-purple-400 mt-1"
              />
              <p className="text-xs text-purple-400 mt-1">Your professional name (visible to clients)</p>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="bio" className="text-purple-300">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value)
                  onChange?.()
                }}
                className="min-h-[120px] bg-black/40 border-purple-500/30 focus:border-purple-400 mt-1"
              />
              <p className="text-xs text-purple-400 mt-1">
                Brief description of your experience and style (250 characters max)
              </p>
            </div>
            <div>
              <Label htmlFor="experience" className="text-purple-300">
                Years of Experience
              </Label>
              <Input
                id="experience"
                value={experience}
                onChange={(e) => {
                  setExperience(e.target.value)
                  onChange?.()
                }}
                className="bg-black/40 border-purple-500/30 focus:border-purple-400 mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-purple-200">Specialties</CardTitle>
          <CardDescription className="text-purple-400">Add your tattoo style specialties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {specialties.map((specialty) => (
              <div
                key={specialty}
                className="flex items-center bg-purple-900/30 text-purple-300 px-3 py-1.5 rounded-full"
              >
                {specialty}
                <button
                  onClick={() => handleRemoveSpecialty(specialty)}
                  className="ml-2 text-purple-400 hover:text-red-400"
                  aria-label={`Remove ${specialty}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex">
            <Input
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              placeholder="Add a specialty (e.g., blackwork, realism)"
              className="bg-black/40 border-purple-500/30 focus:border-purple-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddSpecialty()
                }
              }}
            />
            <Button onClick={handleAddSpecialty} className="ml-2 bg-purple-700 hover:bg-purple-600">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-purple-200">Social Media</CardTitle>
          <CardDescription className="text-purple-400">Add links to your social media profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-purple-500/20"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-900/40 text-purple-400 mr-3">
                    {getSocialIcon(link.platform)}
                  </div>
                  <div>
                    <div className="text-sm text-purple-300 capitalize">{link.platform}</div>
                    <div className="text-white">{link.url}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSocialLink(link.id)}
                  className="text-purple-300 hover:text-red-400 hover:bg-red-900/20"
                  aria-label={`Remove ${link.platform}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={newSocialPlatform}
              onChange={(e) => setNewSocialPlatform(e.target.value)}
              className="bg-black/40 border-purple-500/30 rounded-md p-2 text-white"
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
              <option value="website">Website</option>
            </select>
            <div className="flex flex-1">
              <Input
                value={newSocialUrl}
                onChange={(e) => setNewSocialUrl(e.target.value)}
                placeholder="https://"
                className="bg-black/40 border-purple-500/30 focus:border-purple-400"
              />
              <Button onClick={handleAddSocialLink} className="ml-2 bg-purple-700 hover:bg-purple-600">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
