import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, CheckCircle, ArrowRight, Download } from "lucide-react"
import { generateServiceSchema, generateBreadcrumbSchema } from "@/lib/schema"

export const metadata: Metadata = {
  title: "AI & Workflow Automation",
  description: "Document automation, data processing, custom Python solutions, and workflow optimization services by CA Himanshu Majithiya in Ahmedabad.",
}

const serviceSchema = generateServiceSchema({
  name: "AI & Workflow Automation",
  description: "Document automation, data processing, custom Python solutions, and process optimization.",
  url: "/services/ai-automation",
})

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Services", url: "/services" },
  { name: "AI & Automation", url: "/services/ai-automation" },
])

export default function AIAutomationPage() {
  const services = [
    {
      title: "Document Automation",
      items: [
        "PDF data extraction and processing",
        "Automated document generation",
        "Bulk document processing",
        "Form filling automation",
        "Document classification",
        "OCR and data capture",
      ],
    },
    {
      title: "Data Processing Solutions",
      items: [
        "Excel automation using Python",
        "Data cleaning and validation",
        "Report generation automation",
        "Database management solutions",
        "Data migration and transformation",
        "Automated reconciliation",
      ],
    },
    {
      title: "Custom Python Tools",
      items: [
        "Tax calculation tools",
        "Compliance checkers",
        "Data analysis scripts",
        "Process automation bots",
        "Custom calculators",
        "Integration scripts",
      ],
    },
    {
      title: "Workflow Optimization",
      items: [
        "Process mapping and analysis",
        "Bottleneck identification",
        "Automation opportunity assessment",
        "Custom solution development",
        "Implementation support",
        "Training and documentation",
      ],
    },
  ]

  const toolsOffered = [
    "Bank Statement PDF to Excel Converter",
    "GST Return Data Processor",
    "TDS Calculation and Certificate Generator",
    "Invoice Processing Automation",
    "Form 26AS Data Extractor",
    "Compliance Calendar Reminder Tool",
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
              AI & Workflow Automation
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Document automation, data processing, and custom Python solutions for professionals
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book-appointment">
                <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white">
                  Schedule Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/tools">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30">
                  Browse Tools
                  <Download className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                The firm provides automation solutions using AI and Python to streamline workflows,
                reduce manual work, and improve efficiency for accounting and compliance processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <h2 className="text-3xl font-heading font-bold text-primary mb-12 text-center">
            Automation Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-5 w-5 text-primary" />
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

      {/* Available Tools */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
              Downloadable Tools
            </h2>
            <Card>
              <CardContent className="p-8">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {toolsOffered.map((tool, index) => (
                    <li key={index} className="flex items-start space-x-3 text-text-secondary">
                      <Download className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 text-center">
                  <Link href="/tools">
                    <Button className="bg-secondary hover:bg-secondary-dark text-white">
                      View All Tools
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
              Benefits of Automation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">70%</div>
                  <div className="text-sm text-text-muted">Time Saved</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">99%</div>
                  <div className="text-sm text-text-muted">Accuracy</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-text-muted">Processing</div>
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
              Automate Your Workflow
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get custom automation solutions tailored to your needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-appointment">
                <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white">
                  Book Consultation
                </Button>
              </Link>
              <Link href="/tools">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30">
                  Explore Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
