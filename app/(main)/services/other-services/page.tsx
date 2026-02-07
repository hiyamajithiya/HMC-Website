import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, CheckCircle, ArrowRight } from "lucide-react"
import { generateServiceSchema, generateBreadcrumbSchema } from "@/lib/schema"

export const metadata: Metadata = {
  title: "Other Services",
  description: "ROC compliance, LEI registration, MSME registration, and other professional services by CA Himanshu Majithiya in Ahmedabad.",
}

const serviceSchema = generateServiceSchema({
  name: "Other Professional Services",
  description: "ROC compliance, LEI registration, MSME registration, and other professional services.",
  url: "/services/other-services",
})

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Services", url: "/services" },
  { name: "Other Services", url: "/services/other-services" },
])

export default function OtherServicesPage() {
  const services = [
    {
      title: "ROC Compliance",
      items: [
        "Annual filing of financial statements",
        "DIR-3 KYC and DIN compliance",
        "Board meeting compliance",
        "AGM compliance",
        "Share capital and debenture forms",
        "Charge creation and modification",
      ],
    },
    {
      title: "Company Law Matters",
      items: [
        "Company incorporation",
        "LLP formation",
        "Change of directors",
        "Name change and registered office change",
        "Increase in authorized capital",
        "Closure and strike-off",
      ],
    },
    {
      title: "Registration Services",
      items: [
        "LEI (Legal Entity Identifier) registration",
        "MSME/Udyam registration",
        "Import Export Code (IEC)",
        "Professional tax registration",
        "Shops and establishment registration",
        "Trade license assistance",
      ],
    },
    {
      title: "Other Professional Services",
      items: [
        "Financial statement preparation",
        "Bookkeeping services",
        "Payroll processing",
        "Project report preparation",
        "Due diligence",
        "Business valuation assistance",
      ],
    },
  ]

  const additionalServices = [
    "TDS return filing and compliance",
    "Form 16/16A issuance",
    "Lower deduction certificate applications",
    "PF and ESI compliance",
    "Partnership deed drafting",
    "Trust deed preparation",
  ]

  return (
    <div>
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Other Services
            </h1>
            <p className="text-xl text-white/90 mb-6">
              ROC compliance, registrations, and other professional accounting services
            </p>
            <Link href="/book-appointment">
              <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white">
                Schedule Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                In addition to core services, the firm provides various other professional services
                including ROC compliance, company law matters, registration services, and general
                accounting and compliance support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <h2 className="text-3xl font-heading font-bold text-primary mb-12 text-center">
            Professional Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2 text-text-secondary">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
              Additional Services
            </h2>
            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {additionalServices.map((service, index) => (
                    <div key={index} className="flex items-start space-x-3 text-text-secondary">
                      <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Types */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
              Registration Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-lg font-bold text-primary mb-2">LEI</div>
                  <div className="text-sm text-text-muted">Legal Entity Identifier</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-lg font-bold text-primary mb-2">MSME</div>
                  <div className="text-sm text-text-muted">Udyam Registration</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-lg font-bold text-primary mb-2">IEC</div>
                  <div className="text-sm text-text-muted">Import Export Code</div>
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
              Professional Support for Your Business
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get assistance for compliance, registrations, and business services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-appointment">
                <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white">
                  Book Appointment
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
