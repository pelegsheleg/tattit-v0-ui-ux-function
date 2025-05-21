import { put, del, list } from "@vercel/blob"
import { nanoid } from "nanoid"

// File types we accept
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export type UploadResult = {
  success: boolean
  url?: string
  error?: string
}

export async function uploadImage(file: File, folder = "general"): Promise<UploadResult> {
  try {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
      }
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "File too large. Maximum size is 5MB.",
      }
    }

    // Generate a unique filename
    const filename = `${folder}/${nanoid()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`

    // Upload to Vercel Blob
    const { url } = await put(filename, file, {
      access: "public",
    })

    return {
      success: true,
      url,
    }
  } catch (error) {
    console.error("Blob upload error:", error)
    return {
      success: false,
      error: "Failed to upload file. Please try again.",
    }
  }
}

export async function deleteImage(url: string): Promise<boolean> {
  try {
    await del(url)
    return true
  } catch (error) {
    console.error("Blob delete error:", error)
    return false
  }
}

export async function listImages(prefix: string): Promise<string[]> {
  try {
    const { blobs } = await list({ prefix })
    return blobs.map((blob) => blob.url)
  } catch (error) {
    console.error("Blob list error:", error)
    return []
  }
}
