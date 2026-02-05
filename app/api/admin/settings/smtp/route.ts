import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'

export const dynamic = 'force-dynamic'

// SMTP settings keys
const SMTP_KEYS = ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from_name', 'notification_email']

// Helper to check admin status
async function checkAdmin() {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: 'Unauthorized', status: 401 }
  }

  if (session.user.role !== 'ADMIN') {
    return { error: 'Forbidden', status: 403 }
  }

  return { session }
}

// GET - Get SMTP settings
export async function GET() {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    // Get all SMTP settings
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: { in: SMTP_KEYS },
      },
    })

    // Convert to object and decrypt password
    const settingsObj: Record<string, string> = {}
    for (const setting of settings) {
      if (setting.key === 'smtp_pass') {
        // Don't send actual password, just indicate if it's set
        settingsObj[setting.key] = setting.value ? '********' : ''
      } else {
        settingsObj[setting.key] = setting.value
      }
    }

    return NextResponse.json({
      success: true,
      settings: {
        host: settingsObj.smtp_host || 'smtp.gmail.com',
        port: settingsObj.smtp_port || '587',
        user: settingsObj.smtp_user || '',
        pass: settingsObj.smtp_pass || '',
        fromName: settingsObj.smtp_from_name || 'Himanshu Majithiya & Co.',
        notificationEmail: settingsObj.notification_email || '',
      },
    })
  } catch (error) {
    console.error('Failed to get SMTP settings:', error)
    return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 })
  }
}

// POST - Save SMTP settings
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const body = await request.json()
    const { host, port, user, pass, fromName, notificationEmail } = body

    // Validate required fields
    if (!host || !port || !user) {
      return NextResponse.json(
        { error: 'Host, port, and user are required' },
        { status: 400 }
      )
    }

    // Prepare settings to save
    const settingsToSave = [
      { key: 'smtp_host', value: host },
      { key: 'smtp_port', value: port.toString() },
      { key: 'smtp_user', value: user },
      { key: 'smtp_from_name', value: fromName || 'Himanshu Majithiya & Co.' },
      { key: 'notification_email', value: notificationEmail || user },
    ]

    // Only update password if a new one is provided (not the masked value)
    if (pass && pass !== '********') {
      // Encrypt the password before storing
      const encryptedPass = encrypt(pass)
      settingsToSave.push({ key: 'smtp_pass', value: encryptedPass })
    }

    // Upsert each setting
    for (const setting of settingsToSave) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'SMTP settings saved successfully',
    })
  } catch (error) {
    console.error('Failed to save SMTP settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}

// POST to test SMTP connection
export async function PUT(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin()
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const body = await request.json()
    const { testEmail } = body

    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email address is required' },
        { status: 400 }
      )
    }

    // Import the email test function
    const { testSmtpConnection, sendTestEmail } = await import('@/lib/email-db')

    // Test connection
    const connectionTest = await testSmtpConnection()
    if (!connectionTest.success) {
      return NextResponse.json(
        { error: `Connection failed: ${connectionTest.error}` },
        { status: 400 }
      )
    }

    // Send test email
    const emailResult = await sendTestEmail(testEmail)
    if (!emailResult.success) {
      return NextResponse.json(
        { error: `Failed to send test email: ${emailResult.error}` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${testEmail}`,
    })
  } catch (error) {
    console.error('SMTP test failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'SMTP test failed' },
      { status: 500 }
    )
  }
}
