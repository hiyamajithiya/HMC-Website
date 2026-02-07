import { createTransporter, getSmtpSettings } from '@/lib/email-db'

// Contact form email
export async function sendContactEmail(data: {
  name: string
  email: string
  phone?: string
  service?: string
  message: string
}) {
  const settings = await getSmtpSettings()
  if (!settings) {
    throw new Error('SMTP settings not configured')
  }

  const transporter = await createTransporter()
  const fromAddress = `"${settings.fromName}" <${settings.user}>`

  const emailHtml = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
    ${data.service ? `<p><strong>Service Interest:</strong> ${data.service}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${data.message.replace(/\n/g, '<br>')}</p>
  `

  await transporter.sendMail({
    from: fromAddress,
    to: settings.notificationEmail,
    subject: `New Contact Form Submission from ${data.name}`,
    html: emailHtml,
    replyTo: data.email,
  })

  // Send confirmation email to user
  await transporter.sendMail({
    from: fromAddress,
    to: data.email,
    subject: 'Thank you for contacting Himanshu Majithiya & Co.',
    html: `
      <p>Dear ${data.name},</p>
      <p>Thank you for contacting us. We have received your message and will respond within 24-48 hours.</p>
      <p>Best regards,<br>
      Himanshu Majithiya & Co.<br>
      Chartered Accountants</p>
    `,
  })
}

// Appointment booking email
export async function sendAppointmentEmail(data: {
  name: string
  email: string
  phone: string
  service: string
  date: string
  timeSlot: string
  message?: string
}) {
  const settings = await getSmtpSettings()
  if (!settings) {
    throw new Error('SMTP settings not configured')
  }

  const transporter = await createTransporter()
  const fromAddress = `"${settings.fromName}" <${settings.user}>`

  const emailHtml = `
    <h2>New Appointment Booking</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Service:</strong> ${data.service}</p>
    <p><strong>Preferred Date:</strong> ${data.date}</p>
    <p><strong>Preferred Time:</strong> ${data.timeSlot}</p>
    ${data.message ? `<p><strong>Message:</strong><br>${data.message.replace(/\n/g, '<br>')}</p>` : ''}
  `

  await transporter.sendMail({
    from: fromAddress,
    to: settings.notificationEmail,
    subject: `New Appointment Request from ${data.name}`,
    html: emailHtml,
    replyTo: data.email,
  })

  // Send confirmation to user
  await transporter.sendMail({
    from: fromAddress,
    to: data.email,
    subject: 'Appointment Request Received - Himanshu Majithiya & Co.',
    html: `
      <p>Dear ${data.name},</p>
      <p>We have received your appointment request for <strong>${data.service}</strong> on <strong>${data.date}</strong> at <strong>${data.timeSlot}</strong>.</p>
      <p>We will confirm your appointment within 24 hours.</p>
      <p>If you have any urgent queries, please call us at +91 98795 03465.</p>
      <p>Best regards,<br>
      Himanshu Majithiya & Co.<br>
      Chartered Accountants</p>
    `,
  })
}

// Newsletter subscription email
export async function sendNewsletterConfirmation(email: string, name?: string) {
  const settings = await getSmtpSettings()
  if (!settings) {
    throw new Error('SMTP settings not configured')
  }

  const transporter = await createTransporter()
  const fromAddress = `"${settings.fromName}" <${settings.user}>`

  await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject: 'Newsletter Subscription Confirmed - Himanshu Majithiya & Co.',
    html: `
      <p>Dear ${name || 'Subscriber'},</p>
      <p>Thank you for subscribing to our newsletter. You will receive updates on:</p>
      <ul>
        <li>Tax updates and notifications</li>
        <li>GST compliance deadlines</li>
        <li>New automation tools</li>
        <li>Professional articles and guides</li>
      </ul>
      <p>Best regards,<br>
      Himanshu Majithiya & Co.<br>
      Chartered Accountants</p>
    `,
  })
}

