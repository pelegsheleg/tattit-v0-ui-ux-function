"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, MessageSquare, Calendar, Star, Share2, Bookmark, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

export default function ArtistProfile() {
  const [activeTab, setActiveTab] = useState("portfolio")
  const [isFollowing, setIsFollowing] = useState(false)

  // Mock data for the artist profile
  const artistData = {
    name: "Ink Alchemist",
    username: "@ink_alchemist",
    avatar: "/placeholder.svg?text=IA&width=200&height=200",
    bio: "Specializing in blackwork, fine line, and geometric tattoos. Based in Brooklyn, NY with 8+ years of experience.",
    followers: 2453,
    following: 187,
    rating: 4.9,
    reviews: 128,
    location: "Brooklyn, NY",
    studio: "Ethereal Ink Studio",
    experience: "8+ years",
    specialties: ["Blackwork", "Fine Line", "Geometric", "Traditional", "Japanese"],
    availability: "Booking 2 months in advance",
    hourlyRate: "$150-200",
    minimumRate: "$100",
    consultationFee: "$50 (applied to tattoo)",
  }

  // Mock data for portfolio
  const portfolioItems = [
    {
      id: "p1",
      url: "/images/tattoo-mythological.png",
      title: "Mythological Patchwork",
      likes: 324,
      views: 1243,
      category: "blackwork",
    },
    {
      id: "p2",
      url: "/images/tattoo-illuminati-hand.png",
      title: "All-Seeing Eye",
      likes: 198,
      views: 812,
      category: "blackwork",
    },
    {
      id: "p3",
      url: "/images/tattoo-symbolic-patchwork.png",
      title: "Symbolic Collection",
      likes: 256,
      views: 978,
      category: "traditional",
    },
    {
      id: "p4",
      url: "/images/tattoo-mandala-sleeves.png",
      title: "Mandala Sleeves",
      likes: 187,
      views: 721,
      category: "geometric",
    },
    {
      id: "p5",
      url: "/images/tattoo-fineline-bird.jpeg",
      title: "Delicate Bird",
      likes: 142,
      views: 589,
      category: "fineline",
    },
    {
      id: "p6",
      url: "/images/tattoo-graphic-style.jpeg",
      title: "Urban Graphic",
      likes: 176,
      views: 698,
      category: "graphic",
    },
    {
      id: "p7",
      url: "/images/tattoo-cyberpunk.png",
      title: "Cyberpunk Arm",
      likes: 124,
      views: 543,
      category: "digital",
    },
    {
      id: "p8",
      url: "/images/tattoo-japanese.png",
      title: "Koi Warrior",
      likes: 98,
      views: 412,
      category: "japanese",
    },
  ]

  // Mock data for reviews
  const reviews = [
    {
      id: "r1",
      author: "Alex Chen",
      avatar: "/placeholder.svg?text=AC",
      rating: 5,
      date: "2 weeks ago",
      content:
        "Absolutely amazing work! The detail in my sleeve is incredible, and the whole process was so professional. Highly recommend!",
      tattoo: "/images/tattoo-cyberpunk.png",
    },
    {
      id: "r2",
      author: "Jordan Smith",
      avatar: "/placeholder.svg?text=JS",
      rating: 5,
      date: "1 month ago",
      content:
        "Incredible attention to detail. The geometric design came out perfect, and the healing process was smooth. Will definitely be back for more!",
      tattoo: "/images/tattoo-mandala-sleeves.png",
    },
    {
      id: "r3",
      author: "Taylor Kim",
      avatar: "/placeholder.svg?text=TK",
      rating: 4,
      date: "2 months ago",
      content:
        "Great experience overall. The design process was collaborative, and I'm very happy with my tattoo. The only reason for 4 stars is that the session ran a bit longer than expected.",
      tattoo: "/images/tattoo-fineline-bird.jpeg",
    },
  ]

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast({
      title: isFollowing ? "Unfollowed artist" : "Following artist",
      description: isFollowing
        ? "You will no longer see updates from this artist"
        : "You will now see updates from this artist",
    })
  }

  const handleBooking = () => {
    toast({
      title: "Booking request sent",
      description: "The artist will respond to your booking request soon",
    })
  }

  const handleShare = () => {
    toast({
      title: "Profile shared",
      description: "The artist's profile has been shared",
    })
  }

  const handleSave = () => {
    toast({
      title: "Artist saved",
      description: "This artist has been saved to your favorites",
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-950 to-purple-950 text-white">
      <header className="border-b border-purple-900 bg-black/50 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center">
          <Button variant="ghost" size="icon" className="mr-2" asChild>
            <Link href="/artist/dashboard">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Artist Profile</h1>
            <p className="text-sm text-purple-300">Public view of your profile</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="mx-auto max-w-4xl">
          {/* Artist Header */}
          <div className="bg-black/40 border border-purple-500/30 rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="h-24 w-24 md:h-32 md:w-32">
                  <AvatarImage src={artistData.avatar || "/placeholder.svg"} alt={artistData.name} />
                  <AvatarFallback className="bg-purple-800 text-white text-2xl">
                    {artistData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{artistData.name}</h2>
                    <p className="text-purple-300">{artistData.username}</p>
                  </div>

                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      className={
                        isFollowing
                          ? "bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                          : "bg-purple-700 hover:bg-purple-600"
                      }
                      onClick={handleFollow}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button variant="default" className="bg-purple-700 hover:bg-purple-600" onClick={handleBooking}>
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                      onClick={handleSave}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-white mb-4">{artistData.bio}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{artistData.followers.toLocaleString()}</p>
                    <p className="text-sm text-purple-300">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{artistData.following.toLocaleString()}</p>
                    <p className="text-sm text-purple-300">Following</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-1 fill-yellow-500" />
                      <p className="text-xl font-bold text-white">{artistData.rating}</p>
                    </div>
                    <p className="text-sm text-purple-300">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{artistData.reviews}</p>
                    <p className="text-sm text-purple-300">Reviews</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {artistData.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="bg-purple-950/30 border-purple-500/30">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="portfolio" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-black/40 border border-purple-500/30 p-1 mb-6">
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-purple-700">
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="info" className="data-[state=active]:bg-purple-700">
                Info
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-purple-700">
                Reviews
              </TabsTrigger>
            </TabsList>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {portfolioItems.map((item) => (
                  <div key={item.id} className="group relative aspect-square rounded-md overflow-hidden">
                    <Image
                      src={item.url || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center text-xs text-white/80">
                            <Heart className="h-3 w-3 mr-1" /> {item.likes}
                          </span>
                          <span className="flex items-center text-xs text-white/80">
                            <Eye className="h-3 w-3 mr-1" /> {item.views}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className="absolute top-2 left-2 bg-purple-600/80 capitalize">{item.category}</Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Info Tab */}
            <TabsContent value="info" className="mt-0">
              <Card className="bg-black/40 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Location & Studio</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-purple-300">Location</p>
                          <p className="text-white">{artistData.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-purple-300">Studio</p>
                          <p className="text-white">{artistData.studio}</p>
                        </div>
                        <div>
                          <p className="text-sm text-purple-300">Experience</p>
                          <p className="text-white">{artistData.experience}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Booking Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-purple-300">Availability</p>
                          <p className="text-white">{artistData.availability}</p>
                        </div>
                        <div>
                          <p className="text-sm text-purple-300">Hourly Rate</p>
                          <p className="text-white">{artistData.hourlyRate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-purple-300">Minimum</p>
                          <p className="text-white">{artistData.minimumRate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-purple-300">Consultation</p>
                          <p className="text-white">{artistData.consultationFee}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Booking Process</h3>
                    <ol className="space-y-3 list-decimal list-inside">
                      <li className="text-white">
                        <span className="text-purple-300">Initial Contact:</span> Send a message with your tattoo idea,
                        placement, and size
                      </li>
                      <li className="text-white">
                        <span className="text-purple-300">Consultation:</span> Schedule a consultation to discuss design
                        details
                      </li>
                      <li className="text-white">
                        <span className="text-purple-300">Deposit:</span> Pay a non-refundable deposit to secure your
                        appointment
                      </li>
                      <li className="text-white">
                        <span className="text-purple-300">Design Approval:</span> Review and approve the final design
                      </li>
                      <li className="text-white">
                        <span className="text-purple-300">Appointment:</span> Arrive on time for your scheduled session
                      </li>
                    </ol>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Button className="bg-purple-700 hover:bg-purple-600" onClick={handleBooking}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Consultation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-0">
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="bg-black/40 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.author} />
                          <AvatarFallback className="bg-purple-800 text-white">
                            {review.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-white">{review.author}</h4>
                              <div className="flex items-center">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-purple-300 ml-2">{review.date}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-white mt-2">{review.content}</p>

                          <div className="mt-3">
                            <div className="relative h-24 w-24 rounded-md overflow-hidden">
                              <Image
                                src={review.tattoo || "/placeholder.svg"}
                                alt="Tattoo"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex justify-center mt-4">
                  <Button variant="outline" className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50">
                    View All Reviews
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Contact Button */}
          <div className="fixed bottom-6 right-6">
            <Button className="bg-purple-700 hover:bg-purple-600 rounded-full h-14 w-14 shadow-lg">
              <MessageSquare className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
