import { Redis } from "@upstash/redis"

// Create a Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
})

export default redis

// Cache helper functions
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    return await redis.get(key)
  } catch (error) {
    console.error("Redis get error:", error)
    return null
  }
}

export async function setCache<T>(key: string, value: T, expireInSeconds?: number): Promise<void> {
  try {
    if (expireInSeconds) {
      await redis.set(key, value, { ex: expireInSeconds })
    } else {
      await redis.set(key, value)
    }
  } catch (error) {
    console.error("Redis set error:", error)
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error("Redis delete error:", error)
  }
}