// Password reset email
export async function sendPasswordResetEmail(data: {
  email: string
  name: string | null
  resetUrl: string
}) {
  const settings = await getSmtpSettings()
  if (!settings) {
    throw new Error('SMTP settings not configured')
  }

  const transporter = await createTransporter()
  const fromAddress = `"${settings.fromName}" <${settings.user}>`

  await transporter.sendMail({
    from: fromAddress,
    to: data.email,
    subject: 'Password Reset Request - Himanshu Majithiya & Co.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0a1929 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Himanshu Majithiya & Co.</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0;">Chartered Accountants</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <p style="font-size: 16px; color: #333;">Dear ${data.name || 'Client'},</p>
          <p style="font-size: 16px; color: #333;">We received a request to reset your password for your Client Portal account.</p>
          <p style="font-size: 16px; color: #333;">Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" style="background: #c9a227; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #666;">This link will expire in 1 hour for security reasons.</p>
          <p style="font-size: 14px; color: #666;">If you didn't request a password reset, please ignore this email or contact us if you have concerns.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="font-size: 12px; color: #999; word-break: break-all;">${data.resetUrl}</p>
        </div>
        <div style="background: #1e3a5f; padding: 20px; text-align: center;">
          <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 14px;">
            Best regards,<br>
            Himanshu Majithiya & Co.<br>
            +91 98795 03465 | info@himanshumajithiya.com
          </p>
        </div>
      </div>
    `,
  })
}

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP for tool download verification
export async function sendDownloadOTP(data: {
  name: string
  email: string
  toolName: string
  otp: string
}) {
  const settings = await getSmtpSettings()
  if (!settings) {
    throw new Error('SMTP settings not configured')
  }

  const transporter = await createTransporter()
  const fromAddress = `"${settings.fromName}" <${settings.user}>`

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e3a5f; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .otp-box { background: #1e3a5f; color: white; font-size: 32px; letter-spacing: 8px; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; font-weight: bold; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; background: #f0f0f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Himanshu Majithiya & Co.</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">Chartered Accountants</p>
        </div>
        <div class="content">
          <h2 style="color: #1e3a5f;">Hello ${data.name},</h2>
          <p>You have requested to download <strong>${data.toolName}</strong>.</p>
          <p>Please use the following OTP to verify your email and proceed with the download:</p>
          <div class="otp-box">${data.otp}</div>
          <p style="color: #666;"><strong>This OTP is valid for 10 minutes.</strong></p>
          <p style="color: #999; font-size: 14px;">If you did not request this download, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Himanshu Majithiya & Co. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: fromAddress,
    to: data.email,
    subject: `Your OTP for downloading ${data.toolName} - HMC`,
    html: emailHtml,
  })
}

// Send tool update notification to users who downloaded the tool
export async function sendToolUpdateNotification(data: {
  name: string
  email: string
  toolName: string
  toolSlug: string
  version?: string
}) {
  const settings = await getSmtpSettings()
  if (!settings) {
    throw new Error('SMTP settings not configured')
  }

  const transporter = await createTransporter()
  const fromAddress = `"${settings.fromName}" <${settings.user}>`

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://himanshumajithiya.com'
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e3a5f; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .btn { display: inline-block; background: #c9a227; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; background: #f0f0f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Tool Update Available!</h1>
        </div>
        <div class="content">
          <h2 style="color: #1e3a5f;">Hello ${data.name},</h2>
          <p>Great news! <strong>${data.toolName}</strong>${data.version ? ` (Version ${data.version})` : ''} has been updated.</p>
          <p>You previously downloaded this tool, and a new version is now available with improvements and bug fixes.</p>
          <p style="text-align: center;">
            <a href="${siteUrl}/tools/${data.toolSlug}" class="btn">Download Latest Version</a>
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Himanshu Majithiya & Co. All rights reserved.</p>
          <p style="color: #999;">You're receiving this because you downloaded this tool from our website.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: fromAddress,
    to: data.email,
    subject: `${data.toolName} has been updated!`,
    html: emailHtml,
  })
}
