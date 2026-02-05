import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft, CheckCircle, Monitor, Calendar, Tag } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ContentRenderer } from "@/components/content/ContentRenderer"
import { DownloadButton } from "@/components/tools/DownloadButton"

export const dynamic = 'force-dynamic'

const categoryLabels: Record<string, string> = {
  DOCUMENT_AUTOMATION: "Document Automation",
  DATA_PROCESSING: "Data Processing",
  REDACTION: "Redaction",
  TAX_TOOLS: "Tax Tools",
  COMPLIANCE: "Compliance",
  UTILITY: "Utility",
  OTHER: "Other",
}

const toolTypeLabels: Record<string, string> = {
  WEB_APP: "Web Application",
  DOWNLOADABLE: "Downloadable",
  ONLINE: "Online Tool",
  HYBRID: "Hybrid",
}

const licenseLabels: Record<string, string> = {
  FREE: "Free",
  ONE_TIME: "One-time Purchase",
  ANNUAL: "Annual License",
  MONTHLY: "Monthly License",
}

async function getTool(slug: string) {
  try {
    const tool = await prisma.tool.findUnique({
      where: { slug, isActive: true },
    })
    return tool
  } catch (error) {
    console.error('Failed to fetch tool:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tool = await getTool(slug)

  if (!tool) {
    return {
      title: "Tool Not Found",
    }
  }

  return {
    title: `${tool.name} - Automation Tools`,
    description: tool.shortDescription,
  }
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = await getTool(slug)

  if (!tool) {
    notFound()
  }

  const features = Array.isArray(tool.features) ? tool.features : []
  const requirements = Array.isArray(tool.requirements) ? tool.requirements : []

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <Link href="/tools" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
            </Link>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {categoryLabels[tool.category] || tool.category}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {toolTypeLabels[tool.toolType] || tool.toolType}
              </span>
              {tool.version && (
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  v{tool.version}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {tool.name}
            </h1>
            <p className="text-xl text-white/90">
              {tool.shortDescription}
            </p>
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
                {/* Description */}
                {tool.longDescription && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold text-primary mb-4">Description</h2>
                      <article className="prose prose-sm max-w-none">
                        <ContentRenderer content={tool.longDescription} />
                      </article>
                    </CardContent>
                  </Card>
                )}

                {/* Features */}
                {features.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold text-primary mb-4">Key Features</h2>
                      <ul className="space-y-3">
                        {features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-text-secondary">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Requirements */}
                {requirements.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold text-primary mb-4">System Requirements</h2>
                      <ul className="space-y-2">
                        {requirements.map((req: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <Monitor className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-text-secondary">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Setup Guide */}
                {tool.setupGuide && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold text-primary mb-4">Setup Guide</h2>
                      <article className="prose prose-sm max-w-none">
                        <ContentRenderer content={tool.setupGuide} />
                      </article>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Download Card */}
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Price */}
                      <div className="text-center pb-4 border-b border-border-light">
                        {tool.licenseType === 'FREE' ? (
                          <div className="text-3xl font-bold text-green-600">Free</div>
                        ) : tool.price ? (
                          <>
                            <div className="text-3xl font-bold text-primary">
                              ₹{Number(tool.price).toLocaleString('en-IN')}
                            </div>
                            <div className="text-sm text-text-muted">
                              {licenseLabels[tool.licenseType]}
                            </div>
                          </>
                        ) : (
                          <div className="text-xl font-semibold text-primary">Contact for Price</div>
                        )}
                      </div>

                      {/* Download Button */}
                      {tool.downloadUrl ? (
                        <DownloadButton
                          toolId={tool.id}
                          toolName={tool.name}
                          hasDownloadUrl={!!tool.downloadUrl}
                        />
                      ) : (
                        <Link href="/contact" className="block">
                          <Button className="w-full bg-secondary hover:bg-secondary-dark text-white" size="lg">
                            Request Access
                          </Button>
                        </Link>
                      )}

                      {/* Tool Info */}
                      <div className="space-y-3 pt-4 border-t border-border-light">
                        <div className="flex items-center text-sm text-text-muted">
                          <Tag className="h-4 w-4 mr-2" />
                          <span>Category: {categoryLabels[tool.category] || tool.category}</span>
                        </div>
                        <div className="flex items-center text-sm text-text-muted">
                          <Monitor className="h-4 w-4 mr-2" />
                          <span>Type: {toolTypeLabels[tool.toolType] || tool.toolType}</span>
                        </div>
                        {tool.version && (
                          <div className="flex items-center text-sm text-text-muted">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Version: {tool.version}</span>
                          </div>
                        )}
                        {tool.downloadCount > 0 && (
                          <div className="flex items-center text-sm text-text-muted">
                            <Download className="h-4 w-4 mr-2" />
                            <span>{tool.downloadCount} downloads</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Need Help Card */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-primary mb-2">Need Help?</h3>
                    <p className="text-sm text-text-muted mb-4">
                      Contact us for support or custom development
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
