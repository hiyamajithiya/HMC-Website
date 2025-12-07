import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog & Articles",
  description: "Read our latest articles on tax updates, GST, compliance, automation, and professional insights.",
}

// Placeholder blog posts - these would come from database in production
const blogPosts = [
  {
    id: 1,
    title: "Income Tax Updates for Assessment Year 2024-25",
    excerpt: "Key changes and updates in Income Tax for the current assessment year including new tax regime benefits and deduction changes.",
    category: "Tax Updates",
    date: "2024-12-01",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "GST Compliance Checklist for Businesses",
    excerpt: "Essential GST compliance requirements every business should follow to avoid penalties and ensure smooth operations.",
    category: "GST Updates",
    date: "2024-11-28",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Automating Tax Calculations with Python",
    excerpt: "Learn how to automate repetitive tax calculations using Python scripts, saving time and reducing errors.",
    category: "Automation Tips",
    date: "2024-11-25",
    readTime: "10 min read",
  },
  {
    id: 4,
    title: "FFMC Compliance: RBI Guidelines Overview",
    excerpt: "Understanding RBI guidelines for Full Fledged Money Changers and key compliance requirements.",
    category: "FFMC/RBI",
    date: "2024-11-20",
    readTime: "6 min read",
  },
  {
    id: 5,
    title: "Important Compliance Deadlines for December 2024",
    excerpt: "Mark your calendar with important tax and compliance deadlines for the month of December.",
    category: "Compliance",
    date: "2024-11-15",
    readTime: "4 min read",
  },
  {
    id: 6,
    title: "New vs Old Tax Regime: Which One to Choose?",
    excerpt: "Comparative analysis of new and old tax regimes to help you make an informed decision.",
    category: "Tax Updates",
    date: "2024-11-10",
    readTime: "8 min read",
  },
]

const categories = ["All", "Tax Updates", "GST Updates", "Automation Tips", "Compliance", "FFMC/RBI"]

export default function BlogPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Blog & Articles
            </h1>
            <p className="text-xl text-white/90">
              Professional insights on tax, compliance, and automation
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 ${
                  category === "All"
                    ? "bg-primary hover:bg-primary-light"
                    : "hover:bg-primary/10"
                }`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {blogPosts.map((post) => (
              <Card key={post.id} className="card-hover flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-xs text-text-muted">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-heading line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto">
                    <div className="flex items-center text-xs text-text-muted mb-3">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(post.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-primary font-medium text-sm">
                      Read Article →
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Notice */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">
              More Articles Coming Soon
            </h2>
            <p className="text-text-secondary mb-6">
              We regularly publish articles on tax updates, compliance requirements, and automation tips.
              Subscribe to stay updated with the latest content.
            </p>
            <Link href="/contact">
              <button className="bg-primary hover:bg-primary-light text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                Subscribe for Updates
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
