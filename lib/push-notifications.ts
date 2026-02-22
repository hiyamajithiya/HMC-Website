import { prisma } from '@/lib/prisma'

interface ExpoPushMessage {
  to: string
  title: string
  body: string
  data?: Record<string, unknown>
  sound?: 'default' | null
  badge?: number
  channelId?: string
}

interface ExpoPushTicket {
  status: 'ok' | 'error'
  id?: string
  message?: string
  details?: Record<string, unknown>
}

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

/**
 * Send push notifications via Expo Push API
 */
async function sendExpoPush(messages: ExpoPushMessage[]): Promise<ExpoPushTicket[]> {
  if (messages.length === 0) return []

  try {
    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    })

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Expo Push API error:', error)
    return []
  }
}

/**
 * Send a push notification to a specific user
 */
export async function notifyUser(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<void> {
  const tokens = await prisma.pushToken.findMany({
    where: { userId },
  })

  if (tokens.length === 0) return

  const messages: ExpoPushMessage[] = tokens.map(t => ({
    to: t.token,
    title,
    body,
    sound: 'default' as const,
    data,
  }))

  const tickets = await sendExpoPush(messages)

  // Clean up invalid tokens
  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i]
    if (ticket.status === 'error' && ticket.details) {
      const errorType = (ticket.details as any).error
      if (errorType === 'DeviceNotRegistered') {
        await prisma.pushToken.deleteMany({
          where: { token: tokens[i].token },
        })
      }
    }
  }
}

/**
 * Send a push notification to all users with a specific role
 */
export async function notifyRole(
  role: 'ADMIN' | 'CLIENT',
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<void> {
  const tokens = await prisma.pushToken.findMany({
    where: {
      user: { role, isActive: true },
    },
    include: { user: { select: { id: true } } },
  })

  if (tokens.length === 0) return

  const messages: ExpoPushMessage[] = tokens.map(t => ({
    to: t.token,
    title,
    body,
    sound: 'default' as const,
    data,
  }))

  const tickets = await sendExpoPush(messages)

  // Clean up invalid tokens
  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i]
    if (ticket.status === 'error' && ticket.details) {
      const errorType = (ticket.details as any).error
      if (errorType === 'DeviceNotRegistered') {
        await prisma.pushToken.deleteMany({
          where: { token: tokens[i].token },
        })
      }
    }
  }
}
