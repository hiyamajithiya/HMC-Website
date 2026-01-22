import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Table, Calculator, Bot, Zap, ArrowRight, Code } from "lucide-react"
import { prisma } from "@/lib/prisma"

// Force dynamic rendering to always fetch fresh data from database
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Automation Tools",
  description: "Download professional automation tools for accounting, tax compliance, and data processing developed by CA Himanshu Majithiya.",
}

const categoryLabels: Record<string, string> = {
  DOCUMENT_AUTOMATION: "Document Automation",
  DATA_PROCESSING: "Data Processing",
  REDACTION: "Redaction",
  TAX_TOOLS: "Tax Tools",
  COMPLIANCE: "Compliance",
  UTILITY: "Utility",
  OTHER: "Other",
}

const toolTypeLabels: Record<string, string> = {
  WEB_APP: "Web App",
  DOWNLOADABLE: "Downloadable",
  ONLINE: "Online Tool",
  HYBRID: "Hybrid",
}

const licenseLabels: Record<string, string> = {
  FREE: "Free",
  ONE_TIME: "One-time Purchase",
  ANNUAL: "Annual License",
  MONTHLY: "Monthly License",
}

// Static fallback tools for when database is empty
const staticTools = [
  {
    id: "bank-statement-converter",
    name: "Bank Statement PDF to Excel Converter",
    shortDescription: "Convert PDF bank statements to Excel format with automatic transaction categorization and analysis",
    category: "DATA_PROCESSING",
    toolType: "DOWNLOADABLE",
    licenseType: "FREE",
    features: ["OCR technology", "Auto-categorization", "Multi-bank support", "Export to Excel"],
    isActive: true,
    slug: "bank-statement-converter",
    comingSoon: true,
  },
  {
    id: "gst-data-processor",
    name: "GST Return Data Processor",
    shortDescription: "Automate GST return data processing, reconciliation, and GSTR filing preparation",
    category: "TAX_TOOLS",
    toolType: "HYBRID",
    licenseType: "FREE",
    features: ["GSTR-1 automation", "ITC reconciliation", "Error detection", "Report generation"],
    isActive: true,
    slug: "gst-data-processor",
    comingSoon: true,
  },
  {
    id: "tds-calculator",
    name: "TDS Calculator & Certificate Generator",
    shortDescription: "Calculate TDS with automatic Form 16/16A generation and quarterly return preparation",
    category: "TAX_TOOLS",
    toolType: "DOWNLOADABLE",
    licenseType: "FREE",
    features: ["All TDS sections", "Form 16/16A generation", "Quarterly returns", "Challan tracking"],
    isActive: true,
    slug: "tds-calculator",
    comingSoon: true,
  },
  {
    id: "invoice-processor",
    name: "Invoice Processing Automation",
    shortDescription: "Extract data from invoices, validate GST compliance, and update accounting records",
    category: "DOCUMENT_AUTOMATION",
    toolType: "WEB_APP",
    licenseType: "FREE",
    features: ["OCR extraction", "GST validation", "Auto-posting", "Email integration"],
    isActive: true,
    slug: "invoice-processor",
    comingSoon: true,
  },
  {
    id: "form26as-extractor",
    name: "Form 26AS Data Extractor",
    shortDescription: "Extract and analyze Form 26AS data for TDS reconciliation and ITR filing",
    category: "TAX_TOOLS",
    toolType: "DOWNLOADABLE",
    licenseType: "FREE",
    features: ["PDF parsing", "TDS reconciliation", "Excel export", "Variance analysis"],
    isActive: true,
    slug: "form26as-extractor",
    comingSoon: true,
  },
  {
    id: "compliance-reminder",
    name: "Compliance Calendar & Reminder Tool",
    shortDescription: "Automated reminders for tax due dates, GST filing deadlines, and ROC compliance",
    category: "COMPLIANCE",
    toolType: "WEB_APP",
    licenseType: "FREE",
    features: ["Email alerts", "SMS notifications", "Custom calendars", "Multi-entity support"],
    isActive: true,
    slug: "compliance-reminder",
    comingSoon: true,
  },
]

const iconMap: Record<string, any> = {
  DOCUMENT_AUTOMATION: Bot,
  DATA_PROCESSING: FileText,
  REDACTION: FileText,
  TAX_TOOLS: Calculator,
  COMPLIANCE: Zap,
  UTILITY: Table,
  OTHER: Code,
}

const colorMap: Record<string, string> = {
  DOCUMENT_AUTOMATION: "bg-orange-500/10 text-orange-600",
  DATA_PROCESSING: "bg-blue-500/10 text-blue-600",
  REDACTION: "bg-red-500/10 text-red-600",
  TAX_TOOLS: "bg-purple-500/10 text-purple-600",
  COMPLIANCE: "bg-indigo-500/10 text-indigo-600",
  UTILITY: "bg-green-500/10 text-green-600",
  OTHER: "bg-gray-500/10 text-gray-600",
}

async function getTools() {
  try {
    const tools = await prisma.tool.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    return tools
  } catch (error) {
    console.error('Failed to fetch tools:', error)
    return []
  }
}

