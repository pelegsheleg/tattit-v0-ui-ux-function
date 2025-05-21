"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { debugAuthAndProfiles, createTestArtistProfile, fixMissingArtistProfiles } from "@/lib/debug/auth-debug"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

export default function AuthDebugPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState("")
  const [createProfileResult, setCreateProfileResult] = useState<any>(null)
  const [fixProfilesResult, setFixProfilesResult] = useState<any>(null)

  async function checkAuth() {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const result = await debugAuthAndProfiles()
      if (result.success) {
        setResults(result.results)
      } else {
        setError(result.error || "Unknown error")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTestProfile() {
    if (!userId) {
      setCreateProfileResult({ success: false, error: "User ID is required" })
      return
    }

    setCreateProfileResult(null)
    setLoading(true)

    try {
      const result = await createTestArtistProfile(userId)
      setCreateProfileResult(result)
    } catch (err) {
      setCreateProfileResult({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleFixMissingProfiles() {
    setFixProfilesResult(null)
    setLoading(true)

    try {
      const result = await fixMissingArtistProfiles()
      setFixProfilesResult(result)
    } catch (err) {
      setFixProfilesResult({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Auth & Profiles Debug</h1>

      <Tabs defaultValue="check">
        <TabsList className="mb-6">
          <TabsTrigger value="check">Check Auth & Profiles</TabsTrigger>
          <TabsTrigger value="create">Create Test Profile</TabsTrigger>
          <TabsTrigger value="fix">Fix Missing Profiles</TabsTrigger>
        </TabsList>

        <TabsContent value="check">
          <Button onClick={checkAuth} disabled={loading} className="mb-6">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Check Auth & Profiles"
            )}
          </Button>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results && (
            <div className="grid gap-6">
              {Object.entries(results).map(([sectionName, sectionData]: [string, any]) => (
                <Card key={sectionName}>
                  <CardHeader>
                    <CardTitle className="capitalize">{sectionName.replace(/_/g, " ")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {sectionData.error ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{sectionData.error}</AlertDescription>
                      </Alert>
                    ) : sectionData.note ? (
                      <p className="text-gray-500">{sectionData.note}</p>
                    ) : sectionData.data ? (
                      typeof sectionData.data === "string" ? (
                        <p>{sectionData.data}</p>
                      ) : Array.isArray(sectionData.data) ? (
                        sectionData.data.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  {Object.keys(sectionData.data[0]).map((key) => (
                                    <th
                                      key={key}
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      {key}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {sectionData.data.map((row: any, i: number) => (
                                  <tr key={i}>
                                    {Object.entries(row).map(([key, value]: [string, any]) => (
                                      <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-gray-500">No records found</p>
                        )
                      ) : (
                        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                          {JSON.stringify(sectionData.data, null, 2)}
                        </pre>
                      )
                    ) : (
                      <p className="text-gray-500">No data available</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Test Artist Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user ID from auth.users"
                  />
                  <p className="text-sm text-gray-500">Enter the user ID of an artist that needs a profile</p>
                </div>

                <Button onClick={handleCreateTestProfile} disabled={loading || !userId}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Artist Profile"
                  )}
                </Button>

                {createProfileResult && (
                  <Alert variant={createProfileResult.success ? "default" : "destructive"}>
                    {createProfileResult.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>{createProfileResult.success ? "Success" : "Error"}</AlertTitle>
                    <AlertDescription>
                      {createProfileResult.success ? createProfileResult.message : createProfileResult.error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fix">
          <Card>
            <CardHeader>
              <CardTitle>Fix Missing Artist Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  This will find all users with the artist role that don't have a corresponding artist profile and
                  create default profiles for them.
                </p>

                <Button onClick={handleFixMissingProfiles} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fixing...
                    </>
                  ) : (
                    "Fix Missing Profiles"
                  )}
                </Button>

                {fixProfilesResult && (
                  <>
                    <Alert variant={fixProfilesResult.success ? "default" : "destructive"}>
                      {fixProfilesResult.success ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertTitle>{fixProfilesResult.success ? "Success" : "Error"}</AlertTitle>
                      <AlertDescription>
                        {fixProfilesResult.success ? fixProfilesResult.message : fixProfilesResult.error}
                      </AlertDescription>
                    </Alert>

                    {fixProfilesResult.results && fixProfilesResult.results.length > 0 && (
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {fixProfilesResult.results.map((result: any, i: number) => (
                              <tr key={i}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.user_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {result.success ? (
                                    <span className="text-green-500 flex items-center">
                                      <CheckCircle className="h-4 w-4 mr-1" /> Fixed
                                    </span>
                                  ) : (
                                    <span className="text-red-500 flex items-center">
                                      <AlertCircle className="h-4 w-4 mr-1" /> {result.error}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
