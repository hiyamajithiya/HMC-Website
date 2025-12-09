import Link from "next/link"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ClipboardCheck, Building2, Bot, Receipt, Briefcase, Calendar, Calculator } from "lucide-react"
import { SITE_INFO, SERVICES } from "@/lib/constants"
import { generateMetadata as createMetadata } from "@/lib/metadata"
import { organizationSchema, localBusinessSchema } from "@/lib/schema"

export const metadata: Metadata = createMetadata({
  title: `${SITE_INFO.name} - Chartered Accountants in Ahmedabad`,
  description: SITE_INFO.description,
  path: '/',
})

const iconMap: Record<string, any> = {
  FileText,
  ClipboardCheck,
  Building2,
  Bot,
  Receipt,
  Briefcase,
}

export default function HomePage() {
  return (
    <div>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      {/* Hero Section */}
      <section className="gradient-navy text-white py-20 md:py-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              {SITE_INFO.name}
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-white/90">
              Chartered Accountants
            </p>
            <p className="text-lg mb-8 text-white/80">
              Practicing Since {SITE_INFO.yearEstablished}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-appointment">
                <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white">
                  Book Appointment
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-primary">
              About the Firm
            </h2>
            <p className="text-text-secondary text-lg mb-4">
              {SITE_INFO.name} is a proprietorship firm of Chartered Accountants established in {SITE_INFO.yearEstablished},
              located in Ahmedabad, Gujarat. The firm is registered with the Institute of Chartered Accountants of India (ICAI).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 max-w-xl mx-auto">
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-primary mb-2">17+</div>
                <div className="text-sm text-text-muted">Years of Practice</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-primary mb-2">{SITE_INFO.yearEstablished}</div>
                <div className="text-sm text-text-muted">Established</div>
              </div>
            </div>
            <Link href="/about">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary">
              Areas of Practice
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              The firm provides professional services in the following areas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => {
              const Icon = iconMap[service.icon] || Briefcase
              return (
                <Card key={service.id} className="card-hover border-border-light">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-heading">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-text-secondary mb-4">
                      {service.description}
                    </CardDescription>
                    <Link href={service.slug} className="text-primary hover:text-primary-light font-medium text-sm">
                      Learn More →
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Resources Section */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary">
              Resources & Tools
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Access professional resources and tools for tax planning and compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Tax Calculators</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  Free online calculators for Income Tax, GST, TDS, and EMI calculations
                </p>
                <Link href="/resources/calculators" className="text-primary hover:text-primary-light font-medium text-sm">
                  View Calculators →
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Compliance Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  Stay updated with Income Tax, GST, ROC, and other compliance due dates
                </p>
                <Link href="/resources/compliance-calendar" className="text-primary hover:text-primary-light font-medium text-sm">
                  View Calendar →
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Automation Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  Download automation tools for document processing and workflow optimization
                </p>
                <Link href="/tools" className="text-primary hover:text-primary-light font-medium text-sm">
                  Browse Tools →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="section-padding gradient-navy text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Get in Touch
            </h2>
            <p className="text-xl mb-4 text-white/90">
              {SITE_INFO.address.line1}, {SITE_INFO.address.line2}
            </p>
            <p className="text-lg mb-8 text-white/80">
              {SITE_INFO.address.city}, {SITE_INFO.address.state} - {SITE_INFO.address.pincode}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${SITE_INFO.phone.primary}`}>
                <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white">
                  Call: {SITE_INFO.phone.primary}
                </Button>
              </a>
              <a href={`mailto:${SITE_INFO.email.primary}`}>
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  Email Us
                </Button>
              </a>
            </div>
            <div className="mt-8 text-sm text-white/70">
              <p>{SITE_INFO.officeHours}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
