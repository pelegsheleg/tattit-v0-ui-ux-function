"use server"

// This server action securely provides the Google Maps API key
export async function getGoogleMapsConfig() {
  return {
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
  }
}
