"use client"

import Link from "next/link"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  User,
  ImageIcon,
  MapPin,
  Shield,
  FileText,
  CheckSquare,
  XSquare,
  DollarSign,
  CreditCard,
  Bell,
  Upload,
  Save,
  Edit,
  Trash2,
} from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { getArtistProfile, getArtistPortfolio } from "@/lib/services/artist"
import { updateArtistProfileAction } from "@/app/actions/artist-actions"
import ImageCropper from "@/components/image-cropper"
import { PortfolioGallery } from "@/components/portfolio-gallery"

export default function ArtistProfilePage() {
  const { userId } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [portfolioImages, setPortfolioImages] = useState<any[]>([])
  const [portfolioLoading, setPortfolioLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [croppedImage, setCroppedImage] = useState<File | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [completionPercentage, setCompletionPercentage] = useState(0)

  // Form state
  const [formData, setFormData] = useState({
    bio: "",
    shortBio: "",
    fullName: "",
    studioName: "",
    location: "",
    locationDescription: "",
    hourlyRate: "",
    minimumPrice: "",
    yearsExperience: "",
    doList: [""],
    dontList: [""],
    depositPercentage: "25",
    cancellationHours: "48",
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
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
            bio: data.bio || "",
            shortBio: data.personal_brand_statement || "",
            fullName: data.full_name || "",
            studioName: data.studio_name || "",
            location: data.location || "",
            locationDescription: data.location_preferences || "",
            hourlyRate: data.hourly_rate?.toString() || "",
            minimumPrice: data.minimum_price?.toString() || "",
            yearsExperience: data.years_experience?.toString() || "",
            doList: data.do_list || [""],
            dontList: data.dont_list || [""],
            depositPercentage: data.deposit_percentage?.toString() || "25",
            cancellationHours: data.cancellation_hours?.toString() || "48",
            emailNotifications: data.email_notifications !== false,
            pushNotifications: data.push_notifications !== false,
            smsNotifications: data.sms_notifications === true,
          })
        }

        // Calculate profile completion
        calculateProfileCompletion(data)
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

    const loadPortfolio = async () => {
      if (!userId) return

      setPortfolioLoading(true)
      try {
        const { data, error } = await getArtistPortfolio(userId)

        if (error) {
          throw new Error(error)
        }

        setPortfolioImages(data || [])
      } catch (error) {
        console.error("Error loading portfolio:", error)
        toast({
          title: "Error",
          description: "Failed to load portfolio images",
          variant: "destructive",
        })
      } finally {
        setPortfolioLoading(false)
      }
    }

    loadProfile()
    loadPortfolio()
  }, [userId, toast])

  const calculateProfileCompletion = (data: any) => {
    if (!data) {
      setCompletionPercentage(0)
      return
    }

    const sections = [
      !!data.bio,
      !!data.personal_brand_statement,
      !!data.profile_image_url,
      !!data.studio_name,
      !!data.location,
      !!data.hourly_rate,
      !!data.years_experience,
      !!data.specialties && data.specialties.length > 0,
      !!data.style_tags && data.style_tags.length > 0,
      !!data.certifications,
      !!data.do_list && data.do_list.length > 0,
      !!data.dont_list && data.dont_list.length > 0,
    ]

    const completedSections = sections.filter(Boolean).length
    setCompletionPercentage(Math.round((completedSections / sections.length) * 100))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
      setShowCropper(true)
    }
  }

  const handleCropComplete = (croppedFile: File) => {
    setCroppedImage(croppedFile)
    setShowCropper(false)
  }

  const handleCropCancel = () => {
    setSelectedImage(null)
    setShowCropper(false)
  }

  const handleSaveProfile = async () => {
    if (!userId) return

    setSaving(true)

    try {
      const formDataObj = new FormData()

      // Add all form fields
      formDataObj.append("bio", formData.bio)
      formDataObj.append("short_bio", formData.shortBio)
      formDataObj.append("studio_name", formData.studioName)
      formDataObj.append("location", formData.location)
      formDataObj.append("location_description", formData.locationDescription)
      formDataObj.append("hourly_rate", formData.hourlyRate)
      formDataObj.append("minimum_price", formData.minimumPrice)
      formDataObj.append("years_experience", formData.yearsExperience)
      formDataObj.append("do_list", JSON.stringify(formData.doList.filter((item) => item.trim())))
      formDataObj.append("dont_list", JSON.stringify(formData.dontList.filter((item) => item.trim())))
      formDataObj.append("deposit_percentage", formData.depositPercentage)
      formDataObj.append("cancellation_hours", formData.cancellationHours)
      formDataObj.append("email_notifications", formData.emailNotifications.toString())
      formDataObj.append("push_notifications", formData.pushNotifications.toString())
      formDataObj.append("sms_notifications", formData.smsNotifications.toString())

      // Add profile image if available
      if (croppedImage) {
        formDataObj.append("profile_image", croppedImage)
      }

      const result = await updateArtistProfileAction(formDataObj)

      if (result.success) {
        toast({
          title: "Success",
          description: "Your profile has been updated successfully",
        })

        // Refresh the profile data
        const { data } = await getArtistProfile(userId)
        setProfile(data)
        calculateProfileCompletion(data)

        // Reset the cropped image
        setCroppedImage(null)

        // Redirect to the dashboard
        router.push("/artist/dashboard")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving profile:", error)
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
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="md:col-span-3">
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Artist Profile</h1>
          <p className="text-gray-500">Manage your professional profile and settings</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">Profile Completion</span>
            <div className="w-32 mt-1">
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {showCropper && selectedImage ? (
        <Card>
          <CardHeader>
            <CardTitle>Crop Profile Image</CardTitle>
            <CardDescription>Adjust your profile picture to fit perfectly</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageCropper image={selectedImage} onCropComplete={handleCropComplete} onCancel={handleCropCancel} />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="basics">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="space-y-4 sticky top-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-4 py-4">
                      <div className="relative">
                        <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100">
                          {croppedImage ? (
                            <img
                              src={URL.createObjectURL(croppedImage) || "/placeholder.svg"}
                              alt="Profile preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <img
                              src={profile?.profile_image_url || "/placeholder.svg?height=128&width=128&query=artist"}
                              alt={formData.fullName || "Artist"}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                          onClick={() => document.getElementById("profile-image-upload")?.click()}
                        >
                          <Edit className="h-4 w-4" />
                          <input
                            type="file"
                            id="profile-image-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageSelect}
                          />
                        </Button>
                      </div>
                      <h2 className="text-xl font-semibold">
                        {formData.fullName || profile?.full_name || "Your Name"}
                      </h2>
                      <p className="text-sm text-gray-500 text-center max-w-full overflow-hidden text-ellipsis break-words px-2">
                        {formData.shortBio || "Your short bio will appear here"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <TabsList className="flex flex-col h-auto space-y-1">
                  <TabsTrigger value="basics" className="justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Profile Basics
                  </TabsTrigger>
                  <TabsTrigger value="portfolio" className="justify-start">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Portfolio
                  </TabsTrigger>
                  <TabsTrigger value="location" className="justify-start">
                    <MapPin className="mr-2 h-4 w-4" />
                    Studio & Location
                  </TabsTrigger>
                  <TabsTrigger value="credentials" className="justify-start">
                    <Shield className="mr-2 h-4 w-4" />
                    Credentials
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="justify-start">
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Do/Don't List
                  </TabsTrigger>
                  <TabsTrigger value="pricing" className="justify-start">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Pricing
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="justify-start">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Rules
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <div className="md:col-span-3 space-y-6">
              <TabsContent value="basics" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Basics</CardTitle>
                    <CardDescription>
                      This information will be displayed on your profile and in search results
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                      />
                      <p className="text-sm text-gray-500">This is how clients will see you on the platform</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shortBio">Short Introduction</Label>
                      <Input
                        id="shortBio"
                        name="shortBio"
                        value={formData.shortBio}
                        onChange={handleChange}
                        placeholder="A brief introduction (1-2 sentences)"
                      />
                      <p className="text-sm text-gray-500">This appears in search results and match cards</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Full Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell clients about yourself, your style, and your approach"
                        rows={6}
                      />
                      <p className="text-sm text-gray-500">Detailed information about your experience and style</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience">Years of Experience</Label>
                      <Input
                        id="yearsExperience"
                        name="yearsExperience"
                        type="number"
                        min="0"
                        value={formData.yearsExperience}
                        onChange={handleChange}
                        placeholder="e.g., 5"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Management</CardTitle>
                    <CardDescription>Manage your portfolio images and showcase your best work</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {portfolioLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-32" />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="aspect-square rounded-md" />
                          ))}
                        </div>
                      </div>
                    ) : portfolioImages.length > 0 ? (
                      <PortfolioGallery images={portfolioImages} />
                    ) : (
                      <div className="text-center py-8">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No Portfolio Images</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Upload and manage your portfolio images from the dedicated portfolio page
                        </p>
                        <div className="mt-6">
                          <Button asChild>
                            <Link href="/artist/portfolio">
                              <Upload className="mr-2 h-4 w-4" />
                              Manage Portfolio
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Studio & Location</CardTitle>
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
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, State"
                      />
                      <p className="text-sm text-gray-500">This helps clients find you in location-based searches</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locationDescription">Location Description</Label>
                      <Textarea
                        id="locationDescription"
                        name="locationDescription"
                        value={formData.locationDescription}
                        onChange={handleChange}
                        placeholder="Describe your studio environment and accessibility"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isMobileArtist"
                        checked={profile?.is_mobile_artist || false}
                        onCheckedChange={(checked) => handleSwitchChange("isMobileArtist", checked)}
                      />
                      <Label htmlFor="isMobileArtist">I'm a mobile artist (willing to travel to clients)</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="credentials" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Credentials</CardTitle>
                    <CardDescription>Add your licenses, certifications, and other credentials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications & Licenses</Label>
                      <Textarea
                        id="certifications"
                        name="certifications"
                        value={profile?.certifications || ""}
                        onChange={handleChange}
                        placeholder="List your certifications, licenses, and training"
                      />
                      <p className="text-sm text-gray-500">
                        Include bloodborne pathogens certification, health department licenses, etc.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label>Upload Credential Documents</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <FileText className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm font-medium">
                          Drag and drop files, or <span className="text-blue-500 cursor-pointer">browse</span>
                        </p>
                        <p className="mt-1 text-xs text-gray-500">Upload PDF, JPG, or PNG files (max 5MB each)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Do/Don't List</CardTitle>
                    <CardDescription>
                      Specify what types of tattoos you love to do and what you don't do
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label className="flex items-center">
                          <CheckSquare className="mr-2 h-4 w-4 text-green-500" />
                          Tattoos I Love to Do
                        </Label>

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
                          Add Item
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <Label className="flex items-center">
                          <XSquare className="mr-2 h-4 w-4 text-red-500" />
                          Tattoos I Don't Do
                        </Label>

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

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddArrayItem("dontList")}
                        >
                          Add Item
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Information</CardTitle>
                    <CardDescription>Set your rates and pricing structure</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
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

                    <div className="space-y-2">
                      <Label>Price Ranges by Style & Size</Label>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-2">
                          Coming soon: Set specific price ranges for different styles and sizes
                        </p>
                        <Button variant="outline" disabled>
                          Add Price Range
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pricingFAQ">Pricing FAQ</Label>
                      <Textarea
                        id="pricingFAQ"
                        name="pricingFAQ"
                        placeholder="Answer common pricing questions here"
                        rows={4}
                      />
                      <p className="text-sm text-gray-500">
                        Help clients understand your pricing structure and what affects cost
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Rules</CardTitle>
                    <CardDescription>Set your deposit and cancellation policies</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                      <p className="text-sm text-gray-500">
                        Percentage of total price required as a non-refundable deposit
                      </p>
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
                      <p className="text-sm text-gray-500">
                        How many hours notice required for cancellation without penalty
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentPolicy">Payment Policy</Label>
                      <Textarea
                        id="paymentPolicy"
                        name="paymentPolicy"
                        placeholder="Describe your payment and cancellation policies in detail"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Control how and when you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="emailNotifications">Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={formData.emailNotifications}
                          onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="pushNotifications">Push Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications on your device</p>
                        </div>
                        <Switch
                          id="pushNotifications"
                          checked={formData.pushNotifications}
                          onCheckedChange={(checked) => handleSwitchChange("pushNotifications", checked)}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="smsNotifications">SMS Notifications</Label>
                          <p className="text-sm text-gray-500">Receive text messages for important updates</p>
                        </div>
                        <Switch
                          id="smsNotifications"
                          checked={formData.smsNotifications}
                          onCheckedChange={(checked) => handleSwitchChange("smsNotifications", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      )}
    </div>
  )
}
