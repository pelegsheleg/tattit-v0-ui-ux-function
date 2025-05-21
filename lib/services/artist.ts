// Mock service functions for artist data

export async function getArtistProfile(userId: string) {
  // In a real app, this would fetch from an API or database
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      data: {
        id: userId,
        users: {
          full_name: "NeoInk",
          profile_image_url: "/placeholder.svg?text=NI",
        },
        bio: "Specializing in cyberpunk and futuristic designs with a focus on geometric patterns and vibrant colors.",
        personal_brand_statement: "Creating digital dreams on skin",
        studio_name: "Digital Dermis",
        location: "Neo Tokyo",
        hourly_rate: 150,
        years_experience: 5,
        specialties: ["Cyberpunk", "Geometric", "Neon"],
        style_tags: ["Futuristic", "Digital", "Vibrant"],
        certifications: "Certified Professional Tattoo Artist",
        do_list: ["Custom designs", "Cover-ups", "Full sleeves"],
        dont_list: ["Hateful imagery", "Face tattoos", "Hands for first-timers"],
      },
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: "Failed to fetch artist profile",
    }
  }
}

export async function getArtistPortfolio(userId: string) {
  // In a real app, this would fetch from an API or database
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600))

    return {
      data: [
        { id: "p1", url: "/placeholder.svg?text=Tattoo1", title: "Cyberpunk Arm" },
        { id: "p2", url: "/placeholder.svg?text=Tattoo2", title: "Neon Samurai" },
        { id: "p3", url: "/placeholder.svg?text=Tattoo3", title: "Digital Wave" },
        { id: "p4", url: "/placeholder.svg?text=Tattoo4", title: "Circuit Phoenix" },
      ],
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: "Failed to fetch portfolio images",
    }
  }
}
