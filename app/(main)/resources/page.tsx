import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calculator, Calendar, Download, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Resources",
  description: "Access professional resources including blog articles, tax calculators, compliance calendar, and downloadable tools.",
}

const resources = [
  {
    id: "blog",
    title: "Blog & Articles",
    description: "Read our latest articles on tax updates, GST, compliance, and automation tips",
    icon: BookOpen,
    href: "/resources/blog",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    id: "calculators",
    title: "Tax Calculators",
    description: "Free online calculators for Income Tax, GST, TDS, and EMI calculations",
    icon: Calculator,
    href: "/resources/calculators",
    color: "bg-green-500/10 text-green-600",
  },
  {
    id: "compliance-calendar",
    title: "Compliance Calendar",
    description: "Stay updated with Income Tax, GST, ROC, and other compliance due dates",
    icon: Calendar,
    href: "/resources/compliance-calendar",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    id: "useful-links",
    title: "Useful Links",
    description: "Quick access to Income Tax, GST, MCA, and other government portals",
    icon: ExternalLink,
    href: "/resources/useful-links",
    color: "bg-red-500/10 text-red-600",
  },
  {
    id: "downloads",
    title: "Downloads",
    description: "Download useful forms, guides, and automation tools",
    icon: Download,
    href: "/resources/downloads",
    color: "bg-orange-500/10 text-orange-600",
  },
]

export default function ResourcesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Resources
            </h1>
            <p className="text-xl text-white/90">
              Professional resources and tools for tax planning and compliance
            </p>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {resources.map((resource) => {
              const Icon = resource.icon
              return (
                <Link key={resource.id} href={resource.href}>
                  <Card className="card-hover h-full border-2 border-transparent hover:border-primary/20">
                    <CardHeader>
                      <div className={`w-16 h-16 ${resource.color} rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-2xl font-heading">{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-text-secondary text-base">
                        {resource.description}
                      </CardDescription>
                      <div className="mt-4 text-primary font-medium">
                        Access Now →
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold text-primary mb-6">
              Stay Informed and Compliant
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Access professional resources to stay updated with latest tax laws, compliance requirements,
              and useful tools for financial planning.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">Free</div>
                  <div className="text-sm text-text-muted">All Resources</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">Updated</div>
                  <div className="text-sm text-text-muted">Regular Updates</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">Accurate</div>
                  <div className="text-sm text-text-muted">Verified Information</div>
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
              Need Professional Guidance?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Contact us for personalized tax and compliance advice
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
