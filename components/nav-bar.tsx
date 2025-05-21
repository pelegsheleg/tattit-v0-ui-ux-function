"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "@/app/actions/auth-actions"
import { LogOut, Menu, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Modify the NavBar component to check the current path
export function NavBar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Don't render the navbar on auth pages
  if (pathname?.startsWith("/auth")) {
    return null
  }

  const isArtist = user?.user_role === "artist"
  const isClient = user?.user_role === "client"

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true)
      const result = await signOut()

      if (result.success) {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account",
          duration: 3000,
        })
        router.push("/auth")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to log out",
          variant: "destructive",
          duration: 5000,
        })
        setIsLoggingOut(false)
      }
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred during logout",
        variant: "destructive",
        duration: 5000,
      })
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="flex justify-between h-16">
        <div className="flex">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-purple-600">
              Tattit
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link
              href="/"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === "/"
                  ? "border-purple-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Home
            </Link>
            <Link
              href="/artists"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === "/artists"
                  ? "border-purple-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Artists
            </Link>
            {user && (
              <>
                <Link
                  href="/messages"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === "/messages"
                      ? "border-purple-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Messages
                </Link>

                {isArtist && (
                  <Link
                    href="/artist/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === "/artist/dashboard"
                        ? "border-purple-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}

                {isClient && (
                  <Link
                    href="/client/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === "/client/dashboard"
                        ? "border-purple-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
        <div className="hidden sm:ml-6 sm:flex sm:items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profile_image_url || "/placeholder.svg"} alt={user.full_name || "User"} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="font-normal text-sm text-gray-500">Signed in as</DropdownMenuLabel>
                <DropdownMenuLabel className="font-normal text-sm">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500 cursor-pointer"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                      Logging out...
                    </div>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Sign in
            </Link>
          )}
        </div>
        <div className="-mr-2 flex items-center sm:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
          >
            <span className="sr-only">{isOpen ? "Close main menu" : "Open main menu"}</span>
            {isOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === "/"
                  ? "border-indigo-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              href="/artists"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === "/artists"
                  ? "border-indigo-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Artists
            </Link>
            {user && (
              <>
                <Link
                  href="/messages"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    pathname === "/messages"
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Messages
                </Link>

                {isArtist && (
                  <Link
                    href="/artist/dashboard"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname === "/artist/dashboard"
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}

                {isClient && (
                  <Link
                    href="/client/dashboard"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname === "/client/dashboard"
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
                      {user.profile_image_url ? (
                        <img
                          src={user.profile_image_url || "/placeholder.svg"}
                          alt={user.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.full_name || "User"}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="w-full text-left block px-4 py-2 text-base font-medium text-red-500 hover:text-red-700 hover:bg-gray-100"
                  >
                    {isLoggingOut ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                        Logging out...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Link
                  href="/auth"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