export default async function ToolsPage() {
  const dbTools = await getTools()

  // Use database tools if available, otherwise use static fallback
  const tools = dbTools.length > 0 ? dbTools : staticTools

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <Code className="h-5 w-5" />
              <span className="text-sm font-semibold">Professional Automation Tools</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Automation Tools
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Python and Excel-based automation tools for accounting, tax compliance, and data processing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white">
                  Request Custom Tool
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/services/ai-automation">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30">
                  Automation Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-primary mb-4">
                Available Tools
              </h2>
              <p className="text-text-secondary text-lg">
                Professional automation solutions for CA firms and businesses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool: any) => {
                const Icon = iconMap[tool.category] || Code
                const color = colorMap[tool.category] || "bg-gray-500/10 text-gray-600"
                const isComingSoon = 'comingSoon' in tool ? tool.comingSoon : !tool.downloadUrl
                const features = Array.isArray(tool.features) ? tool.features : []

                return (
                  <Card key={tool.id} className="card-hover relative">
                    {isComingSoon && (
                      <div className="absolute top-4 right-4 bg-secondary text-white text-xs px-3 py-1 rounded-full font-semibold z-10">
                        Coming Soon
                      </div>
                    )}
                    <CardHeader>
                      <div className={`w-16 h-16 ${color} rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-xs text-text-muted">
                          <span className="bg-bg-secondary px-2 py-1 rounded">
                            {categoryLabels[tool.category] || tool.category}
                          </span>
                          <span>•</span>
                          <span>{toolTypeLabels[tool.toolType] || tool.toolType}</span>
                        </div>
                        <CardTitle className="text-xl font-heading">{tool.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-text-secondary mb-4">
                        {tool.shortDescription}
                      </CardDescription>

                      {features.length > 0 && (
                        <div className="space-y-3">
                          <div className="text-sm font-semibold text-primary">Key Features:</div>
                          <ul className="space-y-1">
                            {features.slice(0, 4).map((feature: string, index: number) => (
                              <li key={index} className="text-sm text-text-secondary flex items-start">
                                <span className="text-primary mr-2">•</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-6 space-y-2">
                        {tool.licenseType !== 'FREE' && tool.price && (
                          <div className="text-sm font-semibold text-primary">
                            Price: ₹{Number(tool.price).toLocaleString('en-IN')} ({licenseLabels[tool.licenseType]})
                          </div>
                        )}

                        {isComingSoon ? (
                          <Button variant="outline" disabled className="w-full">
                            Coming Soon
                          </Button>
                        ) : tool.downloadUrl ? (
                          <Link href={tool.downloadUrl} target="_blank">
                            <Button className="w-full bg-primary hover:bg-primary-light text-white">
                              <Download className="h-4 w-4 mr-2" />
                              Download Tool
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/tools/${tool.slug}`}>
                            <Button className="w-full bg-primary hover:bg-primary-light text-white">
                              View Details
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-primary mb-4">
                Why Use Our Automation Tools?
              </h2>
              <p className="text-text-secondary text-lg">
                Professional-grade tools designed by CAs for CAs and businesses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">Save Time</h3>
                  <p className="text-text-secondary">
                    Reduce manual work by 70% with automated data processing and report generation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">100% Accuracy</h3>
                  <p className="text-text-secondary">
                    Eliminate human errors with automated calculations and validations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">Easy to Use</h3>
                  <p className="text-text-secondary">
                    Simple interfaces with step-by-step instructions and support documentation
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Development Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary to-primary-light text-white">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-heading font-bold mb-4">
                  Need a Custom Automation Tool?
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  We develop custom Python and Excel-based automation solutions tailored to your specific requirements
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/services/ai-automation">
                    <Button size="lg" className="bg-secondary hover:bg-secondary-dark text-white">
                      View Automation Services
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-primary mb-4">
                Technologies We Use
              </h2>
              <p className="text-text-secondary">
                Built with modern, reliable technologies
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Python", desc: "Core scripting" },
                { name: "Excel VBA", desc: "Macro automation" },
                { name: "OCR/AI", desc: "Data extraction" },
                { name: "SQL", desc: "Data processing" },
              ].map((tech, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="font-semibold text-primary mb-1">{tech.name}</div>
                    <div className="text-sm text-text-muted">{tech.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Are these tools free to download?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary">
                    Basic versions of our tools are available for free. Premium features and customization are available through our automation services.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do I need programming knowledge?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary">
                    No programming knowledge required. All tools come with user-friendly interfaces and detailed documentation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can you customize tools for my firm?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary">
                    Yes, we provide custom automation development services. Contact us to discuss your specific requirements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
              <h3 className="font-semibold text-yellow-800 mb-2">Important Note</h3>
              <p className="text-sm text-yellow-700 mb-2">
                These automation tools are provided as-is for professional use. Users are responsible for validating outputs and ensuring compliance with applicable regulations.
              </p>
              <p className="text-sm text-yellow-700">
                For critical compliance matters, please consult with a qualified Chartered Accountant.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
