import type React from "react"
import { getUserDetails, getSession } from "@/lib/auth"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "./providers"
import "./globals.css"

export const metadata = {
  title: "Tattit - Connect with Tattoo Artists",
  description: "Find and book tattoo artists that match your style preferences",
    generator: 'v0.dev'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const user = session ? await getUserDetails() : null

  return (
    <html lang="en">
      <body>
        <Providers>
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
