import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // If this is a Pages Router API request that has a corresponding App Router route,
  // redirect to the App Router version
  if (pathname.startsWith("/api/")) {
    // No need to modify the request - the catch-all handler in pages/api/[[...path]].ts
    // will handle the redirection
    return NextResponse.next()
  }

  // For all other requests, continue normally
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session and trying to access protected routes
    if (
      !session &&
      (pathname.startsWith("/matches") || pathname.startsWith("/artist/") || pathname.startsWith("/client/"))
    ) {
      // Redirect to login
      console.log("No session, redirecting to auth page")
      return NextResponse.redirect(new URL("/auth", req.url))
    }

    // If session exists but trying to access a role-specific route
    if (session) {
      // Get the user's role
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_role")
        .eq("id", session.user.id)
        .single()

      if (userError) {
        console.error("Error fetching user role:", userError)
        // Continue without role check
        return res
      }

      const userRole = userData?.user_role

      // Check if user is trying to access artist routes but is not an artist
      if (pathname.startsWith("/artist/") && userRole !== "artist") {
        console.log("Client trying to access artist routes, redirecting")
        return NextResponse.redirect(new URL("/matches", req.url))
      }

      // Check if user is trying to access client routes but is not a client
      if (pathname.startsWith("/client/") && userRole !== "client") {
        console.log("Artist trying to access client routes, redirecting")
        return NextResponse.redirect(new URL("/artist/dashboard", req.url))
      }
    }

    return res
  } catch (error) {
    console.error("Middleware auth error:", error)

    // If there's a JWT validation error, clear the session cookie and redirect to auth
    if (error.message && error.message.includes("InvalidJWTToken")) {
      // Clear the session cookie
      res.cookies.delete("supabase-auth-token")

      // Redirect to auth page
      return NextResponse.redirect(new URL("/auth", req.url))
    }

    return res
  }
}

export const config = {
  matcher: ["/api/:path*", "/((?!api|_next/static|_next/image|favicon.ico|auth).*)"],
}
