"use client"

import { useState, useRef, useEffect } from "react"
import { X, Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export function MultiSelect({ options, value = [], onChange, placeholder = "Select items..." }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(value)
  const inputRef = useRef(null)

  // Sync with external value
  useEffect(() => {
    setSelected(value)
  }, [value])

  const handleSelect = (item) => {
    const newSelected = selected.includes(item) ? selected.filter((i) => i !== item) : [...selected, item]

    setSelected(newSelected)
    onChange?.(newSelected)
  }

  const handleRemove = (item) => {
    const newSelected = selected.filter((i) => i !== item)
    setSelected(newSelected)
    onChange?.(newSelected)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex flex-wrap gap-1">
            {selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selected.map((item) => (
                  <Badge key={item} variant="secondary" className="mr-1">
                    {item}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(item)
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={() => handleRemove(item)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." ref={inputRef} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className={`flex-shrink-0 border rounded-sm w-4 h-4 flex items-center justify-center ${isSelected ? "bg-primary border-primary" : "border-input"}`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
