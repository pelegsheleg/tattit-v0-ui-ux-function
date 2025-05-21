"use client"

/**
 * Compatibility layer for Next.js router
 * This ensures navigation works in both app/ and pages/ directories
 */

import { useRouter as useNextRouter } from "next/navigation"
import { useRouter as usePagesRouter } from "next/router"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

// Compatibility hook for router
export function useCompatibilityRouter() {
  const pathname = usePathname() || "/"
  const searchParams = useSearchParams()
  const [appRouter, setAppRouter] = useState<any>(null)
  const [pagesRouter, setPagesRouter] = useState<any>(null)

  useEffect(() => {
    try {
      setAppRouter(useNextRouter())
    } catch (e) {
      setAppRouter(null)
    }
  }, [])

  useEffect(() => {
    try {
      setPagesRouter(usePagesRouter())
    } catch (e) {
      setPagesRouter(null)
    }
  }, [])

  if (appRouter) {
    return {
      ...appRouter,
      // Add any missing methods from the pages router
      asPath: typeof window !== "undefined" ? window.location.pathname : "/",
      pathname: pathname,
      query: searchParams ? Object.fromEntries(searchParams.entries()) : {},
      push: (path: string) => {
        if (typeof window !== "undefined") {
          window.location.href = path
          return Promise.resolve(true)
        }
        appRouter.push(path)
        return Promise.resolve(true)
      },
      replace: (path: string) => {
        if (typeof window !== "undefined") {
          window.location.replace(path)
          return Promise.resolve(true)
        }
        appRouter.replace(path)
        return Promise.resolve(true)
      },
    }
  } else {
    try {
      if (pagesRouter) {
        return pagesRouter
      } else {
        return {
          push: (path: string) => {
            if (typeof window !== "undefined") {
              window.location.href = path
            }
            return Promise.resolve(true)
          },
          replace: (path: string) => {
            if (typeof window !== "undefined") {
              window.location.replace(path)
            }
            return Promise.resolve(true)
          },
          back: () => {
            if (typeof window !== "undefined") {
              window.history.back()
            }
          },
          pathname: typeof window !== "undefined" ? window.location.pathname : "/",
          asPath: typeof window !== "undefined" ? window.location.pathname : "/",
          query: typeof window !== "undefined" ? Object.fromEntries(new URLSearchParams(window.location.search)) : {},
        }
      }
    } catch (innerError) {
      // If both fail, return a minimal compatible interface
      return {
        push: (path: string) => {
          if (typeof window !== "undefined") {
            window.location.href = path
          }
          return Promise.resolve(true)
        },
        replace: (path: string) => {
          if (typeof window !== "undefined") {
            window.location.replace(path)
          }
          return Promise.resolve(true)
        },
        back: () => {
          if (typeof window !== "undefined") {
            window.history.back()
          }
        },
        pathname: typeof window !== "undefined" ? window.location.pathname : "/",
        asPath: typeof window !== "undefined" ? window.location.pathname : "/",
        query: typeof window !== "undefined" ? Object.fromEntries(new URLSearchParams(window.location.search)) : {},
      }
    }
  }
}
