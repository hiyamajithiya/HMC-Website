import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { SITE_INFO } from "@/lib/constants"
import { prisma } from "@/lib/prisma"
import { sendContactEmail } from "@/lib/email"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { notifyRole } from "@/lib/push-notifications"

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 contact submissions per minute per IP
    const ip = getClientIp(request)
    const rateLimit = checkRateLimit(`contact:${ip}`, { max: 5, windowSeconds: 60 })
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Verify email was confirmed via OTP
    const verification = await prisma.emailVerification.findFirst({
      where: {
        email: email.toLowerCase(),
        purpose: 'contact',
        verified: true,
        createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) }, // within last 30 min
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!verification) {
      return NextResponse.json(
        { error: "Please verify your email address before submitting." },
        { status: 403 }
      )
    }

    // Save contact submission to database first (this always happens)
    const contact = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone,
        service: subject,
        message,
      },
    })

    // Try to send email only if RESEND_API_KEY is properly configured
    const resendApiKey = process.env.RESEND_API_KEY
    const isResendConfigured = resendApiKey && resendApiKey !== 'your_resend_api_key_here' && resendApiKey.startsWith('re_')

    if (isResendConfigured) {
      try {
        const resend = new Resend(resendApiKey)

        // Send email to the firm
        await resend.emails.send({
          from: "Contact Form <noreply@himanshumajithiya.com>",
          to: [SITE_INFO.email.primary],
          replyTo: email,
          subject: `New Contact Form Submission: ${subject}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background-color: #1a365d; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                  .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
                  .field { margin-bottom: 20px; }
                  .label { font-weight: 600; color: #1a365d; margin-bottom: 5px; display: block; }
                  .value { background-color: white; padding: 12px; border-radius: 4px; border: 1px solid #e0e0e0; }
                  .message-box { background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #d69e2e; white-space: pre-wrap; word-wrap: break-word; }
                  .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="header">
                  <h2 style="margin: 0;">New Contact Form Submission</h2>
                  <p style="margin: 5px 0 0 0; opacity: 0.9;">From ${SITE_INFO.name} Website</p>
                </div>
                <div class="content">
                  <div class="field"><span class="label">Name:</span><div class="value">${name}</div></div>
                  <div class="field"><span class="label">Email:</span><div class="value"><a href="mailto:${email}" style="color: #1a365d; text-decoration: none;">${email}</a></div></div>
                  <div class="field"><span class="label">Phone:</span><div class="value"><a href="tel:${phone}" style="color: #1a365d; text-decoration: none;">${phone}</a></div></div>
                  <div class="field"><span class="label">Subject:</span><div class="value">${subject}</div></div>
                  <div class="field"><span class="label">Message:</span><div class="message-box">${message}</div></div>
                  <div class="footer">
                    <p>This email was sent from the contact form on ${SITE_INFO.domain}</p>
                    <p>You can reply directly to this email to respond to ${name}</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        })

        // Send auto-reply to the user
        await resend.emails.send({
          from: `${SITE_INFO.name} <noreply@himanshumajithiya.com>`,
          to: [email],
          subject: `Thank you for contacting ${SITE_INFO.name}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background-color: #1a365d; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                  .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
                  .highlight { background-color: #fff3cd; border-left: 4px solid #d69e2e; padding: 15px; margin: 20px 0; border-radius: 4px; }
                  .contact-info { background-color: white; padding: 15px; border-radius: 4px; margin: 20px 0; }
                  .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="header">
                  <h2 style="margin: 0;">${SITE_INFO.name}</h2>
                  <p style="margin: 5px 0 0 0; opacity: 0.9;">Chartered Accountants</p>
                </div>
                <div class="content">
                  <p>Dear ${name},</p>
                  <p>Thank you for contacting <strong>${SITE_INFO.name}</strong>. We have received your message and will get back to you within 24 hours.</p>
                  <div class="highlight"><strong>Your Inquiry:</strong><br>Subject: ${subject}</div>
                  <p>If you need immediate assistance, please feel free to contact us:</p>
                  <div class="contact-info">
                    <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${SITE_INFO.phone.primary}" style="color: #1a365d; text-decoration: none;">${SITE_INFO.phone.primary}</a></p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${SITE_INFO.email.primary}" style="color: #1a365d; text-decoration: none;">${SITE_INFO.email.primary}</a></p>
                    <p style="margin: 5px 0;"><strong>Office Hours:</strong> ${SITE_INFO.officeHours}</p>
                  </div>
                  <p>Best regards,<br><strong>${SITE_INFO.proprietor}</strong><br>${SITE_INFO.name}<br>ICAI Membership: ${SITE_INFO.icaiMembership}</p>
                  <div class="footer">
                    <p>This is an automated confirmation email. Please do not reply to this email.</p>
                    <p>${SITE_INFO.address.line1}, ${SITE_INFO.address.line2}<br>${SITE_INFO.address.city}, ${SITE_INFO.address.state} - ${SITE_INFO.address.pincode}</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        })
      } catch (emailError) {
        // Log email error but don't fail the request since contact was saved
        console.error("Email sending failed:", emailError)
      }
    } else {
      // Fallback to Gmail SMTP if Resend is not configured
      const smtpUser = process.env.SMTP_USER
      const smtpPass = process.env.SMTP_PASS

      if (smtpUser && smtpPass) {
        try {
          await sendContactEmail({
            name,
            email,
            phone,
            service: subject,
            message,
          })
          console.log("Email sent via Gmail SMTP")
        } catch (smtpError) {
          console.error("Gmail SMTP email failed:", smtpError)
        }
      } else {
        console.log("No email service configured - skipping email notification")
      }
    }

    // Clean up used verification record
    await prisma.emailVerification.deleteMany({
      where: {
        email: email.toLowerCase(),
        purpose: 'contact',
      },
    })

    // Push notification to admins about new contact
    notifyRole('ADMIN', 'New Contact', `${name} sent a message about "${subject}".`, {
      type: 'contact',
      contactId: contact.id,
    }).catch(err => console.error('Push notification failed:', err))

    // Always return success since the contact was saved to the database
    return NextResponse.json(
      {
        success: true,
        message: "Thank you for contacting us! Your message has been received successfully. Our team will review your inquiry and get back to you shortly.",
        contactId: contact.id
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    )
  }
}
