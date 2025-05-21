"use server"

import { Resend } from "resend"

// Initialize Resend with API key
// In a real app, you would use an actual API key from your environment variables
const resend = new Resend(process.env.RESEND_API_KEY || "mock_api_key")

// For demo purposes, we'll just log the email content
const isDevelopment = process.env.NODE_ENV === "development"

interface BookingConfirmationEmailProps {
  clientEmail: string
  clientName: string
  artistName: string
  bookingDate: string
  startTime: string
  endTime: string
}

export async function sendBookingConfirmationEmail({
  clientEmail,
  clientName,
  artistName,
  bookingDate,
  startTime,
  endTime,
}: BookingConfirmationEmailProps) {
  try {
    // Format the date and time for display
    const formattedDate = new Date(bookingDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const formattedStartTime = startTime.substring(0, 5)
    const formattedEndTime = endTime.substring(0, 5)

    // Create email content
    const subject = `Your Tattoo Consultation with ${artistName} is Confirmed!`
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6d28d9; text-align: center;">Booking Confirmation</h1>
        <p>Hello ${clientName},</p>
        <p>Your tattoo consultation with ${artistName} has been confirmed!</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #4b5563;">Appointment Details</h2>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
          <p><strong>Artist:</strong> ${artistName}</p>
        </div>
        
        <p>Please arrive 10 minutes before your scheduled time. If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
        
        <p>We look forward to seeing you!</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://tattit.app/client/bookings" style="background-color: #6d28d9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Your Bookings</a>
        </div>
      </div>
    `

    if (isDevelopment) {
      // In development, just log the email
      console.log("==== BOOKING CONFIRMATION EMAIL ====")
      console.log(`To: ${clientEmail}`)
      console.log(`Subject: ${subject}`)
      console.log("Content:", html)
      console.log("====================================")
      return { success: true }
    }

    // In production, send the actual email
    const { data, error } = await resend.emails.send({
      from: "bookings@tattit.app",
      to: clientEmail,
      subject,
      html,
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending booking confirmation email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}
