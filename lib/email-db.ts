import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'

// Cache for SMTP settings (refresh every 5 minutes)
let smtpSettingsCache: {
  settings: SmtpSettings | null
  timestamp: number
} = {
  settings: null,
  timestamp: 0,
}

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

interface SmtpSettings {
  host: string
  port: number
  user: string
  pass: string
  fromName: string
  notificationEmail: string
}

// Get SMTP settings from database (with caching)
export async function getSmtpSettings(): Promise<SmtpSettings | null> {
  const now = Date.now()

  // Return cached settings if still valid
  if (smtpSettingsCache.settings && now - smtpSettingsCache.timestamp < CACHE_TTL) {
    return smtpSettingsCache.settings
  }

  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from_name', 'notification_email'],
        },
      },
    })

    if (settings.length === 0) {
      // No database settings, fall back to environment variables
      const envSettings = getEnvSmtpSettings()
      if (envSettings) {
        smtpSettingsCache = { settings: envSettings, timestamp: now }
        return envSettings
      }
      return null
    }

    const settingsMap: Record<string, string> = {}
    for (const s of settings) {
      settingsMap[s.key] = s.value
    }

    // Decrypt password
    const decryptedPass = settingsMap.smtp_pass ? decrypt(settingsMap.smtp_pass) : ''

    const smtpSettings: SmtpSettings = {
      host: settingsMap.smtp_host || 'smtp.gmail.com',
      port: parseInt(settingsMap.smtp_port || '587'),
      user: settingsMap.smtp_user || '',
      pass: decryptedPass,
      fromName: settingsMap.smtp_from_name || 'Himanshu Majithiya & Co.',
      notificationEmail: settingsMap.notification_email || settingsMap.smtp_user || '',
    }

    // Only cache if user is configured
    if (smtpSettings.user && smtpSettings.pass) {
      smtpSettingsCache = { settings: smtpSettings, timestamp: now }
      return smtpSettings
    }

    // Fall back to env variables
    const envSettings = getEnvSmtpSettings()
    if (envSettings) {
      smtpSettingsCache = { settings: envSettings, timestamp: now }
      return envSettings
    }

    return null
  } catch (error) {
    console.error('Failed to get SMTP settings from database:', error)
    // Fall back to environment variables
    return getEnvSmtpSettings()
  }
}

// Get SMTP settings from environment variables (fallback)
function getEnvSmtpSettings(): SmtpSettings | null {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!user || !pass) {
    return null
  }

  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user,
    pass,
    fromName: 'Himanshu Majithiya & Co.',
    notificationEmail: process.env.NOTIFICATION_EMAIL || user,
  }
}

// Create transporter with current settings
export async function createTransporter() {
  const settings = await getSmtpSettings()

  if (!settings) {
    throw new Error('SMTP settings not configured')
  }

  return nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.port === 465,
    auth: {
      user: settings.user,
      pass: settings.pass,
    },
  })
}

// Test SMTP connection
export async function testSmtpConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = await createTransporter()
    await transporter.verify()
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Connection failed',
    }
  }
}

// Send test email
export async function sendTestEmail(to: string): Promise<{ success: boolean; error?: string }> {
  try {
    const settings = await getSmtpSettings()
    if (!settings) {
      return { success: false, error: 'SMTP settings not configured' }
    }

    const transporter = await createTransporter()

    await transporter.sendMail({
      from: `"${settings.fromName}" <${settings.user}>`,
      to,
      subject: 'Test Email - SMTP Configuration',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e3a5f; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; color: #155724; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">SMTP Test Successful!</h1>
            </div>
            <div class="content">
              <div class="success">
                <strong>Your SMTP configuration is working correctly.</strong>
              </div>
              <p style="margin-top: 20px;">This test email confirms that:</p>
              <ul>
                <li>SMTP host: ${settings.host}</li>
                <li>SMTP port: ${settings.port}</li>
                <li>Authentication: Successful</li>
                <li>Email delivery: Working</li>
              </ul>
              <p>You can now receive email notifications for contact forms, appointments, and tool downloads.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}

// Clear settings cache (call this when settings are updated)
export function clearSmtpCache() {
  smtpSettingsCache = { settings: null, timestamp: 0 }
}
