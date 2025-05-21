"use client"

import { createContext, useState, useContext, type ReactNode, type FC, useCallback } from "react"

type ToastType = "default" | "destructive"

interface ToastDetails {
  id: string
  title: string
  description?: string
  variant?: ToastType
}

interface ToastContextProps {
  toasts: ToastDetails[]
  toast: ({ title, description, variant }: { title: string; description?: string; variant?: ToastType }) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
}

const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastDetails[]>([])

  const toast = useCallback(
    ({ title, description, variant = "default" }: { title: string; description?: string; variant?: ToastType }) => {
      const id = Math.random().toString(36).substring(2)
      setToasts((prev) => [...prev, { id, title, description, variant }])
    },
    [],
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return <ToastContext.Provider value={{ toasts, toast, dismiss }}>{children}</ToastContext.Provider>
}

const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export { ToastProvider, useToast }
