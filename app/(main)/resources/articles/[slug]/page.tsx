import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Download,
  FileText,
  FileSpreadsheet,
  File,
  BookOpen,
  ClipboardList,
  Wrench,
  FolderOpen,
  Tag,
  Calendar,
} from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ArticleDownloadButton } from "@/components/articles/ArticleDownloadButton"
import { ShareButton } from "@/components/blog/ShareButton"

export const dynamic = "force-dynamic"

const categoryConfig: Record<
  string,
  { label: string; icon: any; color: string; bg: string }
> = {
  GUIDES_TEMPLATES: {
    label: "Guides & Templates",
    icon: BookOpen,
    color: "text-orange-600",
    bg: "bg-orange-500/10",
  },
  FORMS: {
    label: "Forms",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },
  CHECKLISTS: {
    label: "Checklists",
    icon: ClipboardList,
    color: "text-green-600",
    bg: "bg-green-500/10",
  },
  TOOLS: {
    label: "Tools",
    icon: Wrench,
    color: "text-purple-600",
    bg: "bg-purple-500/10",
  },
  OTHER: {
    label: "Other Resources",
    icon: FolderOpen,
    color: "text-gray-600",
    bg: "bg-gray-500/10",
  },
}

function getFileIcon(fileType: string) {
  switch (fileType) {
    case "PDF":
      return <FileText className="h-6 w-6 text-red-500" />
    case "Excel":
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />
    case "Word":
      return <FileText className="h-6 w-6 text-blue-500" />
    default:
      return <File className="h-6 w-6 text-gray-500" />
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

async function getArticle(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug, isActive: true },
    })
    return article
  } catch (error) {
    console.error("Failed to fetch article:", error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return { title: "Article Not Found" }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://himanshumajithiya.com'
  const ogImage = article.socialImage || article.coverImage
  const description = article.description || `Download ${article.title}`

  return {
    title: `${article.title} - Articles`,
    description,
    openGraph: {
      title: article.title,
      description,
      ...(ogImage && {
        images: [{ url: `${siteUrl}${ogImage}` }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      ...(ogImage && {
        images: [`${siteUrl}${ogImage}`],
      }),
    },
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const config = categoryConfig[article.category] || categoryConfig.OTHER
  const CategoryIcon = config.icon

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/resources/articles"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Link>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {config.label}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm inline-flex items-center gap-1.5">
                {article.fileType}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {article.title}
            </h1>
            {article.description && (
              <p className="text-xl text-white/90">{article.description}</p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Cover Image */}
                {article.coverImage && (
                  <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                {/* Description */}
                {article.description && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold text-primary mb-4">
                        About this Article
                      </h2>
                      <p className="text-text-secondary leading-relaxed">
                        {article.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* File Details */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">
                      File Details
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-bg-secondary rounded-lg">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          {getFileIcon(article.fileType)}
                        </div>
                        <div>
                          <p className="font-medium text-primary">
                            {article.fileName}
                          </p>
                          <p className="text-sm text-text-muted">
                            {article.fileType} · {formatFileSize(article.fileSize)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Download Card */}
                <Card className="sticky top-24 z-10 bg-white">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Free Badge */}
                      <div className="text-center pb-4 border-b border-border-light">
                        <div className="text-3xl font-bold text-green-600">
                          Free
                        </div>
                      </div>

                      {/* Download Button */}
                      <ArticleDownloadButton
                        articleId={article.id}
                        articleName={article.title}
                      />

                      {/* Share Button */}
                      <div className="flex justify-center pt-2">
                        <ShareButton
                          title={article.title}
                          url={`/resources/articles/${article.slug}`}
                        />
                      </div>

                      {/* Article Info */}
                      <div className="space-y-3 pt-4 border-t border-border-light">
                        <div className="flex items-center text-sm text-text-muted">
                          <Tag className="h-4 w-4 mr-2" />
                          <span>Category: {config.label}</span>
                        </div>
                        <div className="flex items-center text-sm text-text-muted">
                          {getFileIcon(article.fileType)}
                          <span className="ml-2">
                            Type: {article.fileType} ({formatFileSize(article.fileSize)})
                          </span>
                        </div>
                        {article.downloadCount > 0 && (
                          <div className="flex items-center text-sm text-text-muted">
                            <Download className="h-4 w-4 mr-2" />
                            <span>
                              {article.downloadCount} downloads
                            </span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-text-muted">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            Added:{" "}
                            {new Date(article.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Need Help Card */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-primary mb-2">
                      Need Help?
                    </h3>
                    <p className="text-sm text-text-muted mb-4">
                      Contact us for support or custom resources
                    </p>
                    <Link href="/contact">
                      <Button variant="outline" className="w-full">
                        Contact Support
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
