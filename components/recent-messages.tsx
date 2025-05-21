export function RecentMessages() {
  // Mock data for recent messages
  const messages = [
    {
      id: "1",
      sender: "Alex Chen",
      avatar: "/placeholder.svg?text=AC",
      text: "Hey, I'm looking forward to our session tomorrow!",
      timestamp: "Today, 10:23 AM",
      unread: true,
    },
    {
      id: "2",
      sender: "Jordan Smith",
      avatar: "/placeholder.svg?text=JS",
      text: "Can we discuss some design changes before the appointment?",
      timestamp: "Yesterday, 4:15 PM",
      unread: true,
    },
    {
      id: "3",
      sender: "Taylor Kim",
      avatar: "/placeholder.svg?text=TK",
      text: "Thanks for the design preview. It looks amazing!",
      timestamp: "May 18, 2:30 PM",
      unread: false,
    },
  ]

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`bg-black/40 border ${message.unread ? "border-purple-500/50" : "border-purple-500/20"} rounded-lg p-4`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-purple-900/50">
              <img
                src={message.avatar || "/placeholder.svg"}
                alt={message.sender}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-white">{message.sender}</h3>
              <p className="text-xs text-purple-300">{message.timestamp}</p>
            </div>
            {message.unread && <span className="ml-auto w-2 h-2 bg-purple-500 rounded-full"></span>}
          </div>
          <p className="text-sm text-purple-100">{message.text}</p>
        </div>
      ))}
      <button className="w-full bg-purple-950/50 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 rounded-lg py-2 text-sm">
        View All Messages
      </button>
    </div>
  )
}

export default RecentMessages
