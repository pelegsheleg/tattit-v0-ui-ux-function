"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Mail, MessageSquare, Clock } from "lucide-react"

interface MessagesSectionProps {
  onChange?: () => void
}

export function MessagesSection({ onChange }: MessagesSectionProps) {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [autoResponder, setAutoResponder] = useState(false)
  const [autoResponderMessage, setAutoResponderMessage] = useState(
    "Thank you for your message. I'm currently reviewing inquiries and will get back to you within 48 hours. For urgent matters, please call the studio directly.",
  )
  const [responseTime, setResponseTime] = useState("48")

  useEffect(() => {
    onChange?.()
  }, [emailNotifications, pushNotifications, autoResponder, autoResponderMessage, responseTime, onChange])

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-purple-200">Notification Preferences</CardTitle>
          <CardDescription className="text-purple-400">
            Manage how you receive notifications about new messages and bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-purple-500/20">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-900/40 text-purple-400 mr-3">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Email Notifications</h3>
                  <p className="text-purple-300 text-sm">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={(checked) => {
                  setEmailNotifications(checked)
                  onChange?.()
                }}
                className="data-[state=checked]:bg-purple-700"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-purple-500/20">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-900/40 text-purple-400 mr-3">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Push Notifications</h3>
                  <p className="text-purple-300 text-sm">Receive notifications on your device</p>
                </div>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={(checked) => {
                  setPushNotifications(checked)
                  onChange?.()
                }}
                className="data-[state=checked]:bg-purple-700"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-purple-200">Auto-Responder</CardTitle>
          <CardDescription className="text-purple-400">
            Set up an automatic response for new client messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-purple-500/20 mb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-purple-900/40 text-purple-400 mr-3">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-white">Enable Auto-Responder</h3>
                <p className="text-purple-300 text-sm">Automatically reply to new messages</p>
              </div>
            </div>
            <Switch
              checked={autoResponder}
              onCheckedChange={(checked) => {
                setAutoResponder(checked)
                onChange?.()
              }}
              className="data-[state=checked]:bg-purple-700"
            />
          </div>

          {autoResponder && (
            <div className="space-y-4">
              <div>
                <Label className="text-purple-300">Auto-Response Message</Label>
                <Textarea
                  value={autoResponderMessage}
                  onChange={(e) => {
                    setAutoResponderMessage(e.target.value)
                    onChange?.()
                  }}
                  className="min-h-[150px] mt-2 bg-black/40 border-purple-500/30 focus:border-purple-400"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-purple-200">Response Time</CardTitle>
          <CardDescription className="text-purple-400">
            Set expectations for how quickly you typically respond to messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center p-4 rounded-lg bg-black/30 border border-purple-500/20">
            <div className="p-2 rounded-full bg-purple-900/40 text-purple-400 mr-3">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white mb-2">Typical Response Time</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={responseTime}
                  onChange={(e) => {
                    setResponseTime(e.target.value)
                    onChange?.()
                  }}
                  className="bg-black/40 border-purple-500/30 rounded-md p-2 text-white"
                >
                  <option value="4">Within 4 hours</option>
                  <option value="12">Within 12 hours</option>
                  <option value="24">Within 24 hours</option>
                  <option value="48">Within 48 hours</option>
                  <option value="72">Within 3 days</option>
                  <option value="168">Within 1 week</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
