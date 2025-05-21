"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

interface RoleSelectionProps {
  onRoleSelect: (role: "artist" | "client") => void
}

export default function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<"artist" | "client" | null>(null)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Choose Your Role</h2>
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-4 rounded-lg cursor-pointer ${
            selectedRole === "client"
              ? "bg-purple-700 border-2 border-purple-400"
              : "bg-purple-900/50 border border-purple-500/30"
          }`}
          onClick={() => setSelectedRole("client")}
        >
          <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg">
            <Image
              src="/images/mythological-tattoos.png"
              alt="Person with mythological tattoos"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-lg font-semibold text-center">I'm Looking for an Artist</h3>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-4 rounded-lg cursor-pointer ${
            selectedRole === "artist"
              ? "bg-purple-700 border-2 border-purple-400"
              : "bg-purple-900/50 border border-purple-500/30"
          }`}
          onClick={() => setSelectedRole("artist")}
        >
          <Image src="/placeholder.svg?text=Artist" alt="Artist" width={100} height={100} className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-center">I'm an Artist</h3>
        </motion.div>
      </div>
      <Button
        className="w-full bg-purple-700 hover:bg-purple-600 text-white"
        disabled={!selectedRole}
        onClick={() => selectedRole && onRoleSelect(selectedRole)}
      >
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
