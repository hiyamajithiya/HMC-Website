import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ShareButton } from "@/components/blog/ShareButton"
import { ContentRenderer } from "@/components/content/ContentRenderer"
import { BlogCoverImage } from "@/components/blog/BlogCoverImage"
import { generateArticleSchema } from "@/lib/schema"

interface Props {
  params: Promise<{ slug: string }>
}

const categoryLabels: Record<string, string> = {
  TAX_UPDATES: "Tax Updates",
  GST_UPDATES: "GST Updates",
  AUTOMATION_TIPS: "Automation Tips",
  COMPLIANCE: "Compliance",
  FFMC_RBI: "FFMC/RBI",
  GENERAL: "General",
}

async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (post && post.isPublished) {
      // Increment view count
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      })
    }

    return post
  } catch (error) {
    console.error('Failed to fetch blog post:', error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  })

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

function estimateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${Math.max(2, minutes)} min read`
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post || !post.isPublished) {
    notFound()
  }

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    publishedDate: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    modifiedDate: post.updatedAt.toISOString(),
    image: post.coverImage || undefined,
  })

  return (
    <div>
      {/* JSON-LD Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/resources/blog"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-secondary text-white">
                {categoryLabels[post.category] || post.category}
              </Badge>
              <span className="text-white/60 text-sm flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {estimateReadTime(post.content)}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
              {post.title}
            </h1>

            <p className="text-xl text-white/90 mb-6">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 text-white/70 text-sm">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Recently Published'}
              </span>
              {post.viewCount > 0 && (
                <span>{post.viewCount} views</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Cover Image with error handling */}
            {post.coverImage && (
              <BlogCoverImage src={post.coverImage} alt={post.title} />
            )}

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              <ContentRenderer content={post.content} />
            </article>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border-light">
                <h3 className="text-sm font-semibold text-text-muted mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-8 pt-8 border-t border-border-light">
              <div className="flex items-center justify-between">
                <Link
                  href="/resources/blog"
                  className="text-primary hover:underline flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to all articles
                </Link>
                <ShareButton title={post.title} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">
              Need Professional Assistance?
            </h2>
            <p className="text-text-secondary mb-6">
              Our team of experts is here to help you with tax planning, compliance, and automation solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <button className="bg-primary hover:bg-primary-light text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                  Contact Us
                </button>
              </Link>
              <Link href="/services">
                <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                  Our Services
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
