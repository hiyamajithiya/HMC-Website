import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Receipt, CheckCircle, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "GST Services",
  description: "GST registration, return filing, reconciliation, audit, and advisory services by CA Himanshu Majithiya in Ahmedabad.",
}

export default function GSTServicesPage() {
  const services = [
    {
      title: "GST Registration & Compliance",
      items: [
        "New GST registration",
        "Amendments in registration",
        "Cancellation of registration",
        "LUT filing",
        "ITC-04 filing",
        "Annual return filing (GSTR-9)",
      ],
    },
    {
      title: "GST Return Filing",
      items: [
        "GSTR-1 (Outward supplies)",
        "GSTR-3B (Monthly summary)",
        "GSTR-4 (Composition scheme)",
        "GSTR-5 (Non-resident taxable person)",
        "GSTR-6 (Input service distributor)",
        "GSTR-9C (Reconciliation statement)",
      ],
    },
    {
      title: "GST Reconciliation & Audit",
      items: [
        "GSTR-2A vs Purchase register reconciliation",
        "GSTR-1 vs GSTR-3B reconciliation",
        "ITC reconciliation",
        "Annual reconciliation",
        "GST audit assistance",
        "Error identification and rectification",
      ],
    },
    {
      title: "GST Advisory",
      items: [
        "GST impact analysis",
        "Input tax credit optimization",
        "Classification and HSN code",
        "Refund claim assistance",
        "Response to GST notices",
        "E-way bill compliance",
      ],
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              GST Services
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Comprehensive GST registration, compliance, and advisory services
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
                The firm provides professional services in GST matters including registration, return filing,
                reconciliation, audit, and advisory services for businesses across various sectors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <h2 className="text-3xl font-heading font-bold text-primary mb-12 text-center">
            GST Services Offered
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Receipt className="h-5 w-5 text-primary" />
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

      {/* GST Returns */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
              GST Return Types
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['GSTR-1', 'GSTR-3B', 'GSTR-4', 'GSTR-5', 'GSTR-6', 'GSTR-9'].map((type) => (
                <Card key={type}>
                  <CardContent className="p-4 text-center">
                    <div className="font-semibold text-primary">{type}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">
              GST Compliance Made Easy
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get expert assistance for all your GST needs
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
