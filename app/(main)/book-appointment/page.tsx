"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, Clock, CheckCircle, Video, MapPin, Phone, Send, ExternalLink, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SITE_INFO } from "@/lib/constants"

const services = [
  "Income Tax Filing & Planning",
  "GST Registration & Compliance",
  "Company Registration",
  "Audit & Assurance",
  "Business Consultation",
  "Financial Advisory",
  "Other"
]

const timeSlots = [
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

export default function BookAppointmentPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    timeSlot: "",
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

  // Get minimum date (today)
  const today = new Date()
  const minDate = today.toISOString().split('T')[0]

  // Get maximum date (3 months from now)
  const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]

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
          purpose: "appointment",
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
          purpose: "appointment",
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
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to book appointment")
      }

      setSubmitted(true)
    } catch (err) {
      console.error("Appointment booking error:", err)
      setError(err instanceof Error ? err.message : "Failed to book appointment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", service: "", date: "", timeSlot: "", message: "" })
    setSubmitted(false)
    setOtpSent(false)
    setOtpVerified(false)
    setOtp(["", "", "", "", "", ""])
    setOtpError("")
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <Calendar className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Book Your Appointment
            </h1>
            <p className="text-xl text-white/90">
              Schedule a consultation with our expert Chartered Accountants at your convenience
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Timing</h3>
              <p className="text-sm text-text-secondary">
                Choose a time that works best for you
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Virtual or In-Person</h3>
              <p className="text-sm text-text-secondary">
                Meet us online or visit our office
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Quick Confirmation</h3>
              <p className="text-sm text-text-secondary">
                Get appointment confirmation within 24 hours
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Expert Advice</h3>
              <p className="text-sm text-text-secondary">
                Get professional guidance from experienced CAs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Schedule Your Consultation</CardTitle>
                <p className="text-sm text-text-muted mt-2">
                  Fill out the form below and we&apos;ll confirm your appointment within 24 hours
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
                      Appointment Request Received!
                    </h3>
                    <p className="text-green-700 mb-2">
                      Thank you for scheduling an appointment with us.
                    </p>
                    <p className="text-sm text-green-600 mb-6">
                      Our team will review your request and confirm your appointment within 24 hours. You will receive a confirmation email with meeting details.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="border-green-600 text-green-700 hover:bg-green-50"
                      >
                        Book Another Appointment
                      </Button>
                      <a
                        href="https://calendly.com/himanshumajithiya/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="bg-primary hover:bg-primary-light w-full sm:w-auto">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Schedule via Calendly
                        </Button>
                      </a>
                    </div>
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

                    {/* Service */}
                    <div className="space-y-2">
                      <Label htmlFor="service">
                        Service Required <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">
                          Preferred Date <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          min={minDate}
                          max={maxDate}
                          value={formData.date}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeSlot">
                          Preferred Time <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id="timeSlot"
                          name="timeSlot"
                          value={formData.timeSlot}
                          onChange={handleChange}
                          required
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="">Select a time slot</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Additional Message <span className="text-text-muted">(Optional)</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your requirements or any specific questions..."
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
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
                          Booking...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Book Appointment
                        </>
                      )}
                    </Button>

                    {!otpVerified && (
                      <p className="text-xs text-amber-600 text-center font-medium">
                        Please verify your email address to enable booking
                      </p>
                    )}

                    <p className="text-xs text-text-muted text-center">
                      By submitting this form, you agree to our privacy policy. We&apos;ll contact you to confirm your appointment.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              What to Expect
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Before the Appointment
                </h3>
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">&#8226;</span>
                    <span>Fill out the booking form with your preferred date and time</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">&#8226;</span>
                    <span>Receive confirmation email with meeting details</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">&#8226;</span>
                    <span>Prepare any relevant documents or questions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">&#8226;</span>
                    <span>Get reminder notifications before your appointment</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  During the Consultation
                </h3>
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">&#8226;</span>
                    <span>Discuss your taxation, audit, or compliance needs</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">&#8226;</span>
                    <span>Get expert advice tailored to your specific situation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">&#8226;</span>
                    <span>Understand our service offerings and engagement process</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">&#8226;</span>
                    <span>Receive a customized action plan for your requirements</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">
              Need Immediate Assistance?
            </h2>
            <p className="text-text-secondary mb-8">
              If you have urgent queries or prefer to speak with us directly, feel free to reach out:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Phone</h3>
                <a
                  href={`tel:${SITE_INFO.phone.primary}`}
                  className="text-primary hover:underline"
                >
                  {SITE_INFO.phone.primary}
                </a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="text-sm text-text-secondary">
                  {SITE_INFO.address.line1}<br />
                  {SITE_INFO.address.line2}<br />
                  {SITE_INFO.address.city}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Video className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Office Hours</h3>
                <p className="text-sm text-text-secondary">
                  Monday - Saturday<br />
                  10:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
