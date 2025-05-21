export function UpcomingBookings() {
  // Mock data for upcoming bookings
  const bookings = [
    {
      id: 1,
      clientName: "Alex Chen",
      designName: "Cyberpunk Sleeve",
      date: "Today",
      time: "2:00 PM",
      image: "/images/tattoo-cyberpunk.png",
      status: "confirmed",
    },
    {
      id: 2,
      clientName: "Jordan Smith",
      designName: "Geometric Wolf",
      date: "Tomorrow",
      time: "10:00 AM",
      image: "/images/tattoo-geometric.png",
      status: "confirmed",
    },
    {
      id: 3,
      clientName: "Taylor Kim",
      designName: "Neon Dragon",
      date: "May 20",
      time: "3:30 PM",
      image: "/images/tattoo-mythological.png",
      status: "pending",
    },
  ]

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-black/40 border border-purple-500/30 rounded-lg p-4 flex items-center gap-4"
        >
          <div className="h-16 w-16 rounded-md overflow-hidden bg-purple-900/30 flex-shrink-0">
            <img
              src={booking.image || "/placeholder.svg"}
              alt={booking.designName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-white">{booking.clientName}</h3>
            <p className="text-sm text-purple-300">{booking.designName}</p>
            <div className="flex items-center mt-1">
              <span className="text-xs text-purple-400">
                {booking.date} at {booking.time}
              </span>
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  booking.status === "confirmed" ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {booking.status === "confirmed" ? "Confirmed" : "Pending"}
              </span>
            </div>
          </div>
          <button className="bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm">Details</button>
        </div>
      ))}
      <button className="w-full bg-purple-950/50 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 rounded-lg py-2 text-sm">
        View All Bookings
      </button>
    </div>
  )
}

export default UpcomingBookings
