import type React from "react"
import type { Metadata } from "next"
import { Inter, Orbitron } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./contexts/AuthContext"
import RootLayoutContent from "./RootLayoutContent"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" })

export const metadata: Metadata = {
  title: "Tattit - Your AI-Powered Tattoo Journey",
  description: "Find your perfect tattoo artist and design with AI assistance",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${orbitron.variable} font-sans`}>
        <AuthProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
        </AuthProvider>
      </body>
    </html>
  )
}
