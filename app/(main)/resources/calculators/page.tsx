import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, IndianRupee, FileText, CreditCard, Home, TrendingUp, Scale, ShoppingCart, AlertCircle, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Tax Calculators",
  description: "Free online tax calculators for Income Tax, GST, TDS, EMI, and other financial calculations.",
}

const calculators = [
  {
    id: "income-tax",
    title: "Income Tax Calculator",
    description: "Calculate your income tax liability for both old and new tax regimes",
    icon: IndianRupee,
    color: "bg-blue-500/10 text-blue-600",
    comingSoon: false,
  },
  {
    id: "gst",
    title: "GST Calculator",
    description: "Calculate GST amount, exclusive and inclusive of tax",
    icon: FileText,
    color: "bg-green-500/10 text-green-600",
    comingSoon: false,
  },
  {
    id: "gst-composition",
    title: "GST Composition vs Regular",
    description: "Compare tax liability under Composition and Regular scheme",
    icon: Scale,
    color: "bg-teal-500/10 text-teal-600",
    comingSoon: false,
  },
  {
    id: "gst-rcm",
    title: "GST RCM Calculator",
    description: "Calculate GST under Reverse Charge Mechanism",
    icon: AlertCircle,
    color: "bg-cyan-500/10 text-cyan-600",
    comingSoon: false,
  },
  {
    id: "gst-tcs",
    title: "E-commerce TCS Calculator",
    description: "Calculate TCS collected by e-commerce platforms",
    icon: ShoppingCart,
    color: "bg-emerald-500/10 text-emerald-600",
    comingSoon: false,
  },
  {
    id: "gst-interest",
    title: "GST Interest & Late Fee",
    description: "Calculate interest and late fee for delayed GST payment",
    icon: Clock,
    color: "bg-amber-500/10 text-amber-600",
    comingSoon: false,
  },
  {
    id: "tds",
    title: "TDS Calculator",
    description: "Calculate TDS on salary, professional fees, and other payments",
    icon: CreditCard,
    color: "bg-purple-500/10 text-purple-600",
    comingSoon: false,
  },
  {
    id: "emi",
    title: "EMI Calculator",
    description: "Calculate EMI for home loans, car loans, and personal loans",
    icon: Home,
    color: "bg-orange-500/10 text-orange-600",
    comingSoon: false,
  },
  {
    id: "capital-gains",
    title: "Capital Gains Calculator",
    description: "Calculate short-term and long-term capital gains tax",
    icon: TrendingUp,
    color: "bg-red-500/10 text-red-600",
    comingSoon: false,
  },
  {
    id: "advance-tax",
    title: "Advance Tax Calculator",
    description: "Calculate advance tax liability and payment schedule",
    icon: Calculator,
    color: "bg-indigo-500/10 text-indigo-600",
    comingSoon: false,
  },
]

export default function CalculatorsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Tax Calculators
            </h1>
            <p className="text-xl text-white/90">
              Free online calculators for accurate tax and financial calculations
            </p>
          </div>
        </div>
      </section>

      {/* Calculators Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {calculators.map((calc) => {
              const Icon = calc.icon
              const content = (
                <Card
                  className={`card-hover relative h-full ${
                    calc.comingSoon ? "opacity-75" : "cursor-pointer"
                  }`}
                >
                  {calc.comingSoon && (
                    <div className="absolute top-4 right-4 bg-secondary text-white text-xs px-3 py-1 rounded-full font-semibold">
                      Coming Soon
                    </div>
                  )}
                  <CardHeader>
                    <div className={`w-16 h-16 ${calc.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-heading">{calc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-text-secondary">
                      {calc.description}
                    </CardDescription>
                    {!calc.comingSoon && (
                      <div className="mt-4 text-primary font-medium">
                        Calculate Now →
                      </div>
                    )}
                  </CardContent>
                </Card>
              )

              return calc.comingSoon ? (
                <div key={calc.id}>{content}</div>
              ) : (
                <Link key={calc.id} href={`/resources/calculators/${calc.id}`}>
                  {content}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
              How to Use Our Calculators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">1</div>
                  <div className="text-sm font-semibold mb-2">Select Calculator</div>
                  <div className="text-xs text-text-muted">Choose the calculator you need</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">2</div>
                  <div className="text-sm font-semibold mb-2">Enter Details</div>
                  <div className="text-xs text-text-muted">Fill in the required information</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">3</div>
                  <div className="text-sm font-semibold mb-2">Get Results</div>
                  <div className="text-xs text-text-muted">View detailed calculation results</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
              <h3 className="font-semibold text-yellow-800 mb-2">Important Note</h3>
              <p className="text-sm text-yellow-700">
                These calculators are provided for informational purposes only. For accurate tax calculations
                and filing, please consult with a qualified Chartered Accountant.
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
              Need Professional Tax Assistance?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get expert guidance on tax planning and compliance
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
