"use client"

/**
 * This component provides a compatibility layer for components that use server actions
 * It ensures they can be used in both app/ and pages/ directories
 */

import React from "react"
// Import server actions from the implementation file if needed
// import { exampleServerAction } from "./server-actions-impl"

// Props for the compatibility wrapper
interface ServerActionsWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

// This component will render children in app/ directory and fallback in pages/
export function ServerActionsWrapper({ children, fallback }: ServerActionsWrapperProps) {
  // Check if we're in a client component
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // If we're on the client and in pages/ directory, render the fallback
  if (isClient && typeof window !== "undefined" && window.location.pathname.startsWith("/pages")) {
    return fallback ? <>{fallback}</> : null
  }

  // Otherwise, render the children (which might use server actions)
  return <>{children}</>
}

// Higher-order component version
export function withServerActionsCompatibility<P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType<P>,
) {
  return function CompatibleComponent(props: P) {
    return (
      <ServerActionsWrapper fallback={FallbackComponent ? <FallbackComponent {...props} /> : null}>
        <Component {...props} />
      </ServerActionsWrapper>
    )
  }
}
