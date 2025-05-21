import { put } from "@vercel/blob"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Uploads an image to Vercel Blob storage
 * @param file The file to upload
 * @param folder The folder path within blob storage (e.g., 'portfolio')
 * @returns Object containing the URL of the uploaded image and success status
 */
export async function uploadImage(file: File, folder = "uploads") {
  try {
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Generate a unique filename with original extension
    const fileExtension = file.name.split(".").pop() || "jpg"
    const uniqueFilename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`

    // Upload to Vercel Blob
    const { url } = await put(uniqueFilename, file, {
      access: "public",
      addRandomSuffix: false, // We're already adding our own unique suffix
    })

    return { success: true, url }
  } catch (error) {
    console.error("Error uploading image to Blob:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    }
  }
}

/**
 * Formats a date to a readable string
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Truncates text to a specified length
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}
