"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Search,
  Send,
  ImageIcon,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for conversations
const mockConversations = [
  {
    id: "c1",
    client: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?text=AC",
      online: true,
      lastSeen: null,
    },
    lastMessage: {
      text: "I'm really excited about the cyberpunk design! When can we schedule the session?",
      time: "10:32 AM",
      isRead: false,
      sender: "client",
    },
    unreadCount: 2,
    design: {
      name: "Cyberpunk Arm",
      image: "/images/tattoo-cyberpunk.png",
    },
  },
  {
    id: "c2",
    client: {
      name: "Jordan Smith",
      avatar: "/placeholder.svg?text=JS",
      online: false,
      lastSeen: "2 hours ago",
    },
    lastMessage: {
      text: "The koi design looks amazing! I have a few questions about the colors.",
      time: "Yesterday",
      isRead: true,
      sender: "client",
    },
    unreadCount: 0,
    design: {
      name: "Japanese Koi",
      image: "/images/tattoo-japanese.png",
    },
  },
  {
    id: "c3",
    client: {
      name: "Riley Thompson",
      avatar: "/placeholder.svg?text=RT",
      online: false,
      lastSeen: "1 day ago",
    },
    lastMessage: {
      text: "I've attached some reference images for the consultation.",
      time: "Yesterday",
      isRead: true,
      sender: "client",
    },
    unreadCount: 0,
    design: {
      name: "Custom Design",
      image: "/placeholder.svg?text=Consultation",
    },
  },
  {
    id: "c4",
    client: {
      name: "Taylor Kim",
      avatar: "/placeholder.svg?text=TK",
      online: true,
      lastSeen: null,
    },
    lastMessage: {
      text: "Looking forward to our session tomorrow for the mandala piece!",
      time: "2 days ago",
      isRead: true,
      sender: "client",
    },
    unreadCount: 0,
    design: {
      name: "Geometric Mandala",
      image: "/images/tattoo-blackwork.png",
    },
  },
  {
    id: "c5",
    client: {
      name: "Morgan Lee",
      avatar: "/placeholder.svg?text=ML",
      online: false,
      lastSeen: "3 days ago",
    },
    lastMessage: {
      text: "I'll need to reschedule our appointment due to a personal emergency.",
      time: "3 days ago",
      isRead: true,
      sender: "client",
    },
    unreadCount: 0,
    design: {
      name: "Watercolor Abstract",
      image: "/images/tattoo-watercolor.png",
    },
  },
]

