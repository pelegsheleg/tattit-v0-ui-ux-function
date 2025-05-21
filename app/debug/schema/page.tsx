"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { checkDatabaseSchema, checkMissingProfiles, fixMissingProfiles } from "@/lib/debug/database-schema"
import { Loader2, AlertCircle, CheckCircle, Database, Table, UserCheck } from "lucide-react"

export default function SchemaCheckPage() {
  const [loading, setLoading] = useState(false)
  const [schemaResults, setSchemaResults] = useState<any>(null)
  const [missingProfilesResults, setMissingProfilesResults] = useState<any>(null)
  const [fixResults, setFixResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckSchema() {
    setLoading(true)
    setError(null)
    setSchemaResults(null)

    try {
      const result = await checkDatabaseSchema()
      setSchemaResults(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  async function handleCheckMissingProfiles() {
    setLoading(true)
    setError(null)
    setMissingProfilesResults(null)

    try {
      const result = await checkMissingProfiles()
      setMissingProfilesResults(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  async function handleFixMissingProfiles() {
    setLoading(true)
    setError(null)
    setFixResults(null)

    try {
      const result = await fixMissingProfiles()
      setFixResults(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Database Schema Check</h1>

      <Tabs defaultValue="schema">
        <TabsList className="mb-6">
          <TabsTrigger value="schema">Check Schema</TabsTrigger>
          <TabsTrigger value="missing">Check Missing Profiles</TabsTrigger>
          <TabsTrigger value="fix">Fix Missing Profiles</TabsTrigger>
        </TabsList>

        <TabsContent value="schema">
          <Button onClick={handleCheckSchema} disabled={loading} className="mb-6">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking Schema...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Check Database Schema
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {schemaResults && (
            <div className="space-y-6">
              {schemaResults.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{schemaResults.error}</AlertDescription>
                </Alert>
              )}

              {schemaResults.mismatches && schemaResults.mismatches.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Schema Mismatches</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2">
                      {schemaResults.mismatches.map((mismatch: string, i: number) => (
                        <li key={i}>{mismatch}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {schemaResults.mismatches && schemaResults.mismatches.length === 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Schema Check Passed</AlertTitle>
                  <AlertDescription>All expected tables and columns are present in the database.</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {schemaResults.tables &&
                  Object.entries(schemaResults.tables).map(([tableName, tableInfo]: [string, any]) => (
                    <Card key={tableName}>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center">
                          <Table className="h-5 w-5 mr-2" />
                          <span className="capitalize">{tableName.replace(/_/g, " ")}</span>
                          {tableInfo.exists ? (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Exists
                            </span>
                          ) : (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Missing</span>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {tableInfo.error ? (
                          <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{tableInfo.error}</AlertDescription>
                          </Alert>
                        ) : tableInfo.exists ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Column
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nullable
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {tableInfo.columns &&
                                  tableInfo.columns.map((column: any, i: number) => (
                                    <tr key={i}>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {column.column_name}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {column.data_type}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {column.is_nullable === "YES" ? "Yes" : "No"}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">This table does not exist in the database.</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="missing">
          <Button onClick={handleCheckMissingProfiles} disabled={loading} className="mb-6">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking Missing Profiles...
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Check Missing Artist Profiles
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {missingProfilesResults && (
            <div className="space-y-6">
              {missingProfilesResults.error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{missingProfilesResults.error}</AlertDescription>
                </Alert>
              ) : (
                <Alert variant={missingProfilesResults.missingProfiles?.length > 0 ? "destructive" : "default"}>
                  {missingProfilesResults.missingProfiles?.length > 0 ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {missingProfilesResults.missingProfiles?.length > 0
                      ? "Missing Artist Profiles"
                      : "All Artists Have Profiles"}
                  </AlertTitle>
                  <AlertDescription>
                    {missingProfilesResults.message}
                    {missingProfilesResults.artistProfileTable && (
                      <p className="mt-2">
                        Using table: <code>{missingProfilesResults.artistProfileTable}</code>
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {missingProfilesResults.missingProfiles && missingProfilesResults.missingProfiles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Artists Missing Profiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {missingProfilesResults.missingProfiles.map((profile: any, i: number) => (
                            <tr key={i}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="fix">
          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Fix Missing Profiles</AlertTitle>
              <AlertDescription>
                This will create artist profiles for all artists that don't have one. Make sure to check for missing
                profiles first.
              </AlertDescription>
            </Alert>

            <Button onClick={handleFixMissingProfiles} disabled={loading} className="mb-6">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fixing Missing Profiles...
                </>
              ) : (
                "Fix Missing Artist Profiles"
              )}
            </Button>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {fixResults && (
              <div className="space-y-6">
                {fixResults.error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{fixResults.error}</AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Fix Results</AlertTitle>
                    <AlertDescription>
                      {fixResults.message}
                      {fixResults.artistProfileTable && (
                        <p className="mt-2">
                          Using table: <code>{fixResults.artistProfileTable}</code>
                        </p>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {fixResults.results && fixResults.results.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Fix Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
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
                            {fixResults.results.map((result: any, i: number) => (
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
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
