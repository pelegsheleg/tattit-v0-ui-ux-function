"use client"

/**
 * This component provides a compatibility layer for components that use next/headers
 * It ensures they can be used in both app/ and pages/ directories
 */

import React from "react"

// Props for the compatibility wrapper
interface HeadersWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

// This component will render children in app/ directory and fallback in pages/
export function HeadersWrapper({ children, fallback }: HeadersWrapperProps) {
  // Check if we're in a client component
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // If we're on the client and in pages/ directory, render the fallback
  if (isClient && typeof window !== "undefined" && window.location.pathname.startsWith("/pages")) {
    return fallback ? <>{fallback}</> : null
  }

  // Otherwise, render the children (which might use next/headers)
  return <>{children}</>
}

// Higher-order component version
export function withHeadersCompatibility<P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType<P>,
) {
  return function CompatibleComponent(props: P) {
    return (
      <HeadersWrapper fallback={FallbackComponent ? <FallbackComponent {...props} /> : null}>
        <Component {...props} />
      </HeadersWrapper>
    )
  }
}
