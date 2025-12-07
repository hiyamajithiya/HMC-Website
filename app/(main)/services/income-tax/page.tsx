import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle, ArrowRight } from "lucide-react"
import { SITE_INFO } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Income Tax Services",
  description: "Professional Income Tax services including ITR filing, tax planning, assessment representation, and NRI taxation by CA Himanshu Majithiya in Ahmedabad.",
}

export default function IncomeTaxPage() {
  const services = [
    {
      title: "Income Tax Return Filing",
      items: [
        "ITR-1 (Sahaj) - For salaried individuals",
        "ITR-2 - For individuals with capital gains",
        "ITR-3 - For business/professional income",
        "ITR-4 (Sugam) - For presumptive taxation",
        "ITR-5 - For firms and LLPs",
        "ITR-6 - For companies",
        "ITR-7 - For trusts and charitable organizations",
      ],
    },
    {
      title: "Tax Planning & Advisory",
      items: [
        "Tax optimization strategies",
        "Deduction planning under various sections",
        "New vs Old tax regime analysis",
        "Investment planning for tax savings",
        "Capital gains tax planning",
        "Advance tax computation and payment",
      ],
    },
    {
      title: "Assessment & Appeals",
      items: [
        "Scrutiny assessment representation",
        "Response to income tax notices",
        "Appeals before CIT(A)",
        "Rectification applications",
        "Revision petitions",
        "Settlement Commission matters",
      ],
    },
    {
      title: "NRI Taxation",
      items: [
        "Residential status determination",
        "DTAA benefits",
        "Foreign income taxation",
        "Form 15CA/15CB compliance",
        "TDS on foreign remittances",
        "Tax residency certificates",
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
              Income Tax Services
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Comprehensive Income Tax compliance, planning, and advisory services
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
                The firm provides professional services in Income Tax matters, including return filing,
                tax planning, assessment proceedings, and advisory services for individuals, businesses,
                and NRIs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <h2 className="text-3xl font-heading font-bold text-primary mb-12 text-center">
            Areas of Service
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <FileText className="h-5 w-5 text-primary" />
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

      {/* Key Features */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
              Service Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">ITR</div>
                  <div className="text-sm text-text-muted">All Forms Supported</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">E-Filing</div>
                  <div className="text-sm text-text-muted">Digital Processing</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">Expert</div>
                  <div className="text-sm text-text-muted">Professional Support</div>
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
              Need Income Tax Assistance?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Contact us for professional Income Tax services and advisory
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
