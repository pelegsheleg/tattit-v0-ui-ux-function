"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { debugDatabaseTables } from "@/lib/debug/database-utils"

export default function DatabaseDebugPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function checkDatabase() {
    setLoading(true)
    setError(null)

    try {
      const result = await debugDatabaseTables()
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Database Debug</h1>

      <Button onClick={checkDatabase} disabled={loading} className="mb-6">
        {loading ? "Checking..." : "Check Database Tables"}
      </Button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {results && (
        <div className="grid gap-6">
          {Object.entries(results).map(([tableName, tableData]: [string, any]) => (
            <Card key={tableName}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{tableName}</span>
                  <span className="text-sm font-normal">
                    {tableData.error ? (
                      <span className="text-red-500">Error: {tableData.error}</span>
                    ) : (
                      <span className="text-green-500">{tableData.data?.length || 0} records</span>
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tableData.error ? (
                  <p className="text-red-500">{tableData.error}</p>
                ) : tableData.data && tableData.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(tableData.data[0]).map((key) => (
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
                        {tableData.data.map((row: any, i: number) => (
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
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
