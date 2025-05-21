"use server"

import { uploadImage } from "@/lib/blob"
import { revalidatePath } from "next/cache"

export async function uploadImageAction(formData: FormData) {
  const file = formData.get("file") as File
  const folder = (formData.get("folder") as string) || "general"
  const path = (formData.get("path") as string) || "/"

  if (!file) {
    return { success: false, error: "No file provided" }
  }

  const result = await uploadImage(file, folder)

  if (path) {
    revalidatePath(path)
  }

  return result
}
