import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, List, ChevronLeft, ChevronRight } from "lucide-react"
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

async function getSeriesPosts(seriesName: string) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        seriesName,
        isPublished: true,
      },
      orderBy: { seriesOrder: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        seriesOrder: true,
      },
    })
    return posts
  } catch (error) {
    console.error('Failed to fetch series posts:', error)
    return []
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

  // Fetch series posts if this post belongs to a series
  const seriesPosts = post.seriesName
    ? await getSeriesPosts(post.seriesName)
    : []

  const currentIndex = seriesPosts.findIndex(p => p.id === post.id)
  const prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null
  const nextPost = currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null

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

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-secondary text-white">
                {categoryLabels[post.category] || post.category}
              </Badge>
              {post.seriesName && (
                <Badge variant="secondary" className="bg-purple-600 text-white">
                  <List className="h-3 w-3 mr-1" />
                  {post.seriesName} {post.seriesOrder ? `- Part ${post.seriesOrder}` : ''}
                </Badge>
              )}
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

            {/* Series Navigation */}
            {seriesPosts.length > 1 && (
              <div className="mt-8 pt-8 border-t border-border-light">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-heading font-bold text-purple-800 mb-4 flex items-center gap-2">
                    <List className="h-5 w-5" />
                    {post.seriesName}
                  </h3>
                  <ol className="space-y-2">
                    {seriesPosts.map((seriesPost, index) => (
                      <li key={seriesPost.id}>
                        {seriesPost.id === post.id ? (
                          <span className="flex items-center gap-2 text-sm font-semibold text-purple-800 bg-purple-100 rounded px-3 py-2">
                            <span className="bg-purple-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                              {seriesPost.seriesOrder || index + 1}
                            </span>
                            {seriesPost.title}
                            <span className="text-xs text-purple-500 ml-auto flex-shrink-0">(You are here)</span>
                          </span>
                        ) : (
                          <Link
                            href={`/resources/blog/${seriesPost.slug}`}
                            className="flex items-center gap-2 text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-100 rounded px-3 py-2 transition-colors"
                          >
                            <span className="bg-purple-200 text-purple-700 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                              {seriesPost.seriesOrder || index + 1}
                            </span>
                            {seriesPost.title}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ol>

                  {/* Prev / Next Navigation */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-purple-200">
                    {prevPost ? (
                      <Link
                        href={`/resources/blog/${prevPost.slug}`}
                        className="flex items-center gap-1 text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous: {prevPost.title}
                      </Link>
                    ) : (
                      <div />
                    )}
                    {nextPost ? (
                      <Link
                        href={`/resources/blog/${nextPost.slug}`}
                        className="flex items-center gap-1 text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors text-right"
                      >
                        Next: {nextPost.title}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            )}

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