// Mock data for messages in a conversation
const mockMessages = {
  c1: [
    {
      id: "m1",
      text: "Hi there! I saw your portfolio and I'm interested in getting a cyberpunk-themed tattoo.",
      time: "Yesterday, 2:15 PM",
      sender: "client",
      isRead: true,
    },
    {
      id: "m2",
      text: "Hello Alex! Thanks for reaching out. I'd be happy to work on a cyberpunk design for you. Do you have any specific ideas or references?",
      time: "Yesterday, 2:30 PM",
      sender: "artist",
      isRead: true,
    },
    {
      id: "m3",
      text: "Yes, I'm thinking of a sleeve with circuit patterns and some neon elements. I've attached a few reference images.",
      time: "Yesterday, 2:45 PM",
      sender: "client",
      isRead: true,
      attachments: [
        {
          type: "image",
          url: "/images/tattoo-cyberpunk.png",
        },
      ],
    },
    {
      id: "m4",
      text: "These look great! I can definitely work with these references. I've created a preliminary design based on your ideas. What do you think?",
      time: "Yesterday, 3:30 PM",
      sender: "artist",
      isRead: true,
      attachments: [
        {
          type: "image",
          url: "/images/tattoo-cyberpunk.png",
        },
      ],
    },
    {
      id: "m5",
      text: "Wow, that's exactly what I had in mind! I love the neon accents and the circuit patterns.",
      time: "Yesterday, 4:15 PM",
      sender: "client",
      isRead: true,
    },
    {
      id: "m6",
      text: "Great! I'm glad you like it. For a design like this, we'd need about 3 hours for the session. My rate is $150 per hour, with a $150 deposit to secure your appointment.",
      time: "Yesterday, 4:30 PM",
      sender: "artist",
      isRead: true,
    },
    {
      id: "m7",
      text: "That sounds reasonable. I'm ready to book the appointment and pay the deposit.",
      time: "Yesterday, 5:00 PM",
      sender: "client",
      isRead: true,
    },
    {
      id: "m8",
      text: "Perfect! I've sent you a booking link. Once you complete the deposit payment, your appointment will be confirmed.",
      time: "Yesterday, 5:15 PM",
      sender: "artist",
      isRead: true,
    },
    {
      id: "m9",
      text: "I've just completed the payment. I'm really excited about the cyberpunk design! When can we schedule the session?",
      time: "Today, 10:32 AM",
      sender: "client",
      isRead: false,
    },
    {
      id: "m10",
      text: "I have an opening next Tuesday at 2 PM. Would that work for you?",
      time: "Today, 10:45 AM",
      sender: "client",
      isRead: false,
    },
  ],
  c2: [
    {
      id: "m1",
      text: "Hi, I'm interested in getting a Japanese-style tattoo with a koi fish.",
      time: "3 days ago, 11:20 AM",
      sender: "client",
      isRead: true,
    },
    {
      id: "m2",
      text: "Hello Jordan! Japanese koi designs are one of my specialties. Do you have any specific colors or elements in mind?",
      time: "3 days ago, 11:45 AM",
      sender: "artist",
      isRead: true,
    },
    {
      id: "m3",
      text: "I was thinking of traditional colors - red and blue with some water elements.",
      time: "3 days ago, 12:30 PM",
      sender: "client",
      isRead: true,
    },
    {
      id: "m4",
      text: "That sounds perfect. I've created a design that might interest you. Let me know what you think!",
      time: "2 days ago, 10:15 AM",
      sender: "artist",
      isRead: true,
      attachments: [
        {
          type: "image",
          url: "/images/tattoo-japanese.png",
        },
      ],
    },
    {
      id: "m5",
      text: "The koi design looks amazing! I have a few questions about the colors.",
      time: "Yesterday, 3:45 PM",
      sender: "client",
      isRead: true,
    },
  ],
}

