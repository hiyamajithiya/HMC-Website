import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, CheckCircle, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "FFMC Compliance (RBI)",
  description: "Full Fledged Money Changer compliance, concurrent audit, and RBI regulatory services by CA Himanshu Majithiya in Ahmedabad.",
}

export default function FFMCCompliancePage() {
  const services = [
    {
      title: "FFMC Concurrent Audit",
      items: [
        "Monthly concurrent audit as per RBI guidelines",
        "Transaction verification and validation",
        "KYC/AML compliance review",
        "Foreign exchange transaction audit",
        "Regulatory compliance assessment",
        "Audit report submission to RBI",
      ],
    },
    {
      title: "Regulatory Compliance",
      items: [
        "FEMA compliance",
        "RBI circular implementation",
        "PMLA compliance",
        "Reporting to authorities",
        "License renewal assistance",
        "Inspection readiness",
      ],
    },
    {
      title: "Documentation & Reporting",
      items: [
        "Transaction documentation review",
        "Statutory register maintenance",
        "Monthly return preparation",
        "Annual compliance certificate",
        "Regulatory correspondence",
        "Record keeping compliance",
      ],
    },
    {
      title: "Advisory Services",
      items: [
        "Compliance framework setup",
        "Policy and procedure development",
        "Staff training on compliance",
        "Risk mitigation strategies",
        "Operational process review",
        "Technology system compliance",
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
              FFMC Compliance (RBI)
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Full Fledged Money Changer compliance, audit, and RBI regulatory services
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
                The firm provides specialized services for Full Fledged Money Changers (FFMC) including
                concurrent audit as per RBI guidelines, regulatory compliance, and advisory services for
                foreign exchange operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <h2 className="text-3xl font-heading font-bold text-primary mb-12 text-center">
            FFMC Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Building2 className="h-5 w-5 text-primary" />
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

      {/* Key Regulations */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
              Regulatory Framework
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-lg font-bold text-primary mb-2">FEMA</div>
                  <div className="text-sm text-text-muted">Foreign Exchange Management Act</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-lg font-bold text-primary mb-2">RBI</div>
                  <div className="text-sm text-text-muted">Reserve Bank Guidelines</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-lg font-bold text-primary mb-2">PMLA</div>
                  <div className="text-sm text-text-muted">Prevention of Money Laundering</div>
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
              FFMC Compliance Services
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Expert assistance for Full Fledged Money Changer compliance
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
