import { google } from 'googleapis'

const TIMEZONE = 'Asia/Kolkata'

// All possible 30-min business hour slots
const ALL_SLOTS = [
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM",
  "12:00 PM - 12:30 PM",
  "02:00 PM - 02:30 PM",
  "02:30 PM - 03:00 PM",
  "03:00 PM - 03:30 PM",
  "03:30 PM - 04:00 PM",
  "04:00 PM - 04:30 PM",
  "04:30 PM - 05:00 PM",
  "05:00 PM - 05:30 PM",
  "05:30 PM - 06:00 PM",
]

function isConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
    process.env.GOOGLE_CALENDAR_ID
  )
}

function getCalendarClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })

  return google.calendar({ version: 'v3', auth })
}

// Parse "10:00 AM" to { hours: 10, minutes: 0 } in 24h format
function parseTime(timeStr: string): { hours: number; minutes: number } {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return { hours: 0, minutes: 0 }

  let hours = parseInt(match[1])
  const minutes = parseInt(match[2])
  const period = match[3].toUpperCase()

  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0

  return { hours, minutes }
}

// Build a Date in IST for a given date string and time
function buildISTDate(dateStr: string, hours: number, minutes: number): Date {
  // dateStr is YYYY-MM-DD
  const date = new Date(`${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+05:30`)
  return date
}

/**
 * Get available time slots for a given date
 * Returns the full slot list if Google Calendar is not configured
 */
export async function getAvailableSlots(dateStr: string): Promise<{ slots: string[]; calendarConnected: boolean }> {
  if (!isConfigured()) {
    return { slots: ALL_SLOTS, calendarConnected: false }
  }

  try {
    const calendar = getCalendarClient()
    const calendarId = process.env.GOOGLE_CALENDAR_ID!

    // Query free/busy for the entire day
    const dayStart = buildISTDate(dateStr, 0, 0)
    const dayEnd = buildISTDate(dateStr, 23, 59)

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: dayStart.toISOString(),
        timeMax: dayEnd.toISOString(),
        timeZone: TIMEZONE,
        items: [{ id: calendarId }],
      },
    })

    const busySlots = response.data.calendars?.[calendarId]?.busy || []

    // Filter out slots that overlap with busy times
    const availableSlots = ALL_SLOTS.filter((slot) => {
      const [startStr] = slot.split(' - ')
      const endStr = slot.split(' - ')[1]

      const startTime = parseTime(startStr)
      const endTime = parseTime(endStr)

      const slotStart = buildISTDate(dateStr, startTime.hours, startTime.minutes)
      const slotEnd = buildISTDate(dateStr, endTime.hours, endTime.minutes)

      // Check if this slot overlaps with any busy period
      return !busySlots.some((busy: any) => {
        const busyStart = new Date(busy.start)
        const busyEnd = new Date(busy.end)
        return slotStart < busyEnd && slotEnd > busyStart
      })
    })

    return { slots: availableSlots, calendarConnected: true }
  } catch (error) {
    console.error('Google Calendar availability check failed:', error)
    // Graceful fallback: return all slots
    return { slots: ALL_SLOTS, calendarConnected: false }
  }
}

/**
 * Create a Google Calendar event for an appointment
 * Returns the event ID or null if calendar is not configured
 */
export async function createCalendarEvent(data: {
  name: string
  email: string
  phone: string
  service: string
  date: string // YYYY-MM-DD
  timeSlot: string // "10:00 AM - 10:30 AM"
  message?: string
}): Promise<string | null> {
  if (!isConfigured()) {
    return null
  }

  try {
    const calendar = getCalendarClient()
    const calendarId = process.env.GOOGLE_CALENDAR_ID!

    const [startStr, endStr] = data.timeSlot.split(' - ')
    const startTime = parseTime(startStr)
    const endTime = parseTime(endStr)

    const startDateTime = buildISTDate(data.date, startTime.hours, startTime.minutes)
    const endDateTime = buildISTDate(data.date, endTime.hours, endTime.minutes)

    const description = [
      `Client: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Service: ${data.service}`,
      data.message ? `\nMessage: ${data.message}` : '',
    ].filter(Boolean).join('\n')

    const event = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `${data.service} - ${data.name}`,
        description,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: TIMEZONE,
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: TIMEZONE,
        },
        attendees: [
          { email: data.email, displayName: data.name },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
        status: 'confirmed',
      },
      sendUpdates: 'all',
    })

    return event.data.id || null
  } catch (error) {
    console.error('Failed to create Google Calendar event:', error)
    return null
  }
}

/**
 * Delete a Google Calendar event
 */
export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
  if (!isConfigured() || !eventId) {
    return false
  }

  try {
    const calendar = getCalendarClient()
    const calendarId = process.env.GOOGLE_CALENDAR_ID!

    await calendar.events.delete({
      calendarId,
      eventId,
      sendUpdates: 'all',
    })

    return true
  } catch (error) {
    console.error('Failed to delete Google Calendar event:', error)
    return false
  }
}
