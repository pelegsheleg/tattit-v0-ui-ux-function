"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Plus, Trash2, XCircle } from "lucide-react"

interface DosAndDontsProps {
  onChange?: () => void
}

export function DosAndDonts({ onChange }: DosAndDontsProps) {
  const [dosList, setDosList] = useState([
    "I specialize in fine line work and detailed designs",
    "I can work with your ideas to create a custom design",
    "I prefer to have a consultation before booking a session",
  ])

  const [dontsList, setDontsList] = useState([
    "I don't do hateful or offensive imagery",
    "I don't copy other artists' work exactly",
    "I don't do walk-ins without prior arrangement",
  ])

  const [newDo, setNewDo] = useState("")
  const [newDont, setNewDont] = useState("")
  const [guidelines, setGuidelines] = useState(
    "I specialize in cyberpunk and futuristic designs. I prioritize client comfort and satisfaction, and I'm always open to discussing design modifications. Please arrive sober and well-rested for your appointment.",
  )

  useEffect(() => {
    onChange?.()
  }, [dosList, dontsList, guidelines, onChange])

  const handleAddDo = () => {
    if (newDo.trim() && !dosList.includes(newDo.trim())) {
      setDosList([...dosList, newDo.trim()])
      setNewDo("")
      onChange?.()
    }
  }

  const handleRemoveDo = (item: string) => {
    setDosList(dosList.filter((i) => i !== item))
    onChange?.()
  }

  const handleAddDont = () => {
    if (newDont.trim() && !dontsList.includes(newDont.trim())) {
      setDontsList([...dontsList, newDont.trim()])
      setNewDont("")
      onChange?.()
    }
  }

  const handleRemoveDont = (item: string) => {
    setDontsList(dontsList.filter((i) => i !== item))
    onChange?.()
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-purple-200">General Guidelines</CardTitle>
          <CardDescription className="text-purple-400">Set clear expectations for your clients</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={guidelines}
            onChange={(e) => {
              setGuidelines(e.target.value)
              onChange?.()
            }}
            className="bg-black/40 border-purple-500/30 focus:border-purple-400"
            rows={4}
            placeholder="Enter your general guidelines and policies..."
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-purple-200">I Do</CardTitle>
            <CardDescription className="text-purple-400">What you specialize in and prefer to do</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dosList.map((item, index) => (
              <div key={index} className="flex items-start group">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-3 mt-1 shrink-0" />
                <div className="flex-1 bg-black/30 p-3 rounded-md border border-purple-500/20">{item}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDo(item)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-300 hover:text-red-400 hover:bg-red-900/10"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Add new do..."
                value={newDo}
                onChange={(e) => setNewDo(e.target.value)}
                className="bg-black/40 border-purple-500/30 focus:border-purple-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleAddDo()
                  }
                }}
              />
              <Button
                onClick={handleAddDo}
                className="bg-purple-700 hover:bg-purple-600 transition-all duration-300"
                size="icon"
                aria-label="Add item"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-purple-200">I Don't</CardTitle>
            <CardDescription className="text-purple-400">What you avoid or don't offer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dontsList.map((item, index) => (
              <div key={index} className="flex items-start group">
                <XCircle className="h-4 w-4 text-red-500 mr-3 mt-1 shrink-0" />
                <div className="flex-1 bg-black/30 p-3 rounded-md border border-purple-500/20">{item}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDont(item)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-300 hover:text-red-400 hover:bg-red-900/10"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Add new don't..."
                value={newDont}
                onChange={(e) => setNewDont(e.target.value)}
                className="bg-black/40 border-purple-500/30 focus:border-purple-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleAddDont()
                  }
                }}
              />
              <Button
                onClick={handleAddDont}
                className="bg-purple-700 hover:bg-purple-600 transition-all duration-300"
                size="icon"
                aria-label="Add item"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
