"use client"

import { Switch } from "@/components/ui/switch"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign, Plus, Trash2 } from "lucide-react"

interface PricingSectionProps {
  onChange?: () => void
}

export function PricingSection({ onChange }: PricingSectionProps) {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Small Tattoo (2-3 inches)",
      basePrice: 120,
      hourlyRate: 100,
      deposit: 50,
      depositType: "percentage",
    },
    {
      id: 2,
      name: "Medium Tattoo (4-6 inches)",
      basePrice: 250,
      hourlyRate: 120,
      deposit: 30,
      depositType: "percentage",
    },
    {
      id: 3,
      name: "Large Tattoo (7+ inches)",
      basePrice: 400,
      hourlyRate: 150,
      deposit: 200,
      depositType: "fixed",
    },
    {
      id: 4,
      name: "Cover-up Work",
      basePrice: 350,
      hourlyRate: 150,
      deposit: 40,
      depositType: "percentage",
    },
  ])

  const [newService, setNewService] = useState({
    name: "",
    basePrice: 150,
    hourlyRate: 120,
    deposit: 30,
    depositType: "percentage",
  })

  const [useHourlyRates, setUseHourlyRates] = useState(true)
  const [additionalInfo, setAdditionalInfo] = useState(
    "Prices may vary based on complexity, size, and placement. A deposit of 25% is required to secure your appointment. Consultations are free of charge.",
  )

  useEffect(() => {
    onChange?.()
  }, [services, useHourlyRates, additionalInfo, onChange])

  const handleAddService = () => {
    if (newService.name.trim() === "") return

    setServices([
      ...services,
      {
        id: Date.now(),
        ...newService,
      },
    ])

    setNewService({
      name: "",
      basePrice: 150,
      hourlyRate: 120,
      deposit: 30,
      depositType: "percentage",
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

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-purple-200">Pricing Structure</CardTitle>
          <CardDescription className="text-purple-400">
            Set your pricing for different types of tattoo services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6 p-3 rounded-lg bg-black/30 border border-purple-500/20">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-300" />
              <div className="font-medium text-white">Use hourly rates for larger projects</div>
            </div>
            <Switch
              checked={useHourlyRates}
              onCheckedChange={(checked) => {
                setUseHourlyRates(checked)
                onChange?.()
              }}
              className="data-[state=checked]:bg-purple-700"
            />
          </div>

          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-4 rounded-lg bg-black/30 border border-purple-500/20 transition-all duration-300 hover:border-purple-500/40 hover:bg-black/40"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-full">
                    <Input
                      value={service.name}
                      onChange={(e) => {
                        handleUpdateService(service.id, "name", e.target.value)
                      }}
                      className="font-medium bg-black/40 border-purple-500/30 focus:border-purple-400"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteService(service.id)}
                    className="ml-2 text-purple-300 hover:text-red-400 hover:bg-red-900/10"
                    aria-label="Delete service"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-purple-300">Base Price ($)</Label>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-purple-300" />
                      <Input
                        type="number"
                        value={service.basePrice}
                        onChange={(e) => {
                          handleUpdateService(service.id, "basePrice", Number(e.target.value))
                        }}
                        className="bg-black/40 border-purple-500/30 focus:border-purple-400"
                      />
                    </div>
                  </div>

                  {useHourlyRates && (
                    <div className="space-y-2">
                      <Label className="text-purple-300">Hourly Rate ($)</Label>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-purple-300" />
                        <Input
                          type="number"
                          value={service.hourlyRate}
                          onChange={(e) => {
                            handleUpdateService(service.id, "hourlyRate", Number(e.target.value))
                          }}
                          className="bg-black/40 border-purple-500/30 focus:border-purple-400"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-purple-300">Deposit</Label>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-purple-300" />
                      <Input
                        type="number"
                        value={service.deposit}
                        onChange={(e) => {
                          handleUpdateService(service.id, "deposit", Number(e.target.value))
                        }}
                        className="bg-black/40 border-purple-500/30 focus:border-purple-400"
                      />
                      <select
                        value={service.depositType}
                        onChange={(e) => handleUpdateService(service.id, "depositType", e.target.value)}
                        className="bg-black/40 border-purple-500/30 rounded-md p-2 text-white"
                      >
                        <option value="percentage">Percent</option>
                        <option value="fixed">Fixed ($)</option>
                      </select>
                    </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-purple-300">Base Price ($)</Label>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-purple-300" />
                    <Input
                      type="number"
                      value={newService.basePrice}
                      onChange={(e) => setNewService({ ...newService, basePrice: Number(e.target.value) })}
                      className="bg-black/40 border-purple-500/30 focus:border-purple-400"
                    />
                  </div>
                </div>

                {useHourlyRates && (
                  <div className="space-y-2">
                    <Label className="text-purple-300">Hourly Rate ($)</Label>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-purple-300" />
                      <Input
                        type="number"
                        value={newService.hourlyRate}
                        onChange={(e) => setNewService({ ...newService, hourlyRate: Number(e.target.value) })}
                        className="bg-black/40 border-purple-500/30 focus:border-purple-400"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-purple-300">Deposit</Label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-purple-300" />
                    <Input
                      type="number"
                      value={newService.deposit}
                      onChange={(e) => setNewService({ ...newService, deposit: Number(e.target.value) })}
                      className="bg-black/40 border-purple-500/30 focus:border-purple-400"
                    />
                    <select
                      value={newService.depositType}
                      onChange={(e) => setNewService({ ...newService, depositType: e.target.value })}
                      className="bg-black/40 border-purple-500/30 rounded-md p-2 text-white"
                    >
                      <option value="percentage">Percent</option>
                      <option value="fixed">Fixed ($)</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddService}
                className="w-full mt-2 bg-purple-700 hover:bg-purple-600 transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-purple-200">Additional Pricing Information</CardTitle>
          <CardDescription className="text-purple-400">
            Add notes about your pricing policy, discounts, or special offers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Example: I offer 15% discount for returning clients. Touch-ups within 3 months are free of charge. Custom design consultations are $50, which is applied to the final tattoo price."
            className="min-h-[150px] bg-black/40 border-purple-500/30 focus:border-purple-400"
            value={additionalInfo}
            onChange={(e) => {
              setAdditionalInfo(e.target.value)
              onChange?.()
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
