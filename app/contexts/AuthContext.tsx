"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  userRole: "artist" | "client" | null
  login: (role: "artist" | "client") => void
  logout: () => Promise<void>
  getUserDetails: () => { id: string; lastLogin: string | null; role: "artist" | "client" | null }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<"artist" | "client" | null>(null)

  useEffect(() => {
    // Check if user is authenticated (e.g., by checking local storage)
    const token = localStorage.getItem("auth_token")
    const role = localStorage.getItem("user_role") as "artist" | "client" | null
    setIsAuthenticated(!!token)
    setUserRole(role)
  }, [])

  const login = (role: "artist" | "client") => {
    // Perform login logic here
    localStorage.setItem("auth_token", "dummy_token")
    localStorage.setItem("user_role", role)
    localStorage.setItem("last_login", new Date().toISOString())
    setIsAuthenticated(true)
    setUserRole(role)

    // Log authentication details for debugging
    console.log(`Authenticated as ${role}`)
  }

  // Update the logout method to be async and properly clear all auth data
  const logout = async () => {
    // Perform logout logic here
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_role")
    localStorage.removeItem("last_login")
    setIsAuthenticated(false)
    setUserRole(null)

    // Add a small delay to ensure state updates are processed
    await new Promise((resolve) => setTimeout(resolve, 100))
    return Promise.resolve() // Maintain async operation
  }

  const getUserDetails = () => {
    return {
      id: "user-123", // Simulated user ID
      lastLogin: localStorage.getItem("last_login") || null,
      role: userRole,
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        login,
        logout,
        getUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
