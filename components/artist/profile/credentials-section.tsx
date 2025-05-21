"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Award, Calendar, Plus, Trash2 } from "lucide-react"

interface CredentialsSectionProps {
  onChange?: () => void
}

export function CredentialsSection({ onChange }: CredentialsSectionProps) {
  const [credentials, setCredentials] = useState([
    {
      id: "1",
      type: "certification",
      title: "Bloodborne Pathogens Certification",
      issuer: "Red Cross",
      date: "2022-05-15",
      expiryDate: "2023-05-15",
      description: "Standard certification for bloodborne pathogens safety protocols",
    },
    {
      id: "2",
      type: "license",
      title: "Professional Tattoo License",
      issuer: "State Board of Health",
      date: "2021-03-10",
      expiryDate: "2024-03-10",
      description: "State-issued professional tattoo artist license",
    },
    {
      id: "3",
      type: "award",
      title: "Best Blackwork Design",
      issuer: "International Tattoo Convention",
      date: "2022-09-22",
      expiryDate: "",
      description: "Award for excellence in blackwork tattoo design",
    },
  ])

  const [newCredential, setNewCredential] = useState({
    type: "certification",
    title: "",
    issuer: "",
    date: "",
    expiryDate: "",
    description: "",
  })

  useEffect(() => {
    onChange?.()
  }, [credentials, onChange])

  const handleAddCredential = () => {
    if (newCredential.title.trim() === "" || newCredential.issuer.trim() === "" || newCredential.date.trim() === "") {
      return
    }

    setCredentials([
      ...credentials,
      {
        id: Date.now().toString(),
        ...newCredential,
      },
    ])

    setNewCredential({
      type: "certification",
      title: "",
      issuer: "",
      date: "",
      expiryDate: "",
      description: "",
    })

    onChange?.()
  }

  const handleDeleteCredential = (id: string) => {
    setCredentials(credentials.filter((credential) => credential.id !== id))
    onChange?.()
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-purple-200">Professional Credentials</CardTitle>
          <CardDescription className="text-purple-400">Add your certifications, licenses, and awards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {credentials.map((credential) => (
              <div
                key={credential.id}
                className="p-4 rounded-lg bg-black/30 border border-purple-500/20 transition-all duration-300 hover:border-purple-500/40 hover:bg-black/40"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-purple-900/40 text-purple-400 mr-3">
                      {credential.type === "award" ? <Award className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{credential.title}</h3>
                      <p className="text-purple-300">{credential.issuer}</p>
                      <div className="flex items-center mt-1 text-sm text-purple-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(credential.date).toLocaleDateString()}
                        {credential.expiryDate && (
                          <span> - {new Date(credential.expiryDate).toLocaleDateString()}</span>
                        )}
                      </div>
                      {credential.description && (
                        <p className="mt-2 text-sm text-purple-300">{credential.description}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCredential(credential.id)}
                    className="text-purple-300 hover:text-red-400 hover:bg-red-900/10"
                    aria-label="Delete credential"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg border border-dashed border-purple-500/30 bg-black/20">
            <h3 className="text-lg font-medium text-white mb-4">Add New Credential</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="credential-type" className="text-purple-300">
                    Type
                  </Label>
                  <select
                    id="credential-type"
                    value={newCredential.type}
                    onChange={(e) => setNewCredential({ ...newCredential, type: e.target.value })}
                    className="w-full bg-black/40 border-purple-500/30 rounded-md p-2 text-white mt-1"
                  >
                    <option value="certification">Certification</option>
                    <option value="license">License</option>
                    <option value="award">Award</option>
                    <option value="education">Education</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="credential-title" className="text-purple-300">
                    Title
                  </Label>
                  <Input
                    id="credential-title"
                    value={newCredential.title}
                    onChange={(e) => setNewCredential({ ...newCredential, title: e.target.value })}
                    placeholder="e.g., Bloodborne Pathogens Certification"
                    className="bg-black/40 border-purple-500/30 focus:border-purple-400 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="credential-issuer" className="text-purple-300">
                    Issuer
                  </Label>
                  <Input
                    id="credential-issuer"
                    value={newCredential.issuer}
                    onChange={(e) => setNewCredential({ ...newCredential, issuer: e.target.value })}
                    placeholder="e.g., Red Cross"
                    className="bg-black/40 border-purple-500/30 focus:border-purple-400 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="credential-date" className="text-purple-300">
                    Date Issued
                  </Label>
                  <Input
                    id="credential-date"
                    type="date"
                    value={newCredential.date}
                    onChange={(e) => setNewCredential({ ...newCredential, date: e.target.value })}
                    className="bg-black/40 border-purple-500/30 focus:border-purple-400 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="credential-expiry" className="text-purple-300">
                    Expiry Date (if applicable)
                  </Label>
                  <Input
                    id="credential-expiry"
                    type="date"
                    value={newCredential.expiryDate}
                    onChange={(e) => setNewCredential({ ...newCredential, expiryDate: e.target.value })}
                    className="bg-black/40 border-purple-500/30 focus:border-purple-400 mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="credential-description" className="text-purple-300">
                  Description (optional)
                </Label>
                <Textarea
                  id="credential-description"
                  value={newCredential.description}
                  onChange={(e) => setNewCredential({ ...newCredential, description: e.target.value })}
                  placeholder="Add details about this credential"
                  className="bg-black/40 border-purple-500/30 focus:border-purple-400 mt-1"
                />
              </div>

              <Button
                onClick={handleAddCredential}
                className="w-full mt-2 bg-purple-700 hover:bg-purple-600 transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Credential
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
