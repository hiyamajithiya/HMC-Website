import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ClipboardCheck, Building2, Bot, Receipt, Briefcase } from "lucide-react"
import { SERVICES } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Services",
  description: "Professional services offered by Himanshu Majithiya & Co. including Income Tax, Audit, FFMC Compliance, GST, and AI Automation services in Ahmedabad.",
}

const iconMap: Record<string, any> = {
  FileText,
  ClipboardCheck,
  Building2,
  Bot,
  Receipt,
  Briefcase,
}

export default function ServicesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4">
              Areas of Practice
            </h1>
            <p className="text-xl text-white/90">
              The firm provides professional services in the following areas
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {SERVICES.map((service) => {
              const Icon = iconMap[service.icon] || Briefcase
              return (
                <Link key={service.id} href={service.slug}>
                  <Card className="card-hover h-full border-2 border-transparent hover:border-primary/20">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl font-heading">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-text-secondary">
                        {service.description}
                      </CardDescription>
                      <div className="mt-4 text-primary font-medium text-sm">
                        Learn More →
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
              Service Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">17+</div>
                  <div className="text-sm text-text-muted">Years of Practice</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">Professional</div>
                  <div className="text-sm text-text-muted">ICAI Registered</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">Specialized</div>
                  <div className="text-sm text-text-muted">Expert Team</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Need Professional Assistance?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Contact us to discuss your requirements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-appointment">
                <button className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                  Book Appointment
                </button>
              </Link>
              <Link href="/contact">
                <button className="bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