export default function MessagesPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState(mockConversations)
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter conversations based on search query
    if (searchQuery) {
      const filtered = mockConversations.filter((conv) =>
        conv.client.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setConversations(filtered)
    } else {
      setConversations(mockConversations)
    }
  }, [searchQuery])

  useEffect(() => {
    // Load messages for active conversation
    if (activeConversation) {
      setMessages(mockMessages[activeConversation.id] || [])

      // Mark messages as read
      if (activeConversation.unreadCount > 0) {
        const updatedConversations = conversations.map((conv) =>
          conv.id === activeConversation.id ? { ...conv, unreadCount: 0 } : conv,
        )
        setConversations(updatedConversations)
      }
    }
  }, [activeConversation])

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !activeConversation) return

    const newMsg = {
      id: `new-${Date.now()}`,
      text: newMessage,
      time: "Just now",
      sender: "artist",
      isRead: false,
    }

    // Add message to conversation
    setMessages([...messages, newMsg])

    // Update last message in conversation list
    const updatedConversations = conversations.map((conv) =>
      conv.id === activeConversation.id
        ? {
            ...conv,
            lastMessage: {
              text: newMessage,
              time: "Just now",
              isRead: false,
              sender: "artist",
            },
          }
        : conv,
    )
    setConversations(updatedConversations)

    // Clear input
    setNewMessage("")
  }

  const formatMessageTime = (time) => {
    if (time === "Just now") return time
    return time
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-950 to-purple-950 text-white">
      <header className="border-b border-purple-900 bg-black/50 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/artist/dashboard")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            <p className="text-sm text-purple-300">Communicate with your clients</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex">
        <div className="flex w-full max-w-7xl mx-auto">
          {/* Conversations sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4 border-r border-purple-900/50">
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/40 border-purple-500/30"
                />
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-black/40 border border-purple-500/30 p-1 w-full">
                  <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-purple-700">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1 data-[state=active]:bg-purple-700">
                    Unread
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="p-2 space-y-2">
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-black/40 animate-pulse h-20"
                    ></div>
                  ))
                ) : conversations.length === 0 ? (
                  <div className="text-center p-4 text-purple-300">No conversations found</div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        activeConversation?.id === conversation.id
                          ? "bg-purple-800/30 border border-purple-500/50"
                          : "hover:bg-black/40"
                      }`}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={conversation.client.avatar || "/placeholder.svg"}
                            alt={conversation.client.name}
                          />
                          <AvatarFallback>{conversation.client.name[0]}</AvatarFallback>
                        </Avatar>
                        {conversation.client.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-white truncate">{conversation.client.name}</h3>
                          <span className="text-xs text-purple-300">{conversation.lastMessage.time}</span>
                        </div>
                        <p
                          className={`text-sm truncate ${
                            conversation.unreadCount > 0 ? "text-white font-medium" : "text-purple-300"
                          }`}
                        >
                          {conversation.lastMessage.sender === "artist" && "You: "}
                          {conversation.lastMessage.text}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-purple-600">{conversation.unreadCount}</Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Chat area */}
          <div className="hidden md:flex flex-col flex-1 bg-black/20">
            {activeConversation ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-purple-900/50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={activeConversation.client.avatar || "/placeholder.svg"}
                        alt={activeConversation.client.name}
                      />
                      <AvatarFallback>{activeConversation.client.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white">{activeConversation.client.name}</h3>
                        {activeConversation.client.online ? (
                          <Badge className="bg-green-600 text-xs">Online</Badge>
                        ) : (
                          <span className="text-xs text-purple-300">
                            Last seen: {activeConversation.client.lastSeen}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-purple-300">Design: {activeConversation.design.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-purple-300 hover:text-white">
                            <Phone className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Call client</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-purple-300 hover:text-white">
                            <Video className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Video call</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-purple-300 hover:text-white">
                            <Info className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Client info</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-purple-300 hover:text-white">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-purple-500/30 text-white">
                        <DropdownMenuItem>View client profile</DropdownMenuItem>
                        <DropdownMenuItem>View booking details</DropdownMenuItem>
                        <DropdownMenuItem>Clear conversation</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "artist" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] ${
                            message.sender === "artist"
                              ? "bg-purple-700 rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                              : "bg-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg"
                          } p-3`}
                        >
                          <p className="text-white">{message.text}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="rounded-md overflow-hidden mt-2">
                                  {attachment.type === "image" && (
                                    <img
                                      src={attachment.url || "/placeholder.svg"}
                                      alt="Attachment"
                                      className="max-w-full h-auto max-h-60 object-cover"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-xs text-purple-200/70">{formatMessageTime(message.time)}</span>
                            {message.sender === "artist" && (
                              <span>
                                {message.isRead ? (
                                  <CheckCheck className="h-3 w-3 text-blue-400" />
                                ) : (
                                  <Check className="h-3 w-3 text-purple-300" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message input */}
                <div className="p-4 border-t border-purple-900/50">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="icon" className="text-purple-300 hover:text-white">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="text-purple-300 hover:text-white">
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 bg-black/40 border-purple-500/30"
                    />
                    <Button type="submit" className="bg-purple-700 hover:bg-purple-600">
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Your Messages</h3>
                <p className="text-purple-300 max-w-md">
                  Select a conversation from the list to view messages or start a new conversation with a client.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
