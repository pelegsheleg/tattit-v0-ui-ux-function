/**
 * Compatibility layer for cookies
 * This file provides functions that work in both app/ and pages/ directories
 */

import { cookies as nextCookies } from "next/headers"

// Client-side cookie getter
function getCookieClient(name: string): string | undefined {
  if (typeof document === "undefined") return undefined

  const cookies = document.cookie.split(";")
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1)
    }
  }
  return undefined
}

// Client-side cookie setter
function setCookieClient(name: string, value: string, options: any = {}): void {
  if (typeof document === "undefined") return

  let cookieString = `${name}=${value}`

  if (options.expires) {
    if (options.expires instanceof Date) {
      cookieString += `; expires=${options.expires.toUTCString()}`
    } else {
      cookieString += `; expires=${options.expires}`
    }
  }

  if (options.path) cookieString += `; path=${options.path}`
  if (options.domain) cookieString += `; domain=${options.domain}`
  if (options.secure) cookieString += "; secure"
  if (options.httpOnly) cookieString += "; httpOnly"
  if (options.sameSite) cookieString += `; sameSite=${options.sameSite}`

  document.cookie = cookieString
}

// Compatibility function for getting cookies
export function getCompatibilityCookie(name: string): string | undefined {
  try {
    // Try server-side first
    const cookiesObj = nextCookies()
    return cookiesObj.get(name)?.value
  } catch (error) {
    // If that fails, try client-side
    return getCookieClient(name)
  }
}

// Compatibility function for setting cookies
export function setCompatibilityCookie(name: string, value: string, options: any = {}): void {
  try {
    // Try server-side first
    const cookiesObj = nextCookies()
    cookiesObj.set(name, value, options)
  } catch (error) {
    // If that fails, try client-side
    setCookieClient(name, value, options)
  }
}

// Compatibility function for deleting cookies
export function deleteCompatibilityCookie(name: string, options: any = {}): void {
  try {
    // Try server-side first
    const cookiesObj = nextCookies()
    cookiesObj.delete(name)
  } catch (error) {
    // If that fails, try client-side
    setCookieClient(name, "", { ...options, expires: new Date(0) })
  }
}

// Export a compatibility object that mimics the next/headers cookies() function
export function compatibilityCookies() {
  return {
    get: getCompatibilityCookie,
    set: setCompatibilityCookie,
    delete: deleteCompatibilityCookie,
  }
}
