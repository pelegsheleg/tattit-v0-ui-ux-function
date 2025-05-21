"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import {
  checkDatabaseConnection,
  listTables,
  getTableData,
  createTestArtist,
  getTableSchema,
} from "@/lib/debug/database-debug"

export default function DatabaseCheckPage() {
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [tables, setTables] = useState<string[]>([])
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [tableData, setTableData] = useState<any[]>([])
  const [tableSchema, setTableSchema] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [testArtistResult, setTestArtistResult] = useState<any>(null)
  const [testArtistLoading, setTestArtistLoading] = useState<boolean>(false)

  // Check database connection on load
  useEffect(() => {
    async function checkConnection() {
      setLoading(true)
      try {
        const result = await checkDatabaseConnection()
        setConnectionStatus(result)
        if (result.success) {
          const tablesList = await listTables()
          setTables(tablesList)
          if (tablesList.length > 0) {
            setSelectedTable(tablesList[0])
          }
        }
      } catch (error) {
        setConnectionStatus({
          success: false,
          message: error instanceof Error ? error.message : "Unknown error checking database connection",
        })
      } finally {
        setLoading(false)
      }
    }

    checkConnection()
  }, [])

  // Load table data when selected table changes
  useEffect(() => {
    async function loadTableData() {
      if (!selectedTable) return

      setLoading(true)
      try {
        const data = await getTableData(selectedTable)
        setTableData(data)

        const schema = await getTableSchema(selectedTable)
        setTableSchema(schema)
      } catch (error) {
        console.error("Error loading table data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTableData()
  }, [selectedTable])

  const handleCreateTestArtist = async () => {
    setTestArtistLoading(true)
    try {
      const result = await createTestArtist()
      setTestArtistResult(result)
    } catch (error) {
      setTestArtistResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error creating test artist",
      })
    } finally {
      setTestArtistLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Database Diagnostic Tool</h1>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Status</CardTitle>
          <CardDescription>Check if the application can connect to the database</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Checking connection...</span>
            </div>
          ) : connectionStatus ? (
            connectionStatus.success ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800">Connected</AlertTitle>
                <AlertDescription className="text-green-700">{connectionStatus.message}</AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Connection Failed</AlertTitle>
                <AlertDescription>{connectionStatus.message}</AlertDescription>
              </Alert>
            )
          ) : null}
        </CardContent>
      </Card>

      {/* Create Test Artist */}
      <Card>
        <CardHeader>
          <CardTitle>Create Test Artist</CardTitle>
          <CardDescription>Create a test artist directly in the database to verify functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleCreateTestArtist} disabled={testArtistLoading} className="w-full">
            {testArtistLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Test Artist...
              </>
            ) : (
              "Create Test Artist"
            )}
          </Button>

          {testArtistResult && (
            <div className="mt-4">
              <Alert className={testArtistResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                {testArtistResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <AlertTitle className={testArtistResult.success ? "text-green-800" : "text-red-800"}>
                  {testArtistResult.success ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription className={testArtistResult.success ? "text-green-700" : "text-red-700"}>
                  {testArtistResult.success
                    ? `Test artist created with ID: ${testArtistResult.userId}`
                    : testArtistResult.error}
                </AlertDescription>
              </Alert>

              {testArtistResult.success && testArtistResult.details && (
                <div className="mt-4 space-y-2">
                  <h3 className="font-medium">Creation Details:</h3>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[200px] text-sm">
                    {JSON.stringify(testArtistResult.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Database Tables */}
      {tables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Database Tables</CardTitle>
            <CardDescription>View and explore the database tables</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={selectedTable} onValueChange={setSelectedTable}>
              <TabsList className="grid grid-cols-4 mb-4">
                {tables.map((table) => (
                  <TabsTrigger key={table} value={table}>
                    {table}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={selectedTable} className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Table Schema</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Column
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nullable
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Default
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {tableSchema.map((column, i) => (
                              <tr key={i}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {column.column_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {column.data_type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {column.is_nullable}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {column.column_default || "NULL"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Table Data ({tableData.length} rows)</h3>
                      {tableData.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border">
                            <thead className="bg-gray-50">
                              <tr>
                                {Object.keys(tableData[0]).map((key) => (
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
                              {tableData.map((row, i) => (
                                <tr key={i}>
                                  {Object.values(row).map((value: any, j) => (
                                    <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No data in this table</p>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
