// This file is for logging registration events and errors

export function logRegistrationEvent(event: string, data?: any) {
  console.log(`[Registration] ${event}`, data || "")
}

export function logRegistrationError(error: any, context: string) {
  console.error(`[Registration Error] ${context}:`, error)

  // You could also send these errors to a monitoring service
  // sendToMonitoring(error, context)
}

// Helper function to format error messages for display
export function formatErrorMessage(error: any): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  if (error && error.message) {
    return error.message
  }

  return "An unexpected error occurred"
}
