import type React from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function DebugLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-wrap gap-4 mb-6">
        <Link href="/debug/database" className="text-blue-600 hover:underline">
          Database Debug
        </Link>
        <Link href="/debug/auth" className="text-blue-600 hover:underline">
          Auth Debug
        </Link>
        <Link href="/debug/schema" className="text-blue-600 hover:underline">
          Schema Check
        </Link>
      </div>

      <Card className="p-6">{children}</Card>
    </div>
  )
}
