import { Metadata } from "next"
import { Calendar, Clock, CheckCircle, Video, MapPin, Phone } from "lucide-react"
import { SITE_INFO } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Book Appointment | Himanshu Majithiya & Co.",
  description: "Schedule a consultation with our experienced Chartered Accountants. Book your appointment online and get expert advice on taxation, audit, compliance, and financial matters.",
}

export default function BookAppointmentPage() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <Calendar className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
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
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
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
              <h3 className="font-semibold mb-2">Instant Confirmation</h3>
              <p className="text-sm text-text-secondary">
                Get immediate booking confirmation via email
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

      {/* Calendly Embed Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Calendly Widget */}
              <div className="calendly-inline-widget"
                   data-url="https://calendly.com/himanshumajithiya/30min"
                   style={{ minWidth: '320px', height: '700px' }}>
              </div>
            </div>
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

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Before the Appointment
                </h3>
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Select a convenient time slot from the calendar above</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Fill in your contact details and the reason for consultation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Receive instant confirmation email with meeting details</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
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
                    <span className="text-primary mt-1">•</span>
                    <span>Discuss your taxation, audit, or compliance needs</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Get expert advice tailored to your specific situation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Understand our service offerings and engagement process</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
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

            <div className="grid md:grid-cols-3 gap-6">
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
                  {SITE_INFO.address.street}<br />
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

      {/* Calendly Script */}
      <script
        type="text/javascript"
        src="https://assets.calendly.com/assets/external/widget.js"
        async
      />
    </div>
  )
}
