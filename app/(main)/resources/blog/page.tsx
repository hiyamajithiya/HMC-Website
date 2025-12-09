import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, BookOpen } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Blog & Articles",
  description: "Read our latest articles on tax updates, GST, compliance, automation, and professional insights.",
}

const categoryLabels: Record<string, string> = {
  TAX_UPDATES: "Tax Updates",
  GST_UPDATES: "GST Updates",
  AUTOMATION_TIPS: "Automation Tips",
  COMPLIANCE: "Compliance",
  FFMC_RBI: "FFMC/RBI",
  GENERAL: "General",
}

const categories = ["All", "Tax Updates", "GST Updates", "Automation Tips", "Compliance", "FFMC/RBI", "General"]

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        publishedAt: true,
        viewCount: true,
      },
    })
    return posts
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
    return []
  }
}

function estimateReadTime(excerpt: string): string {
  const wordsPerMinute = 200
  const wordCount = excerpt.split(/\s+/).length * 3 // Approximate based on excerpt
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${Math.max(2, minutes)} min read`
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts()

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
          {blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {blogPosts.map((post) => (
                <Link key={post.id} href={`/resources/blog/${post.slug}`}>
                  <Card className="card-hover flex flex-col h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {categoryLabels[post.category] || post.category}
                        </Badge>
                        <div className="flex items-center text-xs text-text-muted">
                          <Clock className="h-3 w-3 mr-1" />
                          {estimateReadTime(post.excerpt)}
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
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Recently'}
                        </div>
                        <div className="text-primary font-medium text-sm">
                          Read Article →
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">
                No Articles Yet
              </h2>
              <p className="text-text-secondary mb-6">
                We are working on publishing articles on tax updates, compliance requirements, and automation tips.
                Check back soon!
              </p>
            </div>
          )}
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
