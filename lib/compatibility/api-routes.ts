/**
 * This file provides compatibility functions for working with API routes
 * in both the Pages Router and App Router.
 */

/**
 * Constructs the correct API URL based on the current environment
 * @param path The API path (without /api prefix)
 * @returns The full API URL
 */
export function getApiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.substring(1) : path

  // In browser environment
  if (typeof window !== "undefined") {
    const baseUrl = window.location.origin
    return `${baseUrl}/api/${cleanPath}`
  }

  // In server environment
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  return `${baseUrl}/api/${cleanPath}`
}

/**
 * Fetches data from an API route with proper error handling
 * @param path The API path (without /api prefix)
 * @param options Fetch options
 * @returns The response data
 */
export async function fetchFromApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = getApiUrl(path)

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return (await response.json()) as T
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error)
    throw error
  }
}
