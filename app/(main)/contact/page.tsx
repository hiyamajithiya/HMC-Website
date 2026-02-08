"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck } from "lucide-react"
import { SITE_INFO } from "@/lib/constants"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // OTP verification state
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [resendCooldown, setResendCooldown] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Reset OTP state when email changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setFormData({ ...formData, email: newEmail })
    if (otpSent || otpVerified) {
      setOtpSent(false)
      setOtpVerified(false)
      setOtp(["", "", "", "", "", ""])
      setOtpError("")
    }
  }

  const sendOtp = async () => {
    if (!formData.name || !formData.email) {
      setOtpError("Please enter your name and email first")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setOtpError("Please enter a valid email address")
      return
    }

    setOtpLoading(true)
    setOtpError("")

    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          purpose: "contact",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP")
      }

      setOtpSent(true)
      setResendCooldown(30)
      setOtp(["", "", "", "", "", ""])
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : "Failed to send OTP")
    } finally {
      setOtpLoading(false)
    }
  }

  const verifyOtp = async (otpValue?: string) => {
    const otpString = otpValue || otp.join("")
    if (otpString.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP")
      return
    }

    setOtpLoading(true)
    setOtpError("")

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: otpString,
          purpose: "contact",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP")
      }

      setOtpVerified(true)
      setOtpError("")
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : "Failed to verify OTP")
    } finally {
      setOtpLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all 6 digits entered
    const otpString = newOtp.join("")
    if (otpString.length === 6) {
      verifyOtp(otpString)
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length === 6) {
      const newOtp = pasted.split("")
      setOtp(newOtp)
      otpRefs.current[5]?.focus()
      verifyOtp(pasted)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otpVerified) {
      setError("Please verify your email address first")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      setSubmitted(true)

      // Reset form after 15 seconds
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
        setSubmitted(false)
        setOtpSent(false)
        setOtpVerified(false)
        setOtp(["", "", "", "", "", ""])
      }, 15000)
    } catch (err) {
      console.error("Form submission error:", err)
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-white/90">
              Get in touch with us for professional accounting and tax services
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information and Form */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Office Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-text-secondary">{SITE_INFO.address.line1}</p>
                        <p className="text-sm text-text-secondary">{SITE_INFO.address.line2}</p>
                        <p className="text-sm text-text-secondary">
                          {SITE_INFO.address.city}, {SITE_INFO.address.state} {SITE_INFO.address.pincode}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Contact Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <a
                          href={`tel:${SITE_INFO.phone.primary}`}
                          className="text-sm text-text-secondary hover:text-primary"
                        >
                          {SITE_INFO.phone.primary}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <a
                          href={`mailto:${SITE_INFO.email.primary}`}
                          className="text-sm text-text-secondary hover:text-primary break-all"
                        >
                          {SITE_INFO.email.primary}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Office Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="text-sm text-text-secondary space-y-1">
                        <p>Monday - Friday: 10:00 AM - 6:00 PM</p>
                        <p>Saturday: 10:00 AM - 2:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Send us a Message</CardTitle>
                    <p className="text-sm text-text-muted mt-2">
                      Fill out the form below and we&apos;ll get back to you within 24 hours
                    </p>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <div className="bg-green-50 border border-green-200 p-8 rounded-lg text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-green-800 mb-3">
                          Thank You for Contacting Us!
                        </h3>
                        <p className="text-green-700 mb-2">
                          Your message has been received successfully.
                        </p>
                        <p className="text-sm text-green-600">
                          Our team will review your inquiry and get back to you shortly. We typically respond within 24 hours during business days.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r">
                            <p className="text-sm text-red-700">{error}</p>
                          </div>
                        )}
                        {/* Name */}
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        {/* Email with OTP Verification */}
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Email Address <span className="text-red-500">*</span>
                          </Label>
                          <div className="flex gap-2">
                            <div className="flex-1 relative">
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={formData.email}
                                onChange={handleEmailChange}
                                required
                                disabled={otpVerified}
                                className={otpVerified ? "border-green-500 bg-green-50 pr-10" : ""}
                              />
                              {otpVerified && (
                                <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
                              )}
                            </div>
                            {!otpVerified && (
                              <Button
                                type="button"
                                onClick={sendOtp}
                                disabled={otpLoading || !formData.email || !formData.name || resendCooldown > 0}
                                variant="outline"
                                className="whitespace-nowrap border-primary text-primary hover:bg-primary/10"
                              >
                                {otpLoading ? "Sending..." : otpSent ? (resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend OTP") : "Verify Email"}
                              </Button>
                            )}
                          </div>

                          {/* OTP Input */}
                          {otpSent && !otpVerified && (
                            <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm text-blue-800 mb-3">
                                Enter the 6-digit OTP sent to <strong>{formData.email}</strong>
                              </p>
                              <div className="flex gap-2 justify-center mb-2">
                                {otp.map((digit, index) => (
                                  <input
                                    key={index}
                                    ref={(el) => { otpRefs.current[index] = el }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    onPaste={index === 0 ? handleOtpPaste : undefined}
                                    className="w-10 h-12 text-center text-lg font-bold border-2 border-blue-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    disabled={otpLoading}
                                  />
                                ))}
                              </div>
                              {otpError && (
                                <p className="text-sm text-red-600 text-center">{otpError}</p>
                              )}
                              {otpLoading && (
                                <p className="text-sm text-blue-600 text-center">Verifying...</p>
                              )}
                            </div>
                          )}

                          {/* Verified Badge */}
                          {otpVerified && (
                            <p className="text-sm text-green-600 flex items-center gap-1">
                              <ShieldCheck className="h-4 w-4" />
                              Email verified successfully
                            </p>
                          )}

                          {/* OTP Error when not in OTP box */}
                          {!otpSent && otpError && (
                            <p className="text-sm text-red-600">{otpError}</p>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            Phone Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        {/* Subject */}
                        <div className="space-y-2">
                          <Label htmlFor="subject">
                            Subject <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            placeholder="What is this regarding?"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                          <Label htmlFor="message">
                            Message <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Tell us about your requirements..."
                            value={formData.message}
                            onChange={handleChange}
                            rows={6}
                            required
                            className="resize-none"
                          />
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary-light text-white"
                          size="lg"
                          disabled={loading || !otpVerified}
                        >
                          {loading ? (
                            <>
                              <span className="animate-spin mr-2">&#9203;</span>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>

                        {!otpVerified && (
                          <p className="text-xs text-amber-600 text-center font-medium">
                            Please verify your email address to enable submission
                          </p>
                        )}

                        <p className="text-xs text-text-muted text-center">
                          By submitting this form, you agree to our privacy policy
                        </p>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
              Find Us on Map
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="w-full h-[300px] md:h-[450px] rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.3627419693564!2d72.51234137539418!3d23.04632197916259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b4b8b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sMaple%20Trade%20Centre!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location - Maple Trade Centre, Thaltej, Ahmedabad"
                  />
                </div>
                <div className="p-6 bg-primary/5">
                  <p className="text-sm text-text-secondary text-center">
                    <a
                      href="https://maps.google.com/?q=Maple+Trade+Centre+Thaltej+Ahmedabad"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Open in Google Maps &rarr;
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
              Other Ways to Reach Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="text-center card-hover cursor-pointer">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
                  <p className="text-sm text-text-muted mb-4">
                    Quick queries and instant communication
                  </p>
                  <a
                    href={`https://wa.me/919327438099?text=Hello, I would like to inquire about your services`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium hover:underline"
                  >
                    Chat on WhatsApp &rarr;
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center card-hover cursor-pointer">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                  <p className="text-sm text-text-muted mb-4">
                    For detailed inquiries and documentation
                  </p>
                  <a
                    href={`mailto:${SITE_INFO.email.primary}`}
                    className="text-primary font-medium hover:underline"
                  >
                    Send an Email &rarr;
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
