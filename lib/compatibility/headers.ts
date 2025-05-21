/**
 * Compatibility layer for headers
 * This file provides functions that work in both app/ and pages/ directories
 */

import { headers as nextHeaders } from "next/headers"

// Client-side headers getter
function getHeadersClient(): Headers {
  // This is a simplified version that just returns empty headers
  // In a real implementation, you might want to fetch this from an API
  return new Headers()
}

// Compatibility function for getting headers
export function getCompatibilityHeader(name: string): string | null {
  try {
    // Try server-side first
    const headersObj = nextHeaders()
    return headersObj.get(name)
  } catch (error) {
    // If that fails, try client-side
    const headersObj = getHeadersClient()
    return headersObj.get(name)
  }
}

// Export a compatibility function that mimics the next/headers headers() function
export function compatibilityHeaders() {
  try {
    // Try server-side first
    return nextHeaders()
  } catch (error) {
    // If that fails, return client-side headers
    return getHeadersClient()
  }
}
