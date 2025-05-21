"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckSquare, DollarSign, Star, Users } from "lucide-react"

export function ArtistStatsCards() {
  // Mock data - in a real app, this would come from an API or database
  const stats = {
    earnings: {
      total: 12500,
      thisMonth: 3200,
    },
    completedTattoos: 48,
    activeClients: 12,
    averageRating: 4.8,
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-black/40 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-purple-300">Total Earnings</p>
              <h3 className="text-2xl font-bold mt-1 text-white">${stats.earnings.total}</h3>
              <p className="text-sm text-green-400 mt-1">+${stats.earnings.thisMonth} this month</p>
            </div>
            <div className="bg-purple-800/50 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-purple-300">Completed Tattoos</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{stats.completedTattoos}</h3>
              <p className="text-sm text-purple-300 mt-1">Lifetime total</p>
            </div>
            <div className="bg-purple-800/50 p-3 rounded-full">
              <CheckSquare className="h-6 w-6 text-purple-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-purple-300">Active Clients</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{stats.activeClients}</h3>
              <p className="text-sm text-purple-300 mt-1">Current relationships</p>
            </div>
            <div className="bg-purple-800/50 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-purple-300">Average Rating</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{stats.averageRating}</h3>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(stats.averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                    } ${i === Math.floor(stats.averageRating) && stats.averageRating % 1 > 0 ? "half-filled" : ""}`}
                  />
                ))}
              </div>
            </div>
            <div className="bg-purple-800/50 p-3 rounded-full">
              <Star className="h-6 w-6 text-purple-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
