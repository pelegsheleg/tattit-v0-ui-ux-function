import { redirect } from "next/navigation"
import { getUserDetails, getSession } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const user = await getUserDetails()

  if (!user) {
    redirect("/login")
  }

  // Redirect based on user role
  if (user.user_role === "artist") {
    redirect("/artist/dashboard")
  } else if (user.user_role === "client") {
    redirect("/client/dashboard")
  }

  // Fallback if role is not recognized
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  )
}
