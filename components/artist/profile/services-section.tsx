"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { DollarSign, Clock, Plus, Trash2, FileText, Edit, Check, X } from "lucide-react"

interface ServicesSectionProps {
  onChange?: () => void
}

export function ServicesSection({ onChange }: ServicesSectionProps) {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Custom Tattoo Design",
      description: "Personalized tattoo design consultation and creation based on your ideas and preferences.",
      duration: 120,
      price: 150,
      isPackage: false,
      isPopular: true,
      isAvailable: true,
      includes: ["Initial consultation", "Digital design", "One revision", "Tattoo session"],
    },
    {
      id: 2,
      name: "Small Tattoo Session",
      description: "Perfect for small, simple designs under 3 inches.",
      duration: 60,
      price: 100,
      isPackage: false,
      isPopular: false,
      isAvailable: true,
      includes: ["Simple design", "Black ink", "One location"],
    },
    {
      id: 3,
      name: "Full Sleeve Package",
      description: "Complete sleeve design and execution over multiple sessions.",
      duration: 0, // Multiple sessions
      price: 1200,
      isPackage: true,
      isPopular: true,
      isAvailable: true,
      includes: ["Comprehensive design", "3-5 sessions", "All colors", "Touch-up session"],
    },
  ])

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    duration: 60,
    price: 100,
    isPackage: false,
    isPopular: false,
    isAvailable: true,
    includes: [""],
  })

  const [editingService, setEditingService] = useState<number | null>(null)
  const [editingIncludeIndex, setEditingIncludeIndex] = useState<number | null>(null)
  const [editingIncludeValue, setEditingIncludeValue] = useState("")

  useEffect(() => {
    onChange?.()
  }, [services, onChange])

  const handleAddService = () => {
    if (newService.name.trim() === "") return

    setServices([
      ...services,
      {
        id: Date.now(),
        ...newService,
        includes: newService.includes.filter((item) => item.trim() !== ""),
      },
    ])

    setNewService({
      name: "",
      description: "",
      duration: 60,
      price: 100,
      isPackage: false,
      isPopular: false,
      isAvailable: true,
      includes: [""],
    })

    onChange?.()
  }

  const handleDeleteService = (id: number) => {
    setServices(services.filter((service) => service.id !== id))
    onChange?.()
  }

  const handleUpdateService = (id: number, field: string, value: any) => {
    setServices(services.map((service) => (service.id === id ? { ...service, [field]: value } : service)))
    onChange?.()
  }

  const handleAddIncludeItem = (serviceId: number | null) => {
    if (serviceId === null) {
      // Adding to new service
      if (newService.includes[newService.includes.length - 1].trim() !== "") {
        setNewService({
          ...newService,
          includes: [...newService.includes, ""],
        })
      }
    } else {
      // Adding to existing service
      const service = services.find((s) => s.id === serviceId)
      if (service && service.includes[service.includes.length - 1].trim() !== "") {
        handleUpdateService(serviceId, "includes", [...service.includes, ""])
      }
    }
  }

  const handleRemoveIncludeItem = (serviceId: number | null, index: number) => {
    if (serviceId === null) {
      // Removing from new service
      const newIncludes = [...newService.includes]
      newIncludes.splice(index, 1)
      setNewService({
        ...newService,
        includes: newIncludes.length ? newIncludes : [""],
      })
    } else {
      // Removing from existing service
      const service = services.find((s) => s.id === serviceId)
      if (service) {
        const newIncludes = [...service.includes]
        newIncludes.splice(index, 1)
        handleUpdateService(serviceId, "includes", newIncludes.length ? newIncludes : [""])
      }
    }
  }

  const handleUpdateIncludeItem = (serviceId: number | null, index: number, value: string) => {
    if (serviceId === null) {
      // Updating new service
      const newIncludes = [...newService.includes]
      newIncludes[index] = value
      setNewService({
        ...newService,
        includes: newIncludes,
      })
    } else {
      // Updating existing service
      const service = services.find((s) => s.id === serviceId)
      if (service) {
        const newIncludes = [...service.includes]
        newIncludes[index] = value
        handleUpdateService(serviceId, "includes", newIncludes)
      }
    }
  }

  const startEditingInclude = (serviceId: number, index: number, value: string) => {
    setEditingService(serviceId)
    setEditingIncludeIndex(index)
    setEditingIncludeValue(value)
  }

  const saveEditingInclude = () => {
    if (editingService !== null && editingIncludeIndex !== null) {
      handleUpdateIncludeItem(editingService, editingIncludeIndex, editingIncludeValue)
      setEditingService(null)
      setEditingIncludeIndex(null)
    }
  }

  const cancelEditingInclude = () => {
    setEditingService(null)
    setEditingIncludeIndex(null)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-purple-200">Services & Packages</CardTitle>
          <CardDescription className="text-purple-400">
            Define the services and packages you offer to clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-4 rounded-lg bg-black/30 border border-purple-500/20 transition-all duration-300 hover:border-purple-500/40 hover:bg-black/40"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-white">{service.name}</h3>
                      {service.isPopular && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-purple-700 text-white">Popular</span>
                      )}
                      {service.isPackage && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-700 text-white">Package</span>
                      )}
                    </div>
                    <p className="text-sm text-purple-300 mt-1">{service.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteService(service.id)}
                    className="text-purple-300 hover:text-red-400 hover:bg-red-900/10"
                    aria-label="Delete service"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-black/20 p-3 rounded-lg">
                    <DollarSign className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-xs text-purple-300">Price</p>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          value={service.price}
                          onChange={(e) => handleUpdateService(service.id, "price", Number(e.target.value))}
                          className="w-20 h-7 bg-black/40 border-purple-500/30 focus:border-purple-400"
                        />
                        <span className="ml-1 text-white">USD</span>
                      </div>
                    </div>
                  </div>

                  {!service.isPackage && (
                    <div className="flex items-center gap-2 bg-black/20 p-3 rounded-lg">
                      <Clock className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-xs text-purple-300">Duration</p>
                        <div className="flex items-center">
                          <Input
                            type="number"
                            value={service.duration}
                            onChange={(e) => handleUpdateService(service.id, "duration", Number(e.target.value))}
                            className="w-16 h-7 bg-black/40 border-purple-500/30 focus:border-purple-400"
                          />
                          <span className="ml-1 text-white">min</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 bg-black/20 p-3 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-xs text-purple-300">Type</p>
                      <select
                        value={service.isPackage ? "package" : "service"}
                        onChange={(e) => handleUpdateService(service.id, "isPackage", e.target.value === "package")}
                        className="bg-black/40 border-purple-500/30 rounded-md p-1 text-white text-sm h-7"
                      >
                        <option value="service">Single Service</option>
                        <option value="package">Package</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-purple-300">What's included:</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddIncludeItem(service.id)}
                      className="h-7 text-purple-300 hover:text-purple-100"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {service.includes.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {editingService === service.id && editingIncludeIndex === index ? (
                          <>
                            <Input
                              value={editingIncludeValue}
                              onChange={(e) => setEditingIncludeValue(e.target.value)}
                              className="flex-1 bg-black/40 border-purple-500/30 focus:border-purple-400"
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={saveEditingInclude}
                              className="h-8 w-8 text-green-500"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={cancelEditingInclude}
                              className="h-8 w-8 text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 p-2 bg-black/20 rounded-md text-white">
                              {item || "Click to edit"}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditingInclude(service.id, index, item)}
                              className="h-8 w-8 text-purple-300 hover:text-purple-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveIncludeItem(service.id, index)}
                              className="h-8 w-8 text-purple-300 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`available-${service.id}`}
                      checked={service.isAvailable}
                      onCheckedChange={(checked) => handleUpdateService(service.id, "isAvailable", checked)}
                      className="data-[state=checked]:bg-purple-700"
                    />
                    <Label htmlFor={`available-${service.id}`} className="text-purple-300">
                      Available for booking
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`popular-${service.id}`}
                      checked={service.isPopular}
                      onCheckedChange={(checked) => handleUpdateService(service.id, "isPopular", checked)}
                      className="data-[state=checked]:bg-purple-700"
                    />
                    <Label htmlFor={`popular-${service.id}`} className="text-purple-300">
                      Mark as popular
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg border border-dashed border-purple-500/30 bg-black/20">
            <h3 className="text-lg font-medium text-white mb-4">Add New Service</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-service-name" className="text-purple-300">
                  Service Name
                </Label>
                <Input
                  id="new-service-name"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="e.g., Custom Sleeve Design"
                  className="bg-black/40 border-purple-500/30 focus:border-purple-400"
                />
              </div>

              <div>
                <Label htmlFor="new-service-description" className="text-purple-300">
                  Description
                </Label>
                <Textarea
                  id="new-service-description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Describe what this service includes and what clients can expect"
                  className="bg-black/40 border-purple-500/30 focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="new-service-price" className="text-purple-300">
                    Price ($)
                  </Label>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-purple-300" />
                    <Input
                      id="new-service-price"
                      type="number"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                      className="bg-black/40 border-purple-500/30 focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-service-duration" className="text-purple-300">
                    Duration (minutes)
                  </Label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-purple-300" />
                    <Input
                      id="new-service-duration"
                      type="number"
                      value={newService.duration}
                      onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                      className="bg-black/40 border-purple-500/30 focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-service-type" className="text-purple-300">
                    Type
                  </Label>
                  <select
                    id="new-service-type"
                    value={newService.isPackage ? "package" : "service"}
                    onChange={(e) => setNewService({ ...newService, isPackage: e.target.value === "package" })}
                    className="w-full bg-black/40 border-purple-500/30 rounded-md p-2 text-white"
                  >
                    <option value="service">Single Service</option>
                    <option value="package">Package</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-purple-300">What's included:</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddIncludeItem(null)}
                    className="h-7 text-purple-300 hover:text-purple-100"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-2">
                  {newService.includes.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={item}
                        onChange={(e) => handleUpdateIncludeItem(null, index, e.target.value)}
                        placeholder="e.g., Initial consultation"
                        className="flex-1 bg-black/40 border-purple-500/30 focus:border-purple-400"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveIncludeItem(null, index)}
                        className="h-8 w-8 text-purple-300 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new-service-available"
                    checked={newService.isAvailable}
                    onCheckedChange={(checked) => setNewService({ ...newService, isAvailable: checked })}
                    className="data-[state=checked]:bg-purple-700"
                  />
                  <Label htmlFor="new-service-available" className="text-purple-300">
                    Available for booking
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="new-service-popular"
                    checked={newService.isPopular}
                    onCheckedChange={(checked) => setNewService({ ...newService, isPopular: checked })}
                    className="data-[state=checked]:bg-purple-700"
                  />
                  <Label htmlFor="new-service-popular" className="text-purple-300">
                    Mark as popular
                  </Label>
                </div>
              </div>

              <Button
                onClick={handleAddService}
                disabled={!newService.name.trim()}
                className="w-full mt-2 bg-purple-700 hover:bg-purple-600 transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
