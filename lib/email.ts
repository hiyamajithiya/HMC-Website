import nodemailer from 'nodemailer'

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Contact form email
export async function sendContactEmail(data: {
  name: string
  email: string
  phone?: string
  service?: string
  message: string
}) {
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
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL || 'info@himanshumajithiya.com',
    subject: `New Contact Form Submission from ${data.name}`,
    html: emailHtml,
    replyTo: data.email,
  })

  // Send confirmation email to user
  await transporter.sendMail({
    from: process.env.SMTP_USER,
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
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL || 'info@himanshumajithiya.com',
    subject: `New Appointment Request from ${data.name}`,
    html: emailHtml,
    replyTo: data.email,
  })

  // Send confirmation to user
  await transporter.sendMail({
    from: process.env.SMTP_USER,
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
  await transporter.sendMail({
    from: process.env.SMTP_USER,
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

// Test email connection
export async function testEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify()
    return true
  } catch (error) {
    console.error('Email connection error:', error)
    return false
  }
}
