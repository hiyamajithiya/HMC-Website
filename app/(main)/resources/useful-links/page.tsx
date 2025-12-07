import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, FileText, CreditCard, Building2, Users, Landmark, Briefcase } from "lucide-react"
import { USEFUL_LINKS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Useful Links",
  description: "Quick access to government portals and regulatory websites for Income Tax, GST, MCA, EPFO, and other compliance requirements.",
}

const categoryIcons: Record<string, any> = {
  "Income Tax": FileText,
  "GST": CreditCard,
  "MCA & ROC": Building2,
  "EPFO & ESI": Users,
  "RBI & Banking": Landmark,
  "Other Important Portals": Briefcase,
}

const categoryColors: Record<string, string> = {
  "Income Tax": "bg-blue-500/10 text-blue-600",
  "GST": "bg-green-500/10 text-green-600",
  "MCA & ROC": "bg-purple-500/10 text-purple-600",
  "EPFO & ESI": "bg-orange-500/10 text-orange-600",
  "RBI & Banking": "bg-red-500/10 text-red-600",
  "Other Important Portals": "bg-indigo-500/10 text-indigo-600",
}

export default function UsefulLinksPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Useful Links
            </h1>
            <p className="text-xl text-white/90">
              Quick access to government portals and regulatory websites
            </p>
          </div>
        </div>
      </section>

      {/* Links by Category */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {USEFUL_LINKS.map((category) => {
                const Icon = categoryIcons[category.category]
                const colorClass = categoryColors[category.category]

                return (
                  <Card key={category.category} className="card-hover">
                    <CardHeader>
                      <div className={`w-14 h-14 ${colorClass} rounded-lg flex items-center justify-center mb-3`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-xl font-heading">
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {category.links.map((link, index) => (
                          <li key={index}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start space-x-2 text-sm text-text-secondary hover:text-primary transition-colors group"
                            >
                              <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary opacity-60 group-hover:opacity-100" />
                              <span className="group-hover:underline">{link.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Important Note */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r">
              <h3 className="font-semibold text-blue-800 mb-2">Important Note</h3>
              <p className="text-sm text-blue-700 mb-2">
                These links are provided for convenience and direct you to official government portals.
                Please ensure you are visiting the correct official website before entering any sensitive information.
              </p>
              <p className="text-sm text-blue-700">
                For assistance with online filings and compliance, please contact us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">
              Need Help with Online Compliance?
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Our team can assist you with registrations, filings, and navigating government portals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/book-appointment">
                <button className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                  Book Appointment
                </button>
              </a>
              <a href="/contact">
                <button className="bg-primary hover:bg-primary-light text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                  Contact Us
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
