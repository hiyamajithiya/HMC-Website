import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, FileSpreadsheet, File, Wrench, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Downloads",
  description: "Download useful forms, guides, templates, and automation tools for tax and compliance.",
}

const downloadCategories = [
  {
    category: "Guides & Templates",
    icon: BookOpen,
    color: "bg-orange-500/10 text-orange-600",
    items: [
      {
        name: "Tax Planning Guide",
        description: "Comprehensive guide for tax saving strategies",
        fileType: "PDF",
        url: "/downloads/tax-planning-guide.txt",
        comingSoon: false,
      },
      {
        name: "GST Compliance Checklist",
        description: "Monthly GST compliance checklist",
        fileType: "PDF",
        url: "/downloads/gst-compliance-checklist.txt",
        comingSoon: false,
      },
      {
        name: "Expense Tracker Template",
        description: "Track business and personal expenses",
        fileType: "Excel",
        url: "/downloads/expense-tracker-template.txt",
        comingSoon: false,
      },
    ],
  },
]

export default function DownloadsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Downloads
            </h1>
            <p className="text-xl text-white/90">
              Free forms, guides, templates, and automation tools
            </p>
          </div>
        </div>
      </section>

      {/* Download Categories */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="space-y-12 max-w-6xl mx-auto">
            {downloadCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <div key={index}>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-primary">
                      {category.category}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {category.items.map((item, itemIndex) => (
                      <Card key={itemIndex} className="card-hover relative">
                        {item.comingSoon && (
                          <div className="absolute top-3 right-3 bg-secondary text-white text-xs px-2 py-1 rounded-full font-semibold">
                            Coming Soon
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="text-lg font-heading">{item.name}</CardTitle>
                          <CardDescription className="text-sm text-text-secondary">
                            {item.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-text-muted flex items-center">
                              <File className="h-4 w-4 mr-1.5" />
                              {item.fileType}
                            </div>
                            {!item.comingSoon && (
                              <a href={item.url} download>
                                <Button size="sm" variant="outline" className="text-primary border-primary/50 hover:bg-primary/10">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tools Section CTA */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">
              Looking for Automation Tools?
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Visit our Tools section to explore and download professional automation solutions
            </p>
            <Link href="/tools">
              <Button size="lg" className="bg-primary hover:bg-primary-light text-white">
                Explore Tools
                <Download className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
              <h3 className="font-semibold text-yellow-800 mb-2">Important Note</h3>
              <p className="text-sm text-yellow-700 mb-2">
                All downloadable resources are provided for informational purposes. Please ensure compliance
                with the latest regulations and consult with a qualified professional before use.
              </p>
              <p className="text-sm text-yellow-700">
                For the latest official forms, please visit respective government portals (Income Tax, GST, MCA, etc.).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Need Custom Solutions?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              We can create custom automation tools tailored to your specific requirements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services/ai-automation">
                <button className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                  Automation Services
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
