"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { checkEmailExists } from "@/app/actions/artist-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EmailCheckDebug() {
  const [email, setEmail] = useState("")
  const [result, setResult] = useState<{ exists: boolean; error?: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    if (!email) return

    setLoading(true)
    try {
      const exists = await checkEmailExists(email)
      setResult({ exists })
    } catch (error) {
      setResult({ exists: false, error: error instanceof Error ? error.message : "Unknown error occurred" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Email Check Debug Tool</h1>

      <Card>
        <CardHeader>
          <CardTitle>Check if Email Exists</CardTitle>
          <CardDescription>Use this tool to check if an email is already registered in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email to check"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button onClick={handleCheck} disabled={loading || !email}>
              {loading ? "Checking..." : "Check Email"}
            </Button>

            {result && (
              <div className="mt-4">
                {result.error ? (
                  <Alert variant="destructive">
                    <AlertDescription>{result.error}</AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant={result.exists ? "destructive" : "default"}>
                    <AlertDescription>
                      {result.exists
                        ? "This email is already registered in the system."
                        : "This email is not registered and is available for use."}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">This tool directly checks the Supabase authentication system.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
