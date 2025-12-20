import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, FileSpreadsheet, File, BookOpen, ClipboardList, Wrench, FolderOpen } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Downloads",
  description: "Download useful forms, guides, templates, and automation tools for tax and compliance.",
}

export const dynamic = 'force-dynamic'

const categoryConfig: Record<string, { label: string; icon: any; color: string }> = {
  GUIDES_TEMPLATES: {
    label: "Guides & Templates",
    icon: BookOpen,
    color: "bg-orange-500/10 text-orange-600",
  },
  FORMS: {
    label: "Forms",
    icon: FileText,
    color: "bg-blue-500/10 text-blue-600",
  },
  CHECKLISTS: {
    label: "Checklists",
    icon: ClipboardList,
    color: "bg-green-500/10 text-green-600",
  },
  TOOLS: {
    label: "Tools",
    icon: Wrench,
    color: "bg-purple-500/10 text-purple-600",
  },
  OTHER: {
    label: "Other Resources",
    icon: FolderOpen,
    color: "bg-gray-500/10 text-gray-600",
  },
}

async function getDownloads() {
  try {
    const downloads = await prisma.download.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
    })

    // Group by category
    const grouped = downloads.reduce((acc, download) => {
      const category = download.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(download)
      return acc
    }, {} as Record<string, typeof downloads>)

    return grouped
  } catch (error) {
    console.error('Failed to fetch downloads:', error)
    return {}
  }
}

function getFileIcon(fileType: string) {
  switch (fileType) {
    case "PDF":
      return <FileText className="h-4 w-4 mr-1.5 text-red-500" />
    case "Excel":
      return <FileSpreadsheet className="h-4 w-4 mr-1.5 text-green-500" />
    case "Word":
      return <FileText className="h-4 w-4 mr-1.5 text-blue-500" />
    default:
      return <File className="h-4 w-4 mr-1.5" />
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

export default async function DownloadsPage() {
  const groupedDownloads = await getDownloads()
  const hasDownloads = Object.keys(groupedDownloads).length > 0

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Downloads
            </h1>
            <p className="text-xl text-white/90">
              Free forms, guides, templates, and automation tools
            </p>
          </div>
        </div>
      </section>

      {/* Download Categories */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="space-y-12 max-w-6xl mx-auto">
            {!hasDownloads ? (
              <div className="text-center py-16">
                <FolderOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Downloads Available</h3>
                <p className="text-gray-500">Check back soon for useful resources and templates.</p>
              </div>
            ) : (
              Object.entries(groupedDownloads).map(([category, downloads]) => {
                const config = categoryConfig[category] || categoryConfig.OTHER
                const Icon = config.icon

                return (
                  <div key={category}>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className={`w-12 h-12 ${config.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-heading font-bold text-primary">
                        {config.label}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {downloads.map((item) => (
                        <Card key={item.id} className="card-hover">
                          <CardHeader>
                            <CardTitle className="text-lg font-heading">{item.title}</CardTitle>
                            {item.description && (
                              <CardDescription className="text-sm text-text-secondary">
                                {item.description}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-text-muted flex items-center">
                                {getFileIcon(item.fileType)}
                                <span>{item.fileType}</span>
                                <span className="mx-2">•</span>
                                <span>{formatFileSize(item.fileSize)}</span>
                              </div>
                              <DownloadButton id={item.id} filePath={item.filePath} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Tools Section CTA */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">
              Looking for Automation Tools?
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Visit our Tools section to explore and download professional automation solutions
            </p>
            <Link href="/tools">
              <Button size="lg" className="bg-primary hover:bg-primary-light text-white">
                Explore Tools
                <Download className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r">
              <h3 className="font-semibold text-yellow-800 mb-2">Important Note</h3>
              <p className="text-sm text-yellow-700 mb-2">
                All downloadable resources are provided for informational purposes. Please ensure compliance
                with the latest regulations and consult with a qualified professional before use.
              </p>
              <p className="text-sm text-yellow-700">
                For the latest official forms, please visit respective government portals (Income Tax, GST, MCA, etc.).
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
              Need Custom Solutions?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              We can create custom automation tools tailored to your specific requirements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services/ai-automation">
                <button className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                  Automation Services
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

// Client component for download button with tracking
function DownloadButton({ id, filePath }: { id: string; filePath: string }) {
  const handleDownload = async () => {
    // Track download
    try {
      await fetch(`/api/downloads/${id}`, { method: 'POST' })
    } catch (error) {
      console.error('Failed to track download:', error)
    }
  }

  return (
    <a href={filePath} download onClick={handleDownload}>
      <Button size="sm" variant="outline" className="text-primary border-primary/50 hover:bg-primary/10">
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    </a>
  )
}
