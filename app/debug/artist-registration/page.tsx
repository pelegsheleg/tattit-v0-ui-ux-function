"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createArtistAccount, checkEmailExists } from "@/app/actions/artist-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw } from "lucide-react"

export default function ArtistRegistrationDebug() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [emailExists, setEmailExists] = useState(false)

  // Generate a unique email with timestamp
  const generateUniqueEmail = () => {
    const timestamp = new Date().getTime()
    return `test-artist-${timestamp}@example.com`
  }

  const [formData, setFormData] = useState({
    email: generateUniqueEmail(),
    password: "password123",
    fullName: "Test Artist",
    phone: "1234567890",
    bio: "This is a test artist bio that is at least 50 characters long for testing purposes.",
    yearsOfExperience: 5,
    specialties: "Realism, Black and Gray",
    personalBrandStatement: "Creating unique art for unique people",
    studioName: "Test Studio",
    location: "New York, NY",
    isMobileArtist: false,
    locationPreferences: "Manhattan, Brooklyn",
    certifications: "Certified Tattoo Artist",
    styleTags: ["Realism", "Black and Gray"],
    profileImage: "",
  })

  // Check if email exists when it changes
  useEffect(() => {
    const checkEmail = async () => {
      if (!formData.email) return

      setCheckingEmail(true)
      try {
        const exists = await checkEmailExists(formData.email)
        setEmailExists(exists)
      } catch (error) {
        console.error("Error checking email:", error)
      } finally {
        setCheckingEmail(false)
      }
    }

    checkEmail()
  }, [formData.email])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isMobileArtist: checked }))
  }

  const regenerateEmail = () => {
    setFormData((prev) => ({ ...prev, email: generateUniqueEmail() }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (emailExists) {
      setResult({ error: "Email already exists. Please use a different email." })
      return
    }

    setLoading(true)
    try {
      const result = await createArtistAccount(formData)
      setResult(result)

      // If successful, generate a new email for the next test
      if (result.success) {
        regenerateEmail()
      }
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Artist Registration Debug</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Test Artist Registration</CardTitle>
            <CardDescription>Fill out this form to test the artist registration process</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={emailExists ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={regenerateEmail}
                    title="Generate new email"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                {emailExists && <p className="text-sm text-red-500">This email is already registered</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  value={formData.yearsOfExperience.toString()}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, yearsOfExperience: Number.parseInt(e.target.value) || 0 }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialties">Specialties</Label>
                <Input
                  id="specialties"
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personalBrandStatement">Personal Brand Statement</Label>
                <Input
                  id="personalBrandStatement"
                  name="personalBrandStatement"
                  value={formData.personalBrandStatement}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studioName">Studio Name</Label>
                <Input id="studioName" name="studioName" value={formData.studioName} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isMobileArtist" checked={formData.isMobileArtist} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="isMobileArtist">Mobile Artist</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationPreferences">Location Preferences</Label>
                <Input
                  id="locationPreferences"
                  name="locationPreferences"
                  value={formData.locationPreferences}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Input
                  id="certifications"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" disabled={loading || checkingEmail || emailExists}>
                {loading ? "Testing..." : "Test Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>The result of the registration test will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {result.error ? (
                  <Alert variant="destructive">
                    <AlertDescription>{result.error}</AlertDescription>
                  </Alert>
                ) : null}
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[500px] text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-500 italic">No result yet</p>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">Check the browser console for more detailed logs</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
