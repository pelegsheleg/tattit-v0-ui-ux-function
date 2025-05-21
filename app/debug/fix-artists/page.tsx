"use client"

import { useState } from "react"
import { fixArtistProfiles } from "@/app/actions/fix-artist-profiles"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function FixArtistsPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleFix = async () => {
    setLoading(true)
    try {
      const result = await fixArtistProfiles()
      setResults(result)
    } catch (error) {
      setResults({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Fix Artist Profiles</CardTitle>
          <CardDescription>
            This tool will check all artist users and create missing profiles in the artist_profile_singular table.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleFix} disabled={loading}>
            {loading ? "Fixing..." : "Fix Missing Artist Profiles"}
          </Button>

          {results && (
            <div className="mt-6">
              <Alert variant={results.success ? "default" : "destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{results.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{results.message || results.error}</AlertDescription>
              </Alert>

              {results.results && results.results.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Results</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Message
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {results.results.map((result: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {result.success ? (
                                <span className="flex items-center text-green-500">
                                  <CheckCircle className="h-4 w-4 mr-1" /> Success
                                </span>
                              ) : (
                                <span className="flex items-center text-red-500">
                                  <XCircle className="h-4 w-4 mr-1" /> Error
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.message || result.error}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
