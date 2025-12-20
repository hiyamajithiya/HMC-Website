import { Metadata } from "next"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { BlogCategoryFilter } from "@/components/blog/BlogCategoryFilter"

export const metadata: Metadata = {
  title: "Blog & Articles",
  description: "Read our latest articles on tax updates, GST, compliance, automation, and professional insights.",
}

export const dynamic = 'force-dynamic'

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

      {/* Category Filter and Blog Posts */}
      <BlogCategoryFilter posts={blogPosts} />

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
