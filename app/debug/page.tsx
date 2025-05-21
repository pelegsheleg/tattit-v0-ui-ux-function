import Link from "next/link"

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Debug Tools</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/debug/database-check" className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold">Database Check</h2>
          <p className="text-sm text-gray-600">Check database connection and tables</p>
        </Link>

        <Link href="/debug/auth" className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold">Auth Debug</h2>
          <p className="text-sm text-gray-600">Debug authentication issues</p>
        </Link>

        <Link href="/debug/schema" className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold">Database Schema</h2>
          <p className="text-sm text-gray-600">View database schema</p>
        </Link>

        <Link href="/debug/fix-artists" className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold">Fix Artist Profiles</h2>
          <p className="text-sm text-gray-600">Fix missing artist profiles</p>
        </Link>

        <Link href="/debug/artist-registration" className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold">Artist Registration Debug</h2>
          <p className="text-sm text-gray-600">Test artist registration process</p>
        </Link>

        <Link href="/debug/email-check" className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold">Email Check</h2>
          <p className="text-sm text-gray-600">Check if an email is already registered</p>
        </Link>
      </div>
    </div>
  )
}
