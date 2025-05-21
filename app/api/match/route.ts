import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { setCache } from "@/lib/redis"

export async function POST(request: Request) {
  try {
    const { clientId, referenceImageUrl, preferences } = await request.json()

    if (!clientId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, you would use ML to match artists based on the reference image
    // For now, we'll simulate the matching with a database query

    const supabase = getSupabaseServerClient()

    // Get all artists
    const { data: artists, error } = await supabase
      .from("artist_profiles")
      .select(`
        *,
        users!inner(full_name, email),
        artist_style_tags(tag_name),
        artist_portfolio(image_url, is_primary)
      `)
      .limit(10)

    if (error) {
      return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 })
    }

    // Simulate matching algorithm
    const matchedArtists = artists.map((artist) => {
      // Simple scoring algorithm - would be replaced with ML-based scoring
      let score = 75 + Math.random() * 20 // Base score between 75-95

      // Adjust score based on preferences if available
      if (preferences) {
        // Budget match
        if (preferences.budget_max && artist.hourly_rate) {
          if (artist.hourly_rate <= preferences.budget_max) {
            score += 5
          } else {
            score -= 10
          }
        }

        // Style match
        if (preferences.preferred_styles && artist.artist_style_tags) {
          const artistTags = artist.artist_style_tags.map((tag) => tag.tag_name)
          const matchingStyles = preferences.preferred_styles.filter((style) => artistTags.includes(style))

          if (matchingStyles.length > 0) {
            // Boost score based on percentage of matching styles
            const matchPercentage = matchingStyles.length / preferences.preferred_styles.length
            score += matchPercentage * 5 // Up to 5 point boost
          }
        }
      }

      return {
        ...artist,
        match_score: Math.min(99, Math.round(score)), // Cap at 99%
      }
    })

    // Sort by match score
    matchedArtists.sort((a, b) => b.match_score - a.match_score)

    // Cache the results
    await setCache(`client:${clientId}:matches`, matchedArtists, 3600) // Cache for 1 hour

    return NextResponse.json({ success: true, matches: matchedArtists })
  } catch (error) {
    console.error("Artist matching error:", error)
    return NextResponse.json({ error: "Failed to match artists" }, { status: 500 })
  }
}
