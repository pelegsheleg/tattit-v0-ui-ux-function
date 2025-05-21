"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Upload, Trash2, Calendar, Shield, CheckCircle } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { getArtistCredentials } from "@/lib/services/artist"
import { uploadCredentialAction, deleteCredentialAction } from "@/app/actions/artist-actions"

export default function ArtistCredentialsPage() {
  const { userId } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [credentials, setCredentials] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("")
  const [documentName, setDocumentName] = useState("")
  const [expirationDate, setExpirationDate] = useState("")

  useEffect(() => {
    const loadCredentials = async () => {
      if (!userId) return

      try {
        const { data, error } = await getArtistCredentials(userId)

        if (error) {
          throw new Error(error)
        }

        setCredentials(data || [])
      } catch (error) {
        console.error("Error loading credentials:", error)
        toast({
          title: "Error",
          description: "Failed to load credentials",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadCredentials()
  }, [userId, toast])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !documentType || !documentName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("document_type", documentType)
      formData.append("document_name", documentName)
      if (expirationDate) {
        formData.append("expiration_date", expirationDate)
      }

      const result = await uploadCredentialAction(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Credential uploaded successfully",
        })

        // Refresh the credentials
        const { data } = await getArtistCredentials(userId!)
        setCredentials(data || [])

        // Reset the form
        setSelectedFile(null)
        setDocumentType("")
        setDocumentName("")
        setExpirationDate("")

        // Reset the file input
        const fileInput = document.getElementById("credential-file") as HTMLInputElement
        if (fileInput) {
          fileInput.value = ""
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to upload credential",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error uploading credential:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (credentialId: string) => {
    try {
      const formData = new FormData()
      formData.append("credential_id", credentialId)

      const result = await deleteCredentialAction(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Credential deleted successfully",
        })

        // Update the local state
        setCredentials(credentials.filter((cred) => cred.id !== credentialId))
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete credential",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting credential:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Credentials</h1>
            <p className="text-gray-500">Manage your licenses, certifications, and other credentials</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-gray-500">Manage your licenses, certifications, and other credentials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Credentials</CardTitle>
              <CardDescription>
                Licenses, certifications, and other documents that verify your qualifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {credentials.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No credentials</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload your licenses, certifications, and other credentials to build trust with clients.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {credentials.map((credential) => (
                    <Card key={credential.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-center p-4">
                          <div className="bg-gray-100 p-3 rounded-lg mr-4">
                            <FileText className="h-6 w-6 text-gray-600" />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium">{credential.document_name}</h3>
                            <p className="text-sm text-gray-500">{credential.document_type}</p>
                            {credential.expiration_date && (
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                Expires: {new Date(credential.expiration_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {credential.is_verified ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <Shield className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(credential.id)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload New Credential</CardTitle>
              <CardDescription>Add a new license, certification, or other credential</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type</Label>
                  <select
                    id="documentType"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="License">License</option>
                    <option value="Certification">Certification</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Training">Training</option>
                    <option value="Award">Award</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentName">Document Name</Label>
                  <Input
                    id="documentName"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="e.g., Bloodborne Pathogens Certification"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expirationDate">Expiration Date (if applicable)</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credential-file">Upload Document</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    {selectedFile ? (
                      <div className="text-sm font-medium text-gray-900">{selectedFile.name}</div>
                    ) : (
                      <>
                        <FileText className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm font-medium">
                          Drag and drop, or <span className="text-blue-500 cursor-pointer">browse</span>
                        </p>
                        <p className="mt-1 text-xs text-gray-500">Upload PDF, JPG, or PNG files (max 5MB)</p>
                      </>
                    )}
                    <Input
                      id="credential-file"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={uploading || !selectedFile || !documentType || !documentName}
                >
                  {uploading ? "Uploading..." : "Upload Credential"}
                  <Upload className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-3">
              <div className="text-xs text-gray-500">
                <p className="font-medium">Why upload credentials?</p>
                <p className="mt-1">
                  Verified credentials build trust with clients and can be surfaced as filters in search results.
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
